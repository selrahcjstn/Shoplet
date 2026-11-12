import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateShopContactDto } from './create-shop-contact.dto.js';

export class UpdateShopContactDto extends PartialType(
  OmitType(CreateShopContactDto, ['shopId'] as const),
) {}
