import { VerifyEmailOtpDTO } from './dto/verify-otp.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IResponse } from 'src/common/Interfaces/respone.interface';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { LoginUserDto } from './dto/in-login.dto';
import { RegisterDto } from './dto/register.dto';
import { OTPDto } from './dto/otp.dto'
import { TokenVerify } from './dto/token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { VerifyEmailTokenDTO } from './dto/verify-email-token.dto';
import { ChangePasswordOTPDto } from './dto/change-password-otp.dto';
import { VerifyEmailOTPDTO } from './dto/verity-otp.dto';


@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create account' })
    @Post('/register')
    public async register(@Body() registerDto: RegisterDto): Promise<IResponse> {
      return await this.authService.register(registerDto);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    public async login(@Body() loginUserDto: LoginUserDto): Promise<IResponse> {
        return await this.authService.login(loginUserDto);
    } 

    // xac thuc tai khoan
    @ApiOperation({ summary: 'update status' })
    @Get('/verifyRegister')
    public async verifyMail(@Query() token: TokenVerify) {
        return await this.authService.verify(token);
    }

    //gui mail quen pass OTP
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Find and sendmail forgot password' })
    @Post('/SendMailForgotOTP')
    public async confirmEmailOTP(@Body() confirmEmail: ConfirmEmailDto): Promise<IResponse> {
      return await this.authService.sendMailForgotOTP(confirmEmail.email,);
    }
    
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Check otp have true' })
    @Post('/verifyOTP')
    public async verifyOtp(@Body() verifyDto: VerifyEmailOtpDTO): Promise<IResponse> {
        return await this.authService.verifyOtp(verifyDto.otp, verifyDto.email)
    } 

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Change password by otp' })
    @Post('/changePasswordByOtp')
    public async changePasswordByOtp(@Body() changePasswordDto: ChangePasswordOTPDto): Promise<IResponse> {
        return await this.authService.changePasswordByOTP(changePasswordDto.email, changePasswordDto.newPass, changePasswordDto.reNewPass)
    }
}
