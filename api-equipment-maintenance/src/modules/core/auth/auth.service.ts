import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { jwtConfigs, timeConfig  } from 'src/common/configs';
import {  UserStatus } from 'src/common/constants';
import { ResponseCommon } from 'src/common/dto/respone.dto';
import { IResponse } from 'src/common/Interfaces/respone.interface';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import { LoginUserDto } from './dto/in-login.dto';
import * as bcrypt from 'bcrypt'
import { JwtPayload } from './interfaces/payload.interface';
import  jwt_decode from "jwt-decode";
import { GenerateTokenDto } from './dto/generate-token.dto';
import { EmployeeService } from 'src/modules/employee/employee.service';
import { RegisterDto } from './dto/register.dto';
import { CreateEmployeeDto } from 'src/modules/employee/dto/employee.dto';
import { TokenVerify } from './dto/token.dto';
import { UpdateUserDto } from 'src/modules/users/dto/update-user.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SendMailDto } from './dto/send-mail.dto';
import { codeMail } from 'src/common/configs';
import * as otpGenerator from 'otp-generator'

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		private readonly jwtService: JwtService,
		private readonly employeeSevice : EmployeeService,
		@InjectQueue('email-queue')
		private readonly queueService: Queue,
	) { }

	async register(registerDto: RegisterDto) : Promise<IResponse> {
		try {
			if (registerDto.password == registerDto.confirmPassword) {
			const user = await this.userService.findByPayload(registerDto.email)
			if (!user) {
				const createUser = await this.userService.create(registerDto);
				createUser.data.password = undefined

				let employeeDto = new CreateEmployeeDto;
				employeeDto.firstName = registerDto.firstName;
				employeeDto.lastName = registerDto.lastName;
				employeeDto.phone = registerDto.phoneNumber;
				employeeDto.user = createUser.data;
				await this.employeeSevice.createEmployee(employeeDto)

				// create token
				const dataToken = {
					email:createUser.data.email,
					role:createUser.data.role
				}

				const tokenRegister = await this.generateToken(dataToken, jwtConfigs.accessTokenExpiresInRegister)

				const linkApi:string = tokenRegister.accessToken
				const mailDto: SendMailDto = {
					linkApi: linkApi,
					email: createUser.data.email,
					createdBy: createUser.data.createdBy,
					number: parseInt(<string>codeMail.REGISTER_CODE),
				}
			console.log("sendmail truoc queue");
			await this.sendMailRegister(mailDto)

			return new ResponseCommon(201, true, 'REGISTER_SUCCESS')
			}
				return new ResponseCommon(400,false,"EMAIL_IS_EXIST")
			}
			return new ResponseCommon(400, false, "PASSWORD_CONFIRM_INCORRECT", null);
		} catch (error) {
			return new ResponseCommon(400, false, 'BAD_REQUEST', error)
		}
  	}
	async sendMailRegister(sendMail: SendMailDto){
	
		
		try {
		 new Promise(res => this.queueService.add('send-mail-register',sendMail,{delay:2000},).then(job=>job.finished().then(result=>{        
		   job.remove()
		  })))
		} catch (error) {
		 console.log(error);
		}
	}
	async sendMailForgotPassword(sendMail: SendMailDto){
	 
		try {
		   new Promise(res=>this.queueService.add('send-mail-forgot-password',sendMail,{delay:2000}).then(job=>job.finished().then(result=>{
		   job.remove()
		 })))
		} catch (error) {
		 console.log(error);
		 
		}
	}
	async sendMailForgotPasswordOTP(sendMail: SendMailDto){
	 
		try {
		   new Promise(res=>this.queueService.add('send-mail-forgot-password-otp',sendMail,{delay:2000}).then(job=>job.finished().then(result=>{
		   job.remove()
		 })))
		} catch (error) {
		 console.log(error);
		 
		}
	}

	// Update trang thai ACTIVE
	public async verify (token:TokenVerify):Promise<IResponse>{
  		let accessToken  = token.token
  		let userDecoded:GenerateTokenDto = jwt_decode(accessToken)

  		const userCheck = await this.userService.findByPayload(userDecoded.email)
  		if(userCheck){
			const userUpdate:UpdateUserDto = {
	  		status:UserStatus.ACTIVE
		}
		await this.userService.updateUser(userCheck.id,userUpdate)
  		}
  		return new ResponseCommon(200,true,'SUCCESS_VERIFY')
  	}

  	async login(loginUserDto: LoginUserDto): Promise<IResponse> {
		const resultUser = await this.userService.FindByLogin(loginUserDto);

		if (!resultUser.success) {
	  		return resultUser;
		}
		var dataInDb = plainToClass(UserEntity, resultUser.data);

		if (dataInDb.status != UserStatus.ACTIVE) {
	  		return new ResponseCommon(400, false, "USER_IS_NOT_ACTIVE", null);
		}

		const token = await this.generateToken(dataInDb, jwtConfigs.accessTokenExpiresIn)

		const data = {
			email:dataInDb.email,
			token:token.accessToken,
			expressIn:token.expiresIn,
	  	}
	  	return new ResponseCommon(200, true, "LOGIN_SUCCESS", data);
  	}

	//Tao Token
  	async generateToken(dataDto: GenerateTokenDto, expiresIn: string) {
		const { email, role } = dataDto
		const userJwt: JwtPayload = { email, role };
		const accessToken = await this.jwtService.sign(userJwt);
		return {
	 		accessToken: accessToken,
	  		expiresIn: expiresIn,
		}
  	}	
  	// Quên mật khẩu
  	async sendMailForgot(email: string): Promise<IResponse> {
		const user = await this.userService.findByPayload(email)
		if (user) {
		const employee = await this.employeeSevice.getEmployeeProfile(user.id)
	  	const dataToken = {
		email:user.email,
		role:user.role
	  	}
	  	const tokenForgotPassword = await this.generateToken(dataToken, jwtConfigs.accessTokenExpiresInRegister)
	  	const linkApi:string = tokenForgotPassword.accessToken
      	const mailDto: SendMailDto = {
        	linkApi: linkApi,
        	email: user.email,
        	createdBy: employee.data.firstName + ' ' + employee.data.lastName,
        	number: parseInt(<string>codeMail.RESET_PASSWORD),
      	}
	  	await this.sendMailForgotPassword(mailDto)
	  	return new ResponseCommon(200, true, 'SUCCESS')
		}
		return new ResponseCommon(404, false, 'EMAIL_NOT_FOUND')
  	}	
	async sendMailForgotOTP(email: string): Promise<IResponse> {
		const user = await this.userService.findByPayload(email)
		
		if (user) {
		const employee = await this.employeeSevice.getEmployeeProfile(user.id)
      	const mailDto: SendMailDto = {
			id: user.id,
        	email: user.email,
        	createdBy: employee.data.firstName + ' ' + employee.data.lastName,
        	number: parseInt(<string>codeMail.RESET_PASSWORD_OTP),
      	}
	  	const otp = await this.generateOTP()
		  	mailDto.otp = otp
            const res = await this.sendMailForgotPasswordOTP(mailDto)
            user.otp = otp
            await this.userService.updateUser(user.id, user)
			setTimeout(async () => {
				user.otp = null;
				await this.userService.updateUser(user.id,user)
		    },parseInt(<string> timeConfig.EXPIRESIN_OTP_TIME));

	  	return new ResponseCommon(200, true, 'SUCCESS')
		}
		return new ResponseCommon(404, false, 'EMAIL_NOT_FOUND')
  	}	
	// kiem tra token quen mat khau
  	async checkTokenForgot(token:TokenVerify):Promise<IResponse>{
		let accessToken  = token.token
		let userDecoded:GenerateTokenDto = jwt_decode(accessToken)

		const userCheck = await this.userService.findByPayload(userDecoded.email)
		if(userCheck){
	  		return new ResponseCommon(200,true,"EMAIL_IS_EXIST")
		}
		return new ResponseCommon(404,false,"EMAIL_NOT_FOUND")

  	}

	//Reset password
  	async changePassword(token: string, newPassword: string, reNewPassword): Promise<IResponse> {
		if (newPassword === reNewPassword) {
	 		let userDecoded:GenerateTokenDto = jwt_decode(token)
	  		const user = await this.userService.findByPayload(userDecoded.email)
	  		const hashPassword = await bcrypt.hash(newPassword, 10)

	  		const updatedUser = {
			...user,
			password: hashPassword
	  	}
	  	await this.userService.updateUser(user.id, updatedUser)
	  	updatedUser.password = undefined
	  	return new ResponseCommon(200, true, 'CHANGE_PASSWORD_SUCCESS', updatedUser)
		}
	}

    async verifyOtp(otp: number, email: string): Promise<IResponse> {
        const user = await this.userService.findByPayload(email)
		if (user.otp == null){
			return new ResponseCommon(401, false, 'OVER_TIME_OTP')
		}
        if (user.otp == otp) {
            return new ResponseCommon(200, true, 'SUCCESS')
        }

        return new ResponseCommon(401, false, 'OVER_NOT_CORRECT')
    }

    async changePasswordByOTP(email: string, newPassword: string, reNewPassword): Promise<IResponse> {
        if (newPassword === reNewPassword) {
            const user = await this.userService.findByPayload(email)
            const hashPassword = await bcrypt.hash(newPassword, 10)

            const updatedUser = {
                ...user,
                password: hashPassword
            }
            await this.userService.updateUser(user.id, updatedUser)
            updatedUser.password = undefined
            return new ResponseCommon(200, true, 'CHANGE_PASSWORD_SUCCESS', updatedUser)
        }
	}
	// gen otp
    async generateOTP() {
        return otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    }

}

