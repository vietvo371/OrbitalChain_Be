export class ObservationResponseDto {
  id: string;
  user_id: string;
  debris_id: string;
  image_url?: string;
  note?: string;
  location_lat: number;
  location_lon: number;
  location_alt: number;
  approved: boolean;
  submitted_at: Date;
  updated_at: Date;
  tx_hash?: string;
}
