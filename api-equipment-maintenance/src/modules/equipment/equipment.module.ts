import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { uploadFilesDir } from 'src/common/constants';
import { editFileName } from 'src/common/utils/file-upload.utils';
import { CategoryModule } from '../category/category.module';
import { EmployeeModule } from '../employee/employee.module';
import { EquipmentEntity } from './entities/equipment.entity';
import { EquipmentController } from './equipment.controller';
import { EquipmentService } from './equipment.service';

@Module({
    imports: [
        CategoryModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        TypeOrmModule.forFeature([EquipmentEntity]),
        EmployeeModule,
        MulterModule.register({
            storage:diskStorage({
                destination: `${uploadFilesDir}/equipment`,
                filename: editFileName,
            }),
            limits:{
                fieldSize: 2 * 10000000 , //20MB
            }
        })
    ],
    controllers: [EquipmentController],
    providers: [EquipmentService],
    exports : [EquipmentService],
})
export class EquipmentModule {}
