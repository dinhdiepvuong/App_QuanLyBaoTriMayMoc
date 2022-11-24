import { ApiProperty } from "@nestjs/swagger";

export class OutQueryListDto {
    @ApiProperty({ type: Object, isArray: true })
    items: any[];

    @ApiProperty({ default: 0 })
    total: number;
}