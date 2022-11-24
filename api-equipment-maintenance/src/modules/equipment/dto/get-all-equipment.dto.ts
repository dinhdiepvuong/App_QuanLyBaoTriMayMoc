import { ApiProperty, PartialType } from "@nestjs/swagger";
import { GetAllPaginationDTO } from "src/common/dto/get_all.dto";

export class GetAllEquipmentDto extends PartialType(GetAllPaginationDTO) {
    @ApiProperty()
    //tim kiemm theo category
    searchCategory:string

    @ApiProperty()
    //tim kiemm theo category
    searchEmployee:string
}