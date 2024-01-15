import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  public role: string;

  @IsNotEmpty()
  @IsString()
  public username: string;

  @IsNotEmpty()
  @IsString()
  public password: string;

  @IsNotEmpty()
  @IsString()
  public status: string;
}
