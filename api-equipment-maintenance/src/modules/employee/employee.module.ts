import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { EmployeeEntity } from './entities/employee.entity';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        TypeOrmModule.forFeature([EmployeeEntity]),
    ],
    controllers: [EmployeeController],
    providers: [EmployeeService],
    exports: [EmployeeService]
})
export class EmployeeModule {}
