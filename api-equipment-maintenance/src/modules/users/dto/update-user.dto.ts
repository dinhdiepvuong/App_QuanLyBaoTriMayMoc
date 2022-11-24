import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto){

    updatedBy?:string

    otp?:number;

    timeOtp?:number;
}
