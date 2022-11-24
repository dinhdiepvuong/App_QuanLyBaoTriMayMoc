import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsBoolean, IsString } from 'class-validator';
import { UserRole, UserStatus } from 'src/common/constants';
export class CreateUserDto {

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    confirmPassword?: string;


    createdBy?: string;

    status?: UserStatus

    role?: UserRole
}
