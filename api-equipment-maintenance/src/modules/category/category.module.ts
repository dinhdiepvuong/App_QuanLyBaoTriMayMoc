import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentModule } from '../equipment/equipment.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryEntity } from './entities/category.entity';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        TypeOrmModule.forFeature([CategoryEntity]),       
    ],
    controllers: [CategoryController],
    providers: [CategoryService],
    exports:[CategoryService]
})
export class CategoryModule {}
