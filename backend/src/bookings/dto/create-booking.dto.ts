import { IsString, IsNotEmpty, IsEmail, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  eventTypeId: string;

  @IsString()
  @IsNotEmpty()
  guestName: string;

  @IsEmail()
  guestEmail: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}
