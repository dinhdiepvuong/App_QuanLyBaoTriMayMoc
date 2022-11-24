import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "class-validator"
export class ChangePasswordOTPDto {




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