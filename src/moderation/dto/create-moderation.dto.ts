import { IsString, IsNotEmpty, IsUUID, IsBoolean } from 'class-validator';

export class CreateModerationDto {
  @IsUUID()
  @IsNotEmpty()
  observation_id: string;

  @IsUUID()
  @IsNotEmpty()
  moderator_id: string;

  @IsBoolean()
  approved: boolean;
}
