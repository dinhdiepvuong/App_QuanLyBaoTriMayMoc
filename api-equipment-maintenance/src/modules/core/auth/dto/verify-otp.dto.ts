import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "class-validator"

export class VerifyEmailOtpDTO {
    @ApiProperty()
    @IsNotEmpty()
    otp: number

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    email: string
}