import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PaymentDto {
  @IsNotEmpty()
  @IsNumber()
  public orderId: number;

  @IsNotEmpty()
  @IsString()
  public method: string;

  @IsNotEmpty()
  @IsString()
  public virtualAccount: string;

  @IsNotEmpty()
  @IsString()
  public status: string;

  @IsNotEmpty()
  @IsString()
  public paymentDate: Date;
}
