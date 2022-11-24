import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PaginationQuery {
    @ApiProperty({ default: 10 })
    @IsNotEmpty()
    limit: number;

    @ApiProperty({
        minimum: 0,
        maximum: 50,
        title: 'Page',
        exclusiveMaximum: true,
        exclusiveMinimum: true,
        format: 'int32',
        default: 1,
    })
    @IsNotEmpty()
    page: number;
}
