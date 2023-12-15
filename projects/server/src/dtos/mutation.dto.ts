import { IsNumber, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MutationDto {
  @IsNotEmpty()
  @IsNumber()
  public senderWarehouseId: number;

  @IsNotEmpty()
  @IsNumber()
  public receiverWarehouseId: number;

  @IsNotEmpty()
  @IsString()
  public senderName: string;

  @IsNotEmpty()
  @IsNumber()
  public productId: number;

  @IsNotEmpty()
  @IsNumber()
  public quantity: number;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  public notes: string;
}
