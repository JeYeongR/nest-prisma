import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { Category } from './post-category.enum';

export class CreatePostDto {
  @IsNotEmpty()
  @MaxLength(30)
  title: string;

  @IsNotEmpty()
  @MaxLength(300)
  content: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsNotEmpty()
  @IsEnum(Category)
  category: Category;
}
