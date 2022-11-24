import { EquipmentController } from './equipment.controller';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { configurations, hostUrlConfig, pathUrl } from 'src/common/configs';
import { ViewImg } from 'src/common/constants';
import { GetAllPaginationDTO } from 'src/common/dto/get_all.dto';
import { ResponseCommon } from 'src/common/dto/respone.dto';
import { IResponse } from 'src/common/Interfaces/respone.interface';
import { Brackets, Like, Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { GetAllEquipmentDto } from './dto/get-all-equipment.dto';
import { EmployeeService } from '../employee/employee.service';
import { CreateEquipmentDto, UpdateEquipmentDto } from './dto/equipment.dto';
import { EquipmentEntity } from './entities/equipment.entity';
import { ListId } from 'src/common/dto/list-id.dto';
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
const QRCode = require('qrcode');

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(EquipmentEntity)
    private readonly equipmentRepository: Repository<EquipmentEntity>,
    private readonly categoryService: CategoryService,
    private readonly employeeService: EmployeeService,
  ) {}

  private readonly logger = new Logger(EquipmentService.name);

  async createEquipment(equipmentDto: CreateEquipmentDto, files: any): Promise<IResponse> {
    const { avatar, imgs } = files;

    // Check category in database
    const cate = await this.categoryService.getCategory(equipmentDto.idCategory);
    if (!cate.success) {
      return cate
    }

    // Check employee in database
    const emp = await this.employeeService.getEmployee(equipmentDto.idEmployee);
    if (!emp.success) {
      return emp
    }

    // handle avatar
    if (avatar && avatar.length > 0) {
        equipmentDto.avatar = `${pathUrl.imageEquipment}/${avatar[0].filename}` 
    }
    else {
        equipmentDto.avatar = ''
    }

    // Map data create
    const dataInsert = plainToClass(EquipmentEntity, {
      equipmentName: equipmentDto.equipmentName,
      description: equipmentDto.description,
      avatar: equipmentDto.avatar,
      color: equipmentDto.color,
      efficiency: equipmentDto.efficiency,
      insurance: equipmentDto.insurance,
      latitude: equipmentDto.latitude,
      longitude: equipmentDto.longitude,
      wattage: equipmentDto.wattage,
      series: equipmentDto.series,
      size: equipmentDto.size,
      status: equipmentDto.status,
      weight: equipmentDto.weight,
      electricity: equipmentDto.electricity,
      category: cate.data,
      employee: emp.data,
      statusEquipment: equipmentDto.statusEquipment
    });

    // Save database
    const resultInDb = await this.equipmentRepository.save(dataInsert);

    // Gen QR
    const qr = await this.generageQRCode(dataInsert.id);

    resultInDb.qr = qr.data;

    const equi = await this.equipmentRepository.save(resultInDb);


    if (equi) {
      return new ResponseCommon(201, true, 'CREATE_SUCCESS', resultInDb);
    }
    return new ResponseCommon(500, false, 'SERVER_ERROR', null);
  }

  async getEquipment(equiId: string): Promise<IResponse> {
    const equi = await this.equipmentRepository.createQueryBuilder('equipment')
                                                .leftJoinAndSelect('equipment.category', 'category')
              
                                                .where('equipment.id = :equiId', { equiId })
                                                .andWhere('equipment.isDelete = false')
                                                .getOne();
    if (!equi) {
      return new ResponseCommon(404, false, 'CANNOT_FOUND_EQUIPMENT', null);
    }
    if(equi.avatar)
      equi.avatar = await this.converUrlImage(equi.avatar)
    return new ResponseCommon(200, true, 'GET_DETAIL_SUCCESS', equi);
  }

  async generageQRCode(id: string): Promise<IResponse> {
    const generageQR = async (text) => {
      try {
        return await QRCode.toDataURL(text);
      } catch (err) {
        return err;
      }
    };
    const qrcode = await generageQR(JSON.stringify(id));
    if (qrcode) return new ResponseCommon(201, true, 'SUCCESS', qrcode);
    return new ResponseCommon(400, false, 'FAIL_GENERATE_QRCODE');
  }

  async updateEquipment(id: string, updateEqui: UpdateEquipmentDto): Promise<IResponse> {
    const equi = await this.equipmentRepository.findOne({ where: { id,isDelete:false } });
    if (!equi) {
      return new ResponseCommon(400, false, 'EQUIPMENT_NOT_EXIST', null);
    } else {
      let dataUpdate = plainToClassFromExist(equi, {
        equipmentName: updateEqui.equipmentName,
        description: updateEqui.description,
        color: updateEqui.color,
        status: updateEqui.status,
        size: updateEqui.size,
        wattage: updateEqui.wattage,
        efficiency: updateEqui.efficiency,
        insurance: updateEqui.insurance,
        series: updateEqui.series,
        longitude: updateEqui.longitude,
        latitude: updateEqui.latitude,
        weight: updateEqui.weight,
        electricity: updateEqui.efficiency,
        statusEquipment: updateEqui.statusEquipment
      })
      const dataUpdateNew = await this.equipmentRepository.save(dataUpdate)
      return new ResponseCommon(200, true, 'UPDATE_EQUIPMENT_SUCCESS', dataUpdateNew);
    }
  }

  //Update column IsDelete thành true
  async deleteEquipment(equiId: string): Promise<IResponse> {
    const equiDelete = await this.equipmentRepository.findOne({
      where: { id: equiId, },
    });
    if (equiDelete) {
      equiDelete.isDelete = true;
      await this.equipmentRepository.update(equiId, equiDelete);
      return new ResponseCommon(200, true, 'EQUIPMENT_IS_DELETE');
    } else {
      return new ResponseCommon(404, false, 'NOT_FOUND_EQUIPMENT');
    }
  }

  //Update column IsDelete thành true
  async restoreEquipment(equiId: string): Promise<IResponse> {
    const equiDelete = await this.equipmentRepository.findOne({
      where: { id: equiId, },
    });
    if (equiDelete) {
      equiDelete.isDelete = false;
      await this.equipmentRepository.update(equiId, equiDelete);
      return new ResponseCommon(200, true, 'EQUIPMENT_IS_DELETE');
    } else {
      return new ResponseCommon(404, false, 'NOT_FOUND_EQUIPMENT');
    }
  }

  //Delete list Equipment
  async deleteListEquipment(listId:ListId):Promise<IResponse> {
		console.log('listid')
    listId.id.map( item=>{
      this.deleteEquipment(item);
    })
    return new ResponseCommon(200, true, "EQUIPMENT_IS_DELETE")
  }

  //Restore list Equipment
  async restoreListEquipment(listId:ListId):Promise<IResponse> {
		
		listId.id.map( item=>{
			this.restoreEquipment(item);
		})
		return new ResponseCommon(200, true, "EQUIPMENT_IS_RESTORE")
  }	

    async getAllEquipment(propsGet: GetAllEquipmentDto): Promise<IResponse> {

        let queryBuilder = this.equipmentRepository
                .createQueryBuilder('equipment')
                .leftJoinAndSelect('equipment.category', 'category')
                .where('equipment.isDelete = false')
                .orderBy('equipment.updatedDate', 'DESC')

        if (!propsGet.isDropdown) {
        //bỏ qua bao nhiêu phần tử x = (pageNumber -1).pageSize
        if (propsGet.pageSize) {
            queryBuilder = queryBuilder.skip((propsGet.pageNumber - 1) * propsGet.pageSize)
            .take(propsGet.pageSize)
        }
        }

        // Search name
        if (propsGet.searchValue) {
            let nameValue = propsGet.searchValue;
            queryBuilder = queryBuilder.andWhere(new Brackets(qb => {
                qb.where('equipment.equipmentName ILIKE :nameValue', { nameValue: `%${nameValue}%` })
            }))
        }

        // Search description
        if (propsGet.searchText) {
            let desValue = propsGet.searchText;
            queryBuilder = queryBuilder.andWhere(new Brackets(qb => {
                qb.where('equipment.description ILIKE :desValue', { desValue: `%${desValue}%` })
            }))
        }

        // orderby
        if(propsGet.orderBy) {
            let type = propsGet.orderBy
            if(type==='ASC'){
                queryBuilder = queryBuilder.orderBy('equipment.updatedDate', 'ASC')
            }else{
                queryBuilder = queryBuilder.orderBy('equipment.updatedDate', 'DESC')
            }
        }
        
        if (propsGet.searchCategory) {
        let categoryId = propsGet.searchCategory;
            queryBuilder = queryBuilder.andWhere(new Brackets(qb => {
                qb.where('equipment.category = :categoryId', { categoryId: `${categoryId}` })
            }))
        }

        if (propsGet.searchEmployee) {
          let employeeId = propsGet.searchEmployee;
              queryBuilder = queryBuilder.andWhere(new Brackets(qb => {
                  qb.where('equipment.employee = :employeeId', { employeeId: `${employeeId}` })
              }))
          }

        const equipments = await queryBuilder.getManyAndCount();

        await Promise.all(equipments[0].map(async equip => {
            if(equip.avatar)
              equip.avatar = await this.converUrlImage(equip.avatar)
        }))

        const responseListEquipment = {data: equipments[0], total: equipments[1]}
    
        return new ResponseCommon(200, true, 'ALL_EQUIPMENT', responseListEquipment);
    }

    //Convert url image
    async converUrlImage(pathImage: string) {
        return `${hostUrlConfig.APP_URL}/${pathImage}`
    }

    // Update avatar
	async updateEquipmentIMG(equiId : string, file : any):Promise<IResponse> {
		const equi = await this.equipmentRepository.findOne({ where: { id: equiId } });
        if (!equi) {
            return new ResponseCommon(400, false, 'EQUIPMENT_NOT_EXIST', null);
        } else {
            let avatar = ""
            if (equi.avatar)
            {
              await unlinkAsync(equi.avatar)
            }
            if (file) {
                avatar = `${pathUrl.imageEquipment}/${file.filename}` 
            }
            else {
                avatar = ''
            }
            let dataUpdate = {avatar}
            await this.equipmentRepository.update(equiId, dataUpdate);
            
            return new ResponseCommon(200, true, 'UPDATE_IMG_EQUIPMENT_SUCCESS',null);
        }
    }

    
   
   

}