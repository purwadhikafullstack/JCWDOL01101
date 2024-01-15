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
  public weight: number;

  @IsNotEmpty()
  @IsString()
  public size: number[];

  @IsString()
  public description: string;
}
