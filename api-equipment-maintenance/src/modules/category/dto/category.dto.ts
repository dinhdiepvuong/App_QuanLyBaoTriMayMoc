import { ApiProperty} from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateCategoryDto {
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    category: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

}
export class UpdateCategoryDto {

    @ApiProperty()
    category: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    isDelete?: boolean

}