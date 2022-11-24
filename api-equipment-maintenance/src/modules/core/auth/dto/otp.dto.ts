import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class OTPDto{
    @ApiProperty()
    @IsNotEmpty()
    otp: string;
}