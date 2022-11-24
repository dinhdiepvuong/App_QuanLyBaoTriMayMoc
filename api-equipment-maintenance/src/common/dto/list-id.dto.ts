import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class ListId{
    
    @ApiPropertyOptional({
        type: 'array',
    
        items: {
            type: 'string',
        },
      })
    @IsOptional()
    id: any;
}