import { Role, Status } from '@/interfaces';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  public role: Role;

  @IsNotEmpty()
  @IsString()
  public role: string;

  @IsNotEmpty()
  @IsString()
  public username: string;

  @IsNotEmpty()
  @IsString()
  public firstname: string;

  @IsNotEmpty()
  @IsString()
  public lastname: string;

  @IsNotEmpty()
  @IsString()
  public imageUrl: string;

  @IsNotEmpty()
  @IsString()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public status: Status;
}
