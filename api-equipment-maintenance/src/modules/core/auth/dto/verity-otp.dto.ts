import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "class-validator"

export class VerifyEmailOTPDTO {
    @ApiProperty()
    @IsNotEmpty()
    otp: number

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    email: string
}