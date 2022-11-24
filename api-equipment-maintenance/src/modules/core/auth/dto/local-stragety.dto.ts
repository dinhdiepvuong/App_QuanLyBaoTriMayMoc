import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { UserRole } from 'src/common/constants';

export class LocalStragetyDto {
    @ApiProperty()
    sub: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty({ type: UserRole })
    role: UserRole;
}