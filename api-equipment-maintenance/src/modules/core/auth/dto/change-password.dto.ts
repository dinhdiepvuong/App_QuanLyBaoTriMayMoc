import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "class-validator"

export class ChangePasswordDto {
    @ApiProperty()
    @IsString()
    token?: string

    @ApiProperty()
    @IsString()
    email?: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    newPass: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    reNewPass: string
}