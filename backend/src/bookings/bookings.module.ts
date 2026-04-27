import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.entity';
import { EventType } from '../event-types/event-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, EventType])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
