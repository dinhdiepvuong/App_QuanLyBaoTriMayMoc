import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/constants';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetAllPaginationDTO } from 'src/common/dto/get_all.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { IResponse } from 'src/common/Interfaces/respone.interface';
import { EquipmentService } from '../equipment/equipment.service';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@ApiTags('Category')
@UseGuards(AuthGuard(), RolesGuard)
@Controller('category')
export class CategoryController {

    constructor ( 
        private readonly categoryService : CategoryService,
    ){}

    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get category by id '  })
    @Roles(UserRole.ADMIN)
    @Get('/:cateId')
    async getDetailCategory(@Param('cateId') cateId: string): Promise<IResponse> {
      return this.categoryService.getCategoryById(cateId);
    }

    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary:'Create category' })
    @Roles(UserRole.ADMIN)
    @Post('/create')
    async createCategory(@Body() cate: CreateCategoryDto):Promise<IResponse> {
        return await this.categoryService.createCategory(cate);
    }

    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all category with pagination ' })
    // @Roles(UserRole.ADMIN)
    @Post('/allcategory')
    async getAllCategory(@Body() propsGet:GetAllPaginationDTO){
      	return this.categoryService.getAllCategory(propsGet);
    }

    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update information category' })
    @Roles(UserRole.ADMIN)
    @Put('/:cateId')
    async updateCategory(@Param('cateId') cateId: string, @Body() cate: UpdateCategoryDto): Promise<IResponse> {
      return this.categoryService.updateCategory(cateId , cate);
    }
    
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'delete information user' })
    @Roles(UserRole.ADMIN)
    @Delete('/:cateId')
    async deleteCategory(@Param('cateId') cateId: string): Promise<IResponse> {
      return this.categoryService.deleteCategory(cateId);
    }
}
