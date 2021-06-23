import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateCommentsDto {
  @IsNotEmpty()
  @MinLength(3, {
    message: 'Title is too short, please try again',
  })
  title: string;

  @IsNotEmpty()
  desc: string;

  userId: number;
}
