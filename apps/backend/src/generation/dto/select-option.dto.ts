import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { SelectedOption } from '../../types';

export class SelectOptionDto {
  @IsString()
  @IsNotEmpty()
  generationId: string;

  @IsEnum(SelectedOption, { message: 'Selected option must be either A or B' })
  selectedOption: SelectedOption;
}