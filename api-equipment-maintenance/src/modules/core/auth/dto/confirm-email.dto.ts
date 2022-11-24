import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ConfirmEmailDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email:string;
}