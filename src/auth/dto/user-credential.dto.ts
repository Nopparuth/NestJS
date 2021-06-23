import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UserCredentialDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;
  @IsString()
  @MinLength(4, { message: 'password > 3' })
  @MaxLength(20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, {
    message: 'password too weak',
  })
  password: string;
}
