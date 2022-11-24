import { ApiProperty } from '@nestjs/swagger';

export class GetAllPaginationDTO {
    @ApiProperty()
    pageNumber?:number
    @ApiProperty()
    pageSize?: number
    @ApiProperty()
    //sap xep theo
    orderBy?: string
    @ApiProperty()
    isDropdown?: boolean
    @ApiProperty()
    //tim kiem chinh xac
    searchValue?: string
    @ApiProperty()
    //tim kiem tuong doi
    searchText?: string 
}