import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('event_types')
export class EventType {
  @PrimaryColumn('text')
  id: string;

  @Column('text')
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column('integer')
  duration: number;
}
