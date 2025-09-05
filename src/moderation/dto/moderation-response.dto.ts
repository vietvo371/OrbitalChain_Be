export class ModerationResponseDto {
  id: string;
  observation_id: string;
  moderator_id: string;
  approved: boolean;
  approved_at: Date;
}
