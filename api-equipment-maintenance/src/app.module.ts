import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';


import { AuthModule } from './modules/core/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig, redisConfig } from './common/configs';

import { EmployeeModule } from './modules/employee/employee.module';
import { CategoryModule } from './modules/category/category.module';
import { EquipmentModule } from './modules/equipment/equipment.module';

import { BullModule } from '@nestjs/bull';


@Module({
    imports: [
        TypeOrmModule.forRoot({
      	type: <any>dbConfig.DB_TYPE,
      	host: dbConfig.DB_HOST,
      	port: dbConfig.DB_PORT,
      	username: dbConfig.DB_USERNAME,
      	password: dbConfig.DB_PASSWORD,
      	database: dbConfig.DB_DATABASE,
      	entities: ["dist/**/*.entity{.ts,.js}"],
      	synchronize: true,
      	logging: ["error", "warn", "log"]
    }),
    BullModule.forRoot({
      redis: {
        host: redisConfig.REDIS_HOST,
        port: redisConfig.REDIS_PORT,
        db: 0,
        password: redisConfig.REDIS_PASSWORD,
      }
    }),
    UsersModule,
    AuthModule,
    ConfigModule.forRoot(),
    EmployeeModule,
    CategoryModule,
    EquipmentModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
