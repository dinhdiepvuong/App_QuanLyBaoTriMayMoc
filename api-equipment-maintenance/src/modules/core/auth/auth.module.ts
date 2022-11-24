import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfigs } from 'src/common/configs';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

import { EmployeeModule } from 'src/modules/employee/employee.module';
import Mail from 'src/common/function/SendMail';
import { AuthConsumer } from './auth.consumer';
import { BullModule } from '@nestjs/bull';
import { NumberHelper } from 'src/common/function/NumberHelper';
import { TimeHelper } from 'src/common/function/TimeHelper';


@Module({
    imports: [
        UsersModule,
    	EmployeeModule,
    	PassportModule.register({ defaultStrategy: 'jwt' }),
    	JwtModule.register({
        	secretOrPrivateKey: jwtConfigs.secret,
        	signOptions: { expiresIn: jwtConfigs.accessTokenExpiresIn },
    	}),
		BullModule.registerQueue({
			name: 'email-queue'
		  })
  	],
  	controllers: [AuthController],
  	providers: [AuthService, LocalStrategy, JwtStrategy, Mail,AuthConsumer,NumberHelper,TimeHelper],
  	exports: [AuthService]
})
export class AuthModule {}
