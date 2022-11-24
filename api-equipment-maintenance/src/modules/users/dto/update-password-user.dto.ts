import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class UpdatePassWordUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    passwordOld: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    confirmPassword: string;
}