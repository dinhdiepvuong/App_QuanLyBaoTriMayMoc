import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/constants';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { GetAllPaginationDTO } from 'src/common/dto/get_all.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { IResponse } from 'src/common/Interfaces/respone.interface';
import { UserEntity } from '../users/entities/user.entity';
import { UpdateEmployeeDTO } from './dto/employee.dto';
import { EmployeeService } from './employee.service';

@ApiTags('Employee')

@UseGuards(AuthGuard(), RolesGuard)
@Controller('employee')
export class EmployeeController {
    constructor(private readonly employeeService:EmployeeService){}

}
