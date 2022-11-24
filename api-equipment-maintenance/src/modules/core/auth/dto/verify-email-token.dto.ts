import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "class-validator"

export class VerifyEmailTokenDTO {
    @ApiProperty()
    @IsNotEmpty()
    inputToken: number

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    email: string
}