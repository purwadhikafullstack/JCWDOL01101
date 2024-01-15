import { IsNotEmpty, IsNumber } from 'class-validator';

export class LastSeenProductDto {
  @IsNotEmpty()
  @IsNumber()
  public productId: number;

  @IsNotEmpty()
  @IsNumber()
  public userId: number;
}
