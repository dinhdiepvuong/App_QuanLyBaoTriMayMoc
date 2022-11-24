import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class UpdatePassWordByIdDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    confirmPassword: string;
}