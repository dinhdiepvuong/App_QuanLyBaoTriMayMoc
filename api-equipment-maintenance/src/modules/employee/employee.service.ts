import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseCommon } from 'src/common/dto/respone.dto';
import { IResponse } from 'src/common/Interfaces/respone.interface';
import { Brackets, Like, Repository } from 'typeorm';
import { CreateEmployeeDto, UpdateEmployeeDTO } from './dto/employee.dto';
import { EmployeeEntity } from './entities/employee.entity';
import { plainToClass } from 'class-transformer';
import { GetAllPaginationDTO } from 'src/common/dto/get_all.dto';
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(EmployeeEntity)
        private readonly employeeRepository: Repository<EmployeeEntity>,
		// private readonly userService:UsersService,
    ){}
	// Tao moi employee
  	async createEmployee(employeeDto: CreateEmployeeDto): Promise<IResponse> {
    	const dataInsert = plainToClass(EmployeeEntity, {
      		firstName: employeeDto.firstName,
      		lastName: employeeDto.lastName,
      		phone: employeeDto.phone,
      		department: employeeDto.department,
			user:employeeDto.user,
    	});
    	const resultInDb = await this.employeeRepository.save(dataInsert);
    	if (resultInDb) {
      		return new ResponseCommon(201, true, 'CREATE_SUCCESS', resultInDb);
    	}
    	return new ResponseCommon(500, false, 'SERVER_ERROR', null);
  	}
	

  	async updateEmloyee(id:string ,updateE:UpdateEmployeeDTO) : Promise<IResponse> {
		const emp = await this.employeeRepository.findOne({where: { id ,isDelete:false}})
		if(!emp){
			return new ResponseCommon(400,false,'EMPLOYEE_NOT_EXIST',null)
		}
		else{
			await this.employeeRepository.update(id,updateE)
			const empNew = await this.employeeRepository.findOne({ where: { id } })
			return new ResponseCommon(200, true,'UPDATE_EMPLOYYE_SUCCESS',empNew)
		} 
  	}

	async updateProfile(userId:string ,updateE:UpdateEmployeeDTO) : Promise<IResponse> {
		const empUpdate = await this.employeeRepository.createQueryBuilder('employee')
        							.leftJoinAndSelect("employee.user", "user")
        							.where("employee.user = :userId", { userId })
        							.getOne(); 
		if(!empUpdate){
			return new ResponseCommon(400,false,'EMPLOYEE_NOT_EXIST',null)
		}
		else{

			if (updateE.avatar && empUpdate.avatar)
              	await unlinkAsync(empUpdate.avatar)

			await this.employeeRepository.update(empUpdate.id, updateE)
			const empNew = await this.employeeRepository.findOne({ where: { id: empUpdate.id } })
			return new ResponseCommon(200, true, 'UPDATE_EMPLOYYE_SUCCESS', empNew)
		} 
  	}

	async getEmployeeProfile(userId: string): Promise<IResponse> {
		const emp = await this.employeeRepository.createQueryBuilder('employee')
        						.leftJoinAndSelect("employee.user", "user")
        						.where("employee.user = :userId", { userId })
        						.getOne(); 
		return new ResponseCommon(200, true, 'GET_ME_SUCCESS', emp);
	}
	async getEmployeeById(empId: string): Promise<IResponse> {
		const emp = await this.employeeRepository.createQueryBuilder('employee')
        						.leftJoinAndSelect("employee.user", "user")
        						.where("employee.id = :empId", { empId })
        						.getOne(); 
		return new ResponseCommon(200, true, 'GET_ME_SUCCESS', emp);
	}
	//getall
	async getAllEmployee(propsGet: GetAllPaginationDTO): Promise<IResponse> {
		
		let queryBuilder = this.employeeRepository
			.createQueryBuilder('employee')
			.where('employee.isDelete = false')
		
		if (!propsGet.isDropdown) {
			if (propsGet.pageSize) {
				queryBuilder = queryBuilder.skip((propsGet.pageNumber - 1) * propsGet.pageSize)
					.take(propsGet.pageSize)
			}
		}	

		// Search firstName or lastName
		if (propsGet.searchValue) {
			let NameValue = propsGet.searchValue;
			queryBuilder = queryBuilder.andWhere(new Brackets((qb => {
				qb.orWhere('employee.firstName ILIKE :firstNameValue', { firstNameValue: `%${NameValue}%` })
				.orWhere('employee.lastName ILIKE :lastNameValue', { lastNameValue: `%${NameValue}%` })
				.orWhere('employee.phone ILIKE :phoneValue', { phoneValue: `%${NameValue}%` })			
			})))
		}

		// orderby
		if(propsGet.orderBy) {
			let type = propsGet.orderBy
			if(type==='ASC'){
				queryBuilder = queryBuilder.orderBy('employee.updatedDate', 'ASC')
			}else{
				queryBuilder = queryBuilder.orderBy('employee.updatedDate', 'DESC')
			}
		}		

		const employees = await queryBuilder.getManyAndCount();
		const responseListEmp = {data : employees[0],total: employees[1]}

		return new ResponseCommon(200, true, 'All_EMPLOYEE', responseListEmp);
	    }

	async deleteEmployee(userId:string):Promise<IResponse> {
		
		const empDelete = await this.employeeRepository.createQueryBuilder('employee')
        								.leftJoinAndSelect("employee.user", "user")
        								.where("employee.user = :userId", { userId })
        								.getOne(); 
		if(empDelete){
			empDelete.isDelete = true
			await this.employeeRepository.update(empDelete.id,empDelete)
			return new ResponseCommon(200,true,"EMPLOYEE_IS_DELETE")
		}else{
			return new ResponseCommon(404,false,"NOT_FOUND_USER")
		}
	}

	async getEquipmentByUser(userId: string): Promise<IResponse> {
		const emp = await this.employeeRepository.createQueryBuilder('employee')
        						.leftJoin("employee.user", "user")
								.leftJoinAndSelect("employee.equipments","equipment")
        						.where("employee.user = :userId", { userId })
								.andWhere("employee.id = equipment.employeeId")
								.getOne(); 
		if (!emp) {
		  return new ResponseCommon(404, false, 'CANNOT_FOUND_EQUIPMENT', null);
		}
		let equipmentNumber = emp.equipments.length;
		return new ResponseCommon(200, true, 'GET_ME_SUCCESS', {emp, equipmentNumber});
	}
	async getEquipmentByEmployee(empId: string): Promise<IResponse> {
		const emp = await this.employeeRepository.createQueryBuilder('employee')
								.leftJoinAndSelect("employee.equipments","equipment","employee.id = equipment.employeeId")
        						.where("employee.id = :empId", { empId })
								.andWhere("employee.isDelete = false")
								.getOne(); 
		if (!emp) {
		  return new ResponseCommon(404, false, 'CANNOT_FOUND_EMPLOYEE', null);
		}
		return new ResponseCommon(200, true, 'GET_ME_SUCCESS', emp);
	}

	async getEmployee(empId: string): Promise<IResponse> {
		const emp = await this.employeeRepository.findOne({ where: { id: empId, isDelete:false } })
		.then(value => {
			return new ResponseCommon(200, true, 'GET_EMPLOYEE_SUCCESS', value);
		})
		.catch(e => {
			return new ResponseCommon(400, false, 'EMPLOYEE_ERROR_GUID', null);
		});

		return emp
	}
	async restoreEmployee(userId:string):Promise<IResponse> {
		
		const empDelete = await this.employeeRepository.createQueryBuilder('employee')
        								.leftJoinAndSelect("employee.user", "user")
        								.where("employee.user = :userId", { userId })
        								.getOne(); 
		if(empDelete){
			empDelete.isDelete = false
			await this.employeeRepository.update(empDelete.id,empDelete)
			return new ResponseCommon(200,true,"EMPLOYEE_IS_RESTORE")
		}else{
			return new ResponseCommon(404,false,"NOT_FOUND_USER")
		}
	}
}
