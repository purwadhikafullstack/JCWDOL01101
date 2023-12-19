import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CartDto {
  @IsNumber()
  @IsNotEmpty()
  public productId: number;

  @IsNumber()
  @IsNotEmpty()
  public sizeId: number;

  @IsNumber()
  @IsNotEmpty()
  public quantity: number;

  @IsString()
  @IsNotEmpty()
  public externalId: string;
}

export class CartProductDto {
  @IsNumber()
  @IsNotEmpty()
  public productId: number;

  @IsNumber()
  @IsNotEmpty()
  public sizeId: number;

  @IsNumber()
  @IsNotEmpty()
  public quantity: number;

  @IsString()
  @IsNotEmpty()
  public cartId: number;
}
