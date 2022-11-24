import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Put, Query, DefaultValuePipe, ParseIntPipe, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdatePassWordUserDto } from './dto/update-password-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IResponse } from 'src/common/Interfaces/respone.interface';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/constants';
import { UserEntity } from './entities/user.entity';
import { GetAllPaginationDTO } from 'src/common/dto/get_all.dto';
import { UpdatePassWordByIdDto } from './dto/password-admin.dto';
import { UpdateUserProfileDto } from './dto/update-profile.dto';
import { ListId } from 'src/common/dto/list-id.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateAvatarDto } from '../equipment/dto/equipment.dto';

@Controller('user')
@ApiTags('User')

@UseGuards(AuthGuard(), RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @ApiBearerAuth()
  	@HttpCode(HttpStatus.OK)
  	@Get('/me')
  	async me(@CurrentUser() user: UserEntity): Promise<IResponse> {
    	return this.usersService.getUserProfile(user.id);
  	}
  
  	@ApiBearerAuth()
  	@HttpCode(HttpStatus.OK)
  	@ApiOperation({ summary: 'Get all users with pagination ' })
  	@Roles(UserRole.ADMIN)
  	@Post('/allUser')
  	async getAllUser(@Body() propsGet:GetAllPaginationDTO){
    	return this.usersService.getAllUser(propsGet)
  	}

  	@ApiBearerAuth()
  	@HttpCode(HttpStatus.OK)
  	@ApiOperation({ summary: 'Get information user' })
  	@Roles(UserRole.ADMIN)
  	@Get('/:userId')
  	async getDetailUser(@Param('userId') userId: string): Promise<IResponse> {
    	return this.usersService.getUserProfile(userId);
  	}

  	@ApiBearerAuth()
  	@HttpCode(HttpStatus.OK)
  	@ApiOperation({ summary: 'Update password information individual user' })
  	@Put('/password')
  	async UpdateUserPassWord(@CurrentUser() user: UserEntity, @Body() pass: UpdatePassWordUserDto): Promise<IResponse> {
    	return this.usersService.updateUserPassword(user.id , pass);
  	}

  
  	@ApiBearerAuth()
  	@HttpCode(HttpStatus.OK)
  	@ApiOperation({ summary: 'Update information user' })
  	@Roles(UserRole.ADMIN)
  	@Put('/lock/:userId')
  	async lockUser(@Param('userId') userId: string): Promise<IResponse> {
    	return this.usersService.lockUser(userId);
  	}
	
	@ApiBearerAuth()
  	@HttpCode(HttpStatus.OK)
  	@ApiOperation({ summary: 'Update information user' })
	@ApiConsumes('multipart/form-data')
  	@Put('/:userId')
	@UseInterceptors(FileInterceptor('avatar'))
  	async updateUserProfile(@UploadedFile()file, @Param('userId') userId: string, @Body() user: UpdateUserProfileDto): Promise<IResponse> {
    	return this.usersService.updateUserProfile(userId , user, file);
  	}
}
