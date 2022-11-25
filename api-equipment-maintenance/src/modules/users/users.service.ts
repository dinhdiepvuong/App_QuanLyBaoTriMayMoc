import { Injectable, Response } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IResponse } from 'src/common/Interfaces/respone.interface';
import { plainToClass } from 'class-transformer';
import {  UserRole, UserStatus } from 'src/common/constants';
import { ResponseCommon } from 'src/common/dto/respone.dto';
import { LoginUserDto } from '../core/auth/dto/in-login.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../core/auth/interfaces/payload.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePassWordUserDto } from './dto/update-password-user.dto';
import { UpdatePassWordByIdDto } from './dto/password-admin.dto';
import { GetAllPaginationDTO } from 'src/common/dto/get_all.dto';
import { RegisterDto } from '../core/auth/dto/register.dto';
import { EmployeeService } from '../employee/employee.service';
import { UpdateUserProfileDto } from './dto/update-profile.dto';
import { UpdateEmployeeDTO } from '../employee/dto/employee.dto';
import { ListId } from 'src/common/dto/list-id.dto';
import { hostUrlConfig, pathUrl } from 'src/common/configs';
@Injectable()
export class UsersService {
  	constructor(
    	@InjectRepository(UserEntity)
    	private readonly userRepository: Repository<UserEntity>,
    	private readonly employeeService:EmployeeService,
  	) {}
	
	//create user 
  	async create(registerDto: RegisterDto): Promise<IResponse> {
    	const userInDb = await this.userRepository.findOne({
      		where: { email: registerDto.email },
    	});

    	if (!userInDb) {
				const userDto: CreateUserDto = {
					email: registerDto.email,
					password: registerDto.password,
					status: UserStatus.NEW,
					role: UserRole.EMPLOYEE,
					createdBy: registerDto.firstName + ' ' + registerDto.lastName,
				};
				const resultInDb = await this.userRepository.create(userDto);
				await this.userRepository.save(resultInDb);
	
				if (resultInDb) {
					return new ResponseCommon(201, true, 'CREATE_SUCCESS', resultInDb);
				}
				return new ResponseCommon(500, false, 'SERVER_ERROR', null);

    	}
    	return new ResponseCommon(400, false, 'EMAIL_ALREADY_EXIST', null);
  	}
	//Kiem Tra Login
  	async FindByLogin({ email, password }: LoginUserDto): Promise<IResponse> {
    	const userInDb = await this.userRepository.findOne({
      		where: { email: email, isDelete:false },
    	});
    	if (!userInDb) {
      		return new ResponseCommon(404, false, 'CANNOT_FOUND_USER', null);
    	}
		// kiem tra mat khau
    	const comparePassword = await bcrypt.compare(password, userInDb.password);
    	if (!comparePassword) {
      		return new ResponseCommon(400, false, 'PASSWORD_INCORECT', null);
    	}

    	return new ResponseCommon(200, true, 'SUCCESS', userInDb);
  	}

	// Kiem Tra co thuoc he thong
  	async findByPayload(email: string) {
    	return await this.userRepository.findOne({
      		where: { email , isDelete:false },
    	});
  	}

  	async validateUser(payload: JwtPayload): Promise<UserEntity> {
    	const user = await this.findByPayload(payload.email);
    	if (!user) {
      		return;
    	}
    	return user;
  	}

	  
  	async getUserProfile(userId: string): Promise<IResponse> {
		let queryBuilder = await this.userRepository.createQueryBuilder('user')
									.leftJoinAndSelect("user.employee", "employee")
									.where("user.id = :userId", { userId })
									.getOne(); 
		if (!queryBuilder) {
      		return new ResponseCommon(404, false, 'CANNOT_FOUND_USER');
    	}
		switch (queryBuilder.role) {
			case "EMPLOYEE":
				if(queryBuilder.employee.avatar)
				queryBuilder.employee.avatar = await this.converUrlImage(queryBuilder.employee.avatar)
				break;
			default:
				break;
		}
    	return new ResponseCommon(200, true, 'GET_PROFILE_SUCCESS', queryBuilder);
  	}

  	async updateUser(id: string, post: UpdateUserDto): Promise<IResponse> {
    	const usercheck = await this.userRepository.findOne({ where: { id, isDelete:false } });
    	if (!usercheck) {
      		return new ResponseCommon(400, false, 'CANNOT_FOUND_USER', null);
    	}
		await this.userRepository.update(id, post);
		const updateUser = await this.userRepository.findOne({ where: { id, isDelete:false } });
    	return new ResponseCommon(200, true, 'UPDATE_SUCCESS', updateUser);
  	}

  	async updateUserProfile(id: string, post: UpdateUserProfileDto, file : any): Promise<IResponse> {
		const user = await this.userRepository.findOne({ where: { id, isDelete:false } });
		if (!user){
			return new ResponseCommon(400, false, 'CANNOT_FOUND_USER', null);
		}
		const userU : UpdateUserDto = {
			email:post.email,
			otp:23
		}
		let avatarNew = "";
		if (file) {
			avatarNew = `${pathUrl.imageUser}/${file.filename}` 
		}
		else {
			avatarNew = ''
		}
		switch(user.role){
			case "EMPLOYEE":
				const empU : UpdateEmployeeDTO = {
					firstName: post.firstName,
		
					lastName: post.lastName,
				
					phone: post.phone,

					avatar: avatarNew,
				}
				await this.employeeService.updateProfile(id,empU)
				break
			default:
		}
    	await this.userRepository.update(id, userU);
		
		setTimeout(async () => {
			userU.otp = null;
			await this.updateUser(id,userU)
		},10);
    	const updateUser = await this.getUserProfile(id)
    	return new ResponseCommon(200, true, 'UPDATE_SUCCESS', updateUser.data);
  	}

  	async updateUserPassword(id: string,user: UpdatePassWordUserDto): Promise<IResponse> {
    	if(user.password != user.confirmPassword)
			return new ResponseCommon(400, false, 'NOT_CONFIRM_PASSWORD_DUPLICATE', null);
		let userEntity = await this.userRepository.findOne({ where: { id } });

    	const comparePassword = await bcrypt.compare(
      		user.passwordOld,
      		userEntity.password,
    	);

    	if (!comparePassword) {
      		return new ResponseCommon(400, false, 'NOT_PASSWORD_MATCH', null);
    	} else {
      		const salt = await bcrypt.genSalt(10);
      		const hashed = await bcrypt.hash(user.password, salt);
      		await this.userRepository.update(id, { password: hashed });
      		await this.userRepository.findOne({ where: { id } });
      		return new ResponseCommon(200, true, 'UPDATE_PASSWORD_SUCCESS');
    	}
  	}
	async updatePasswordById(id: string,user: UpdatePassWordByIdDto): Promise<IResponse> {
    	if(user.password != user.confirmPassword)
			return new ResponseCommon(400, false, 'NOT_CONFIRM_PASSWORD_DUPLICATE', null);
		let userEntity = await this.userRepository.findOne({ where: { id } });

    	if (!userEntity) {
      		return new ResponseCommon(400, false, 'NOT_USER', null);
    	} else {
      		const salt = await bcrypt.genSalt(10);
      		const hashed = await bcrypt.hash(user.password, salt);
      		await this.userRepository.update(id, { password: hashed });
      		await this.userRepository.findOne({ where: { id } });
      		return new ResponseCommon(200, true, 'UPDATE_PASSWORD_SUCCESS');
    	}
  	}

  	async getAllUser(propsGet: GetAllPaginationDTO): Promise<IResponse> {

		let queryBuilder = this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndSelect("user.employee", "employee")
			.where('user.is_delete = false')

		if (!propsGet.isDropdown) {
			if (propsGet.pageSize) {
				queryBuilder = queryBuilder.skip((propsGet.pageNumber - 1) * propsGet.pageSize)
					.take(propsGet.pageSize)
			}
		}			
		// Search email
		if (propsGet.searchValue) {
			let NameValue = propsGet.searchValue;
			queryBuilder = queryBuilder.andWhere(new Brackets((qb => {
				qb.where('user.email ILIKE :emailValue', { emailValue: `%${NameValue}%` })		
			})))
		}
		// orderby
		if(propsGet.orderBy) {
			let type = propsGet.orderBy
			if(type==='ASC'){
				queryBuilder = queryBuilder.orderBy('user.updatedDate', 'ASC')
			}else{
				queryBuilder = queryBuilder.orderBy('user.updatedDate', 'DESC')
			}
		}	

		const users = await queryBuilder.getManyAndCount();
		const responseListEmp = {data : users[0],total: users[1]}
    
    	return new ResponseCommon(200, true, 'All_USER', responseListEmp);
  	}
  	async checkEmail(email: string): Promise<IResponse> {
    	let userInDb = await this.userRepository.findOne({
      		where: { email: email, isDelete: false  },
    	});
    	if (!userInDb) {
      		return new ResponseCommon(404, false, 'CANNOT_FOUND_USER', null);
    	}
    	return new ResponseCommon(200, true, 'SUCCESS', userInDb);
  	}

  	async lockUser(userId:string):Promise<IResponse> {
   		const userLock = await this.userRepository.findOne({where: {id:userId, isDelete: false } })
		if(userLock){
    		if(userLock.status!=UserStatus.LOCK){
      			userLock.status = UserStatus.LOCK
      			await this.userRepository.update(userLock.id,userLock)
      			return new ResponseCommon(200, true, "USER_IS_LOCK")
    		}else{
				userLock.status = UserStatus.ACTIVE
				await this.userRepository.update(userLock.id,userLock)
				return new ResponseCommon(200, true, "USER_IS_ACTIVE")
			}
		}
      	return new ResponseCommon(404, false, "NOT_FOUND_USER")
  	}

	//Update IsDelete
  	async deleteUser(userId:string):Promise<IResponse> {
		const userDelete = await this.userRepository.findOne({ where: { id:userId } })
		if(userDelete){
			userDelete.isDelete = true
			await this.userRepository.update(userDelete.id, userDelete)
			switch (userDelete.role) {
				case "EMPLOYEE":
					await this.employeeService.deleteEmployee(userId)
					break;
				default:
					break;
			}
			return new ResponseCommon(200, true, "USER_IS_DELETE")
		}else{
			return new ResponseCommon(404, false, "NOT_FOUND_USER")
		}
	}


	//Update IsDelete
  	async RestoreUser(userId:string):Promise<IResponse> {
		const userDelete = await this.userRepository.findOne({ where: { id:userId } })
		if(userDelete){
			userDelete.isDelete = false
			await this.userRepository.update(userDelete.id, userDelete)
			switch (userDelete.role) {
				case "EMPLOYEE":
					await this.employeeService.restoreEmployee(userId)
					break;
				default:
					break;
			}
			return new ResponseCommon(200, true, "USER_IS_RESTORE")
		}else{
			return new ResponseCommon(404, false, "NOT_FOUND_USER")
		}
	}

	async deleteListUser(listId:ListId):Promise<IResponse> {
		
			listId.id.map( item=>{
				this.deleteUser(item);
			})
			return new ResponseCommon(200, true, "USER_IS_DELETE")
	}
	async RestoreListUser(listId:ListId):Promise<IResponse> {
		
		listId.id.map( item=>{
			this.RestoreUser(item);
		})
		return new ResponseCommon(200, true, "USER_IS_RESTORE")
    }	

	//Convert url image
	async converUrlImage(pathImage: string) {
        return `${hostUrlConfig.APP_URL}/${pathImage}`
    }
}
