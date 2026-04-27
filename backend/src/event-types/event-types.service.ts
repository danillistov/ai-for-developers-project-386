import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { EventType } from './event-type.entity';
import { Booking } from '../bookings/booking.entity';
import { CreateEventTypeDto } from './dto/create-event-type.dto';

export interface Slot {
  startTime: string;
  endTime: string;
  available: true;
}

@Injectable()
export class EventTypesService {
  constructor(
    @InjectRepository(EventType)
    private readonly eventTypeRepo: Repository<EventType>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) {}

  findAll(): Promise<EventType[]> {
    return this.eventTypeRepo.find();
  }

  async create(dto: CreateEventTypeDto): Promise<EventType> {
    const entity = this.eventTypeRepo.create({
      id: uuidv4(),
      name: dto.name,
      description: dto.description ?? null,
      duration: dto.duration,
    });
    return this.eventTypeRepo.save(entity);
  }

  async getSlots(id: string): Promise<Slot[]> {
    const eventType = await this.eventTypeRepo.findOneBy({ id });
    if (!eventType) {
      throw new NotFoundException({
        code: 'event_type_not_found',
        message: `EventType with id "${id}" not found`,
      });
    }

    const allBookings = await this.bookingRepo.find();
    const slots: Slot[] = [];
    const durationMs = eventType.duration * 60 * 1000;
    const now = new Date();

    const todayUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );

    for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
      const dayMidnight = new Date(todayUTC.getTime() + dayOffset * 24 * 60 * 60 * 1000);
      const workStart = new Date(dayMidnight.getTime() + 9 * 60 * 60 * 1000);
      const workEnd = new Date(dayMidnight.getTime() + 17 * 60 * 60 * 1000);

      let slotStart = workStart;
      while (slotStart.getTime() + durationMs <= workEnd.getTime()) {
        const slotEnd = new Date(slotStart.getTime() + durationMs);

        if (slotEnd.getTime() > now.getTime()) {
          const overlaps = allBookings.some((b) => {
            const bStart = new Date(b.startTime).getTime();
            const bEnd = new Date(b.endTime).getTime();
            return slotStart.getTime() < bEnd && slotEnd.getTime() > bStart;
          });

          if (!overlaps) {
            slots.push({
              startTime: slotStart.toISOString(),
              endTime: slotEnd.toISOString(),
              available: true,
            });
          }
        }

        slotStart = slotEnd;
      }
    }

    return slots;
  }
}
