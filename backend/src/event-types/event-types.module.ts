import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventTypesController } from './event-types.controller';
import { EventTypesService } from './event-types.service';
import { EventType } from './event-type.entity';
import { Booking } from '../bookings/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventType, Booking])],
  controllers: [EventTypesController],
  providers: [EventTypesService],
})
export class EventTypesModule {}
