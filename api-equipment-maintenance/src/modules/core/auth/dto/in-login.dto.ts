import { IsNotEmpty, IsEmail, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @IsNotEmpty()
    @MaxLength(200)
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @MaxLength(128)
    @ApiProperty()
    password: string;
}