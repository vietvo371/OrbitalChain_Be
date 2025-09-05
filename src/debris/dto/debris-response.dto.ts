export class DebrisResponseDto {
  id: string;
  catalog_id: string;
  source: string;
  epoch: Date;
  tle_line1: string;
  tle_line2: string;
  lat: number;
  lon: number;
  alt: number;
  risk_score: number;
  on_chain_tx?: string;
  created_at: Date;
  updated_at: Date;
}
