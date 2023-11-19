import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  @IsNumber()
  public categoryId: number;

  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsNumber()
  public price: number;

  @IsNotEmpty()
  @IsNumber()
  public stock: number;

  @IsNotEmpty()
  @IsNumber()
  public sold: number;

  @IsNotEmpty()
  @IsString()
  public image: string;

  @IsNotEmpty()
  @IsNumber()
  public weight: number;

  @IsString()
  public description: string;
}
