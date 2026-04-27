import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class CreateEventTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  duration: number;
}
