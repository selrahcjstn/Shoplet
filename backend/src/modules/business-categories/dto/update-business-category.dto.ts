import { PartialType } from '@nestjs/swagger';
import { CreateBusinessCategoryDto } from './create-business-category.dto.js';

export class UpdateBusinessCategoryDto extends PartialType(
  CreateBusinessCategoryDto,
) {}
