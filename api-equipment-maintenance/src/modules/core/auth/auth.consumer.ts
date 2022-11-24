import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { hostUrlConfig} from "src/common/configs";
import { NumberHelper } from "src/common/function/NumberHelper";
import Mail from "src/common/function/SendMail";
import { TimeHelper } from "src/common/function/TimeHelper";
import { UsersService } from "src/modules/users/users.service";
import { SendMailDto } from "./dto/send-mail.dto";


@Processor({name: 'email-queue'})
export class AuthConsumer {
    constructor(
        private readonly mail: Mail,
        private readonly usersService:UsersService,
        private readonly numberHelper: NumberHelper,
		private readonly timeHelper :TimeHelper,
    ){}
    //Gui Mail sau khi qua queue register
    @Process('send-mail-register')
    async sendToRegister(job: Job<SendMailDto>){
        console.log("note 1sssssssssssssssssssssssssssssss");
        await this.mail.sendTo(`${hostUrlConfig.APP_URL}/auth/verifyRegister?token=${job.data.linkApi}&email=${job.data.email}`,job.data.email,job.data.createdBy,job.data.number)
    }
    //Gui Mail sau khi qua queue forgot password verify
    @Process('send-mail-forgot-password')
    async sendToForgotPassword(job: Job<SendMailDto>){
        await this.mail.sendTo(`${hostUrlConfig.APP_URL}/auth/verifyPassword?token=${job.data.linkApi}&email=${job.data.email}`,job.data.email,job.data.createdBy,job.data.number)

    }
    //Gui Mail sau khi qua queue forgot password OTP
    @Process('send-mail-forgot-password-otp')
    async sendToForgotPasswordOTP(job: Job<SendMailDto>){
        await this.mail.sendTo(null,job.data.email,job.data.createdBy,job.data.number,job.data.otp)
    }

}