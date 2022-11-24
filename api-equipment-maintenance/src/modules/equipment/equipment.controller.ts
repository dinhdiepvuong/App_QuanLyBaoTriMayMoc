
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors, Request, Put, Delete, UploadedFiles } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/constants';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { IResponse } from 'src/common/Interfaces/respone.interface';
import { CreateEquipmentDto, CreateImageEquipmentDto, UpdateAvatarDto, UpdateEquipmentDto } from './dto/equipment.dto';
import { EquipmentService } from './equipment.service';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { GetAllEquipmentDto } from './dto/get-all-equipment.dto';
import { ListId } from 'src/common/dto/list-id.dto';

@ApiTags('equipment')
@UseGuards(AuthGuard(), RolesGuard)
@Controller('equipment')
export class EquipmentController {
    constructor(
        private readonly equipmentService:EquipmentService
    ){}

    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get detail equipment by id '  })
    @Get('/:equiId')
    async getDetailEquipment(@Param('equiId') equiId: string): Promise<IResponse> {
        return this.equipmentService.getEquipment(equiId);
    }

    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary:'Create Equipment' })
    @ApiConsumes('multipart/form-data')
    @Roles(UserRole.ADMIN)
    @Post('/create')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'avatar', maxCount: 1 }
      ]))
    async createEquipment( @UploadedFiles() files, @Body() equi: CreateEquipmentDto):Promise<IResponse> {
        return await this.equipmentService.createEquipment(equi, files);
    }

    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update information Equipment' })
    @Put('/:equiId')
    async updateEquipment(@Param('equiId') equiId: string, @Body() equi: UpdateEquipmentDto): Promise<IResponse> {
      return this.equipmentService.updateEquipment(equiId , equi);
    }

    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update avatar Equipment' })
    @ApiConsumes('multipart/form-data')
    @Put('/avatar/:equiId')
    @UseInterceptors(FileInterceptor('avatar'))
    async updateAvatar(@UploadedFile()file, @Param('equiId') equiId: string, @Body() data: UpdateAvatarDto): Promise<IResponse> {
        return this.equipmentService.updateEquipmentIMG(equiId , file);
    }
    
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all Equipment' })
    @Post('/allEquipment')
    async getAllEquipment(@Body() propsGet:GetAllEquipmentDto){
        return this.equipmentService.getAllEquipment(propsGet);
    }

    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'delete information Equipment' })
    @Roles(UserRole.ADMIN)
    @Delete('/:equiId')
    async deleteEquipment(@Param('equiId') equiId: string): Promise<IResponse> {
      return this.equipmentService.deleteEquipment(equiId);
    }



}



