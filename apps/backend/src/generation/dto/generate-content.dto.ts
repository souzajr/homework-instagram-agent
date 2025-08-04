import { IsEnum, IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ContentType } from '../../types';

export class GenerateContentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200, { message: 'Prompt must be less than 200 characters' })
  prompt: string;

  @IsEnum(ContentType, { message: 'Type must be either POST or STORY' })
  type: ContentType;
}