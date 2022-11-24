import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { GetAllPaginationDTO } from 'src/common/dto/get_all.dto';
import { ResponseCommon } from 'src/common/dto/respone.dto';
import { IResponse } from 'src/common/Interfaces/respone.interface';
import { Brackets, Like, Repository } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,
		// private readonly equipmentService: EquipmentService,
    ){}
	//Create category 
  	async createCategory(categoryDto: CreateCategoryDto): Promise<IResponse> {
    	const dataInsert = plainToClass(CategoryEntity, {
      		category : categoryDto.category,
            description : categoryDto.description,
    	});
    	const resultInDb = await this.categoryRepository.save(dataInsert);
    	if (resultInDb) {
      		return new ResponseCommon(201, true, 'CREATE_SUCCESS', resultInDb);
    	}
    	return new ResponseCommon(500, false, 'SERVER_ERROR', null);
  	}
	// Update 
  	async updateCategory(id:string ,updateE:UpdateCategoryDto) : Promise<IResponse> {
		const cate = await this.categoryRepository.findOne({where: {id, isDelete:false}})
		if(!cate){
			return new ResponseCommon(400,false,'CATEGORY_NOT_EXIST',null)
		}
		else{
			const cateNew = await this.categoryRepository.update(id,updateE)
			return new ResponseCommon(200, true,'UPDATE_CATEGORY_SUCCESS',cateNew)
		} 
  	}
	async getCategory(cateId: string): Promise<IResponse> {
	    const cates = await this.categoryRepository.findOne({ where: { id: cateId, isDelete:false } })
		.then(value => {
			return new ResponseCommon(200, true, 'GET_CATE_SUCCESS', value)
		})
		.catch(e => {
			return new ResponseCommon(400, false, 'CATEGORY_ERROR_GUID', null)
		});

		return cates
	}
	// get theo Id
	async getCategoryById(cateId: string): Promise<IResponse> {
	    const cates = await this.categoryRepository.findOne({ where: { id: cateId, isDelete:false } })
		if (!cates) {
		  return new ResponseCommon(404, false, 'CANNOT_FOUND_CATEGORY', null);
		}
		return new ResponseCommon(200, true, 'GET_ME_SUCCESS', cates);
	}
	// get all
	async getAllCategory(propsGet: GetAllPaginationDTO): Promise<IResponse> {

		let queryBuilder = this.categoryRepository
			.createQueryBuilder('category')
			.where('category.isDelete = false')
		
		if (!propsGet.isDropdown) {
			if (propsGet.pageSize) {
				queryBuilder = queryBuilder.skip((propsGet.pageNumber - 1) * propsGet.pageSize)
					.take(propsGet.pageSize)
			}
		}
		
		// Search name
		if (propsGet.searchValue) {
			let nameValue = propsGet.searchValue;
			queryBuilder = queryBuilder.andWhere(new Brackets(qb => {
				qb.where('category.category ILIKE :nameValue', { nameValue: `%${nameValue}%` })
			}))
		}

		// Search description
		if (propsGet.searchText) {
			let desValue = propsGet.searchText;
			queryBuilder = queryBuilder.andWhere(new Brackets(qb => {
				qb.where('category.description ILIKE :desValue', { desValue: `%${desValue}%` })
			}))
		}


		// orderby
		if(propsGet.orderBy) {
			let type = propsGet.orderBy
			if(type==='ASC'){
				queryBuilder = queryBuilder.orderBy('category.updatedDate', 'ASC')
			}else{
				queryBuilder = queryBuilder.orderBy('category.updatedDate', 'DESC')
			}
		}

		const categories = await queryBuilder.getManyAndCount();
		const responseListCate = {data: categories[0], total: categories[1]}

		return new ResponseCommon(200, true, 'All_CATEGORY', responseListCate);
	}

	//Update column IsDelete thành true
	async deleteCategory(cateId:string):Promise<IResponse> {
		const cateDelete = await this.categoryRepository.findOne({where:{id:cateId, isDelete:false}})
		if(cateDelete){
			cateDelete.isDelete = true
			await this.categoryRepository.update(cateId,cateDelete)
			return new ResponseCommon(200,true,"CATEGORY_IS_DELETE")
		}else{
			return new ResponseCommon(404,false,"NOT_FOUND_CATEGORY")
		}
	}
}