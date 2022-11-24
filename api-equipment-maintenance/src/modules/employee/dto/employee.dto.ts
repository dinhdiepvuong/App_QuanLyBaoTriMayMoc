import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserEntity } from 'src/modules/users/entities/user.entity';
export class CreateEmployeeDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id?: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty()
    @IsString()
    department: string;

    @ApiProperty()
    user: UserEntity;




}
export class UpdateEmployeeDTO{

    @ApiProperty()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    @IsNotEmpty()
    phone: string;

    
    @ApiProperty()
    avatar?: any;

    @ApiProperty()
    @IsNotEmpty()
    department?: string;

    updateBy?:string

}
