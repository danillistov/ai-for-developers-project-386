import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('bookings')
export class Booking {
  @PrimaryColumn('text')
  id: string;

  @Column('text')
  eventTypeId: string;

  @Column('text')
  guestName: string;

  @Column('text')
  guestEmail: string;

  // Stored as ISO 8601 UTC string — lexicographic sort equals chronological sort
  @Column('text')
  startTime: string;

  @Column('text')
  endTime: string;
}
