import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { EmployeeModule } from '../employee/employee.module';

import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { uploadFilesDir } from 'src/common/constants';
import { editFileName } from 'src/common/utils/file-upload.utils';

@Module({
    imports: [
        EmployeeModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        TypeOrmModule.forFeature([UserEntity]),

        MulterModule.register({
            storage:diskStorage({
                destination: `${uploadFilesDir}/avatar`,
                filename: editFileName,
            }),
            limits:{
                fieldSize: 2 * 10000000 , //20MB
            }
        })
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {}
