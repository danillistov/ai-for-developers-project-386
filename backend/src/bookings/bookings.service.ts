import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Booking } from './booking.entity';
import { EventType } from '../event-types/event-type.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

const WORK_START_MINUTES = 9 * 60;  // 09:00 UTC
const WORK_END_MINUTES = 17 * 60;   // 17:00 UTC

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(EventType)
    private readonly eventTypeRepo: Repository<EventType>,
  ) {}

  findAll(): Promise<Booking[]> {
    return this.bookingRepo.find({ order: { startTime: 'ASC' } });
  }

  async create(dto: CreateBookingDto): Promise<Booking> {
    // 1. eventTypeId must exist
    const eventType = await this.eventTypeRepo.findOneBy({ id: dto.eventTypeId });
    if (!eventType) {
      throw new NotFoundException({
        code: 'event_type_not_found',
        message: `EventType with id "${dto.eventTypeId}" not found`,
      });
    }

    const reqStart = new Date(dto.startTime);
    const reqEnd = new Date(dto.endTime);
    const now = new Date();

    // 2. startTime must be in the future
    if (reqStart.getTime() <= now.getTime()) {
      throw new BadRequestException({
        code: 'invalid_slot',
        message: 'startTime must be in the future',
      });
    }

    // 3. duration must match event type
    const reqDurationMs = reqEnd.getTime() - reqStart.getTime();
    const expectedDurationMs = eventType.duration * 60 * 1000;
    if (reqDurationMs !== expectedDurationMs) {
      throw new BadRequestException({
        code: 'invalid_slot',
        message: `Booking duration must be exactly ${eventType.duration} minutes`,
      });
    }

    // 4. must fall within working hours (09:00–17:00 UTC) on the same calendar day
    const startMinOfDay = reqStart.getUTCHours() * 60 + reqStart.getUTCMinutes();
    const endMinOfDay = reqEnd.getUTCHours() * 60 + reqEnd.getUTCMinutes();
    const crossesMidnight =
      reqEnd.getUTCDate() !== reqStart.getUTCDate() ||
      reqEnd.getUTCMonth() !== reqStart.getUTCMonth() ||
      reqEnd.getUTCFullYear() !== reqStart.getUTCFullYear();

    if (
      crossesMidnight ||
      startMinOfDay < WORK_START_MINUTES ||
      endMinOfDay > WORK_END_MINUTES ||
      endMinOfDay < startMinOfDay
    ) {
      throw new BadRequestException({
        code: 'invalid_slot',
        message: 'Booking must fall within working hours (09:00–17:00 UTC)',
      });
    }

    // 5. no overlap with existing bookings
    const existing = await this.bookingRepo.find();
    const hasConflict = existing.some((b) => {
      const bStart = new Date(b.startTime).getTime();
      const bEnd = new Date(b.endTime).getTime();
      return reqStart.getTime() < bEnd && reqEnd.getTime() > bStart;
    });
    if (hasConflict) {
      throw new ConflictException({
        code: 'booking_conflict',
        message: 'The requested time window overlaps with an existing booking',
      });
    }

    const booking = this.bookingRepo.create({
      id: uuidv4(),
      eventTypeId: dto.eventTypeId,
      guestName: dto.guestName,
      guestEmail: dto.guestEmail,
      startTime: reqStart.toISOString(),
      endTime: reqEnd.toISOString(),
    });

    return this.bookingRepo.save(booking);
  }
}
