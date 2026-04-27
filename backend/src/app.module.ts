import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventTypesModule } from './event-types/event-types.module';
import { BookingsModule } from './bookings/bookings.module';
import { EventType } from './event-types/event-type.entity';
import { Booking } from './bookings/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DATABASE_PATH ?? 'booking.sqlite',
      entities: [EventType, Booking],
      synchronize: true,
      logging: false,
    }),
    EventTypesModule,
    BookingsModule,
  ],
})
export class AppModule {}
