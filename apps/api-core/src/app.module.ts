import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { getDatabaseConfig } from './config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertyModule } from './modules/property/property.module';
import { AuditModule } from './modules/audit/audit.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AmenityModule } from './modules/amenity/amenity.module';
import { RoomTypeModule } from './modules/room-type/room-type.module';
import { RoomModule } from './modules/room/room.module';
import { GuestModule } from './modules/guest/guest.module';
import { BookingModule } from './modules/booking/booking.module';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    AuditModule,
    PropertyModule,
    UserModule,
    AuthModule,
    AmenityModule,
    RoomTypeModule,
    RoomModule,
    GuestModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
})
export class AppModule {}
