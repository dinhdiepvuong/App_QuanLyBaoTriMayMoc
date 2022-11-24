import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserProfileDto {

    @ApiProperty()
    email?: string;
    
    @ApiProperty()
    @IsString()
    firstName?: string;

    @ApiProperty()
    @IsString()
    lastName?: string;

    @ApiProperty()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ type: 'string', format: 'binary' })
    @IsOptional()
    avatar?: any;
}
