import { IsNotEmpty, IsEmail, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDTO {
    @IsNotEmpty()
    @MaxLength(200)
    @IsEmail()
    @ApiProperty()
    email: string;
}