import { EquipmentStatus } from './../../../common/constants';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateEquipmentDto{

    @ApiProperty()
    equipmentName?: string;
    
    @ApiProperty()
    description?: string;

    @ApiProperty()
    color?: string;

    @ApiPropertyOptional({ type: 'string', format: 'binary' })
    @IsOptional()
    avatar: any;

    @ApiProperty()
    status?: EquipmentStatus;

    @ApiProperty()
    statusEquipment?: string;

    @ApiProperty()
    size?: string;

    @ApiProperty()
    wattage?: number;

    @ApiProperty()
    efficiency?: number;

    @ApiProperty()
    insurance?: Date;

    @ApiProperty()

    series?: string;

    qr?: string;

    @ApiProperty()
    longitude?: number;

    @ApiProperty()
    latitude?: number;

    @ApiProperty()
    weight?: number;

    @ApiProperty()
    electricity?: number;

    @ApiProperty()
    // @IsUUID()
    idEmployee?: string;

    @ApiProperty()
    // @IsUUID()
    idCategory?: string;
}
export class UpdateEquipmentDto{

    @ApiProperty()
    equipmentName?: string;
    
    @ApiProperty()
    description?: string;

    @ApiProperty()
    color?: string;

    @ApiProperty()
    status?: EquipmentStatus;

    @ApiProperty()
    statusEquipment?: string;

    @ApiProperty()
    size?: string;

    @ApiProperty()
    wattage?: number;

    @ApiProperty()
    efficiency?: number;

    @ApiProperty()
    insurance?: Date;

    @ApiProperty()
    series?: string;

    @ApiProperty()
    longitude?: number;

    @ApiProperty()
    latitude?: number;

    @ApiProperty()
    weight?: number;

    @ApiProperty()
    electricity?: number;

    // @ApiProperty()
    // idEmployee?: string;

    // @ApiProperty()
    // idCategory?: string;

}
export class UpdateAvatarDto{
    @ApiPropertyOptional({ type: 'string', format: 'binary' })
    @IsOptional()
    avatar: any;
}

export class CreateImageEquipmentDto{
    @ApiPropertyOptional({ type: 'string', format: 'binary' })
    @IsOptional()
    image: any;
}