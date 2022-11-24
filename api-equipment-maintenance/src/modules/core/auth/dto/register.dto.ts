import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsBoolean, IsString, IsEmpty } from 'class-validator';
export class RegisterDto {

    id?: string

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    confirmPassword: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty()
    isEmployee:string;

    createdBy?: string;

    @IsEmpty()
    updateddBy?: string;

    createdDate?: string;

    @IsEmpty()
    updatedDate?: string;

}