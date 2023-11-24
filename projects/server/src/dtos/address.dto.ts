import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddressDto {
  @IsNotEmpty()
  @IsString()
  public userId: number;

  @IsNotEmpty()
  @IsString()
  public recepient: string;

  @IsNotEmpty()
  @IsString()
  public phone: string;

  @IsNotEmpty()
  @IsString()
  public label: string;

  @IsNotEmpty()
  @IsString()
  public cityId: string;

  @IsNotEmpty()
  @IsString()
  public address: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  public notes: string;

  @IsNotEmpty()
  @IsBoolean()
  public isMain: boolean;
}
