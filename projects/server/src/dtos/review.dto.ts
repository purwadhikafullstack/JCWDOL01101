import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReviewDto {
  @IsNumber()
  @IsNotEmpty()
  public productId: number;

  @IsNumber()
  @IsNotEmpty()
  public userId: number;

  @IsString()
  @IsNotEmpty()
  public nickname: string;

  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  @IsNotEmpty()
  public comment: string;
}
