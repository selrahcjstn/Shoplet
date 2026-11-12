import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsTotalsDto {
  @ApiProperty({ example: 120 }) storeViews!: number;
  @ApiProperty({ example: 340 }) productViews!: number;
  @ApiProperty({ example: 18 }) contactClicks!: number;
}

export class AnalyticsDayDto extends AnalyticsTotalsDto {
  @ApiProperty({
    example: '2026-11-12',
    description: 'Local date in the requested timezone',
  })
  date!: string;
}

export class AnalyticsTopProductDto {
  @ApiProperty({ format: 'uuid' }) productId!: string;
  @ApiProperty({ example: 'Soy candle, cedar' }) name!: string;
  @ApiProperty({ example: 42 }) views!: number;
  @ApiProperty({ example: 5 }) contactClicks!: number;
}

export class AnalyticsLeastViewedDto {
  @ApiProperty({ format: 'uuid' }) productId!: string;
  @ApiProperty({ example: 'Napkin set of four' }) name!: string;
  @ApiProperty({ example: 0 }) views!: number;
}

export class AnalyticsContactTypeDto {
  @ApiProperty({ example: 'instagram' }) contactType!: string;
  @ApiProperty({ example: 9 }) clicks!: number;
}

export class AnalyticsRangeDto {
  @ApiProperty({ example: 30 }) days!: number;
  @ApiProperty({ example: '2026-10-14' }) from!: string;
  @ApiProperty({ example: '2026-11-12' }) to!: string;
  @ApiProperty({ example: 'Asia/Manila' }) timezone!: string;
}

export class AnalyticsResponseDto {
  @ApiProperty({ type: AnalyticsRangeDto }) range!: AnalyticsRangeDto;
  @ApiProperty({ type: AnalyticsTotalsDto }) totals!: AnalyticsTotalsDto;
  @ApiProperty({
    type: AnalyticsTotalsDto,
    description: 'The same totals for the period just before this one',
  })
  previous!: AnalyticsTotalsDto;
  @ApiProperty({ type: AnalyticsDayDto, isArray: true })
  daily!: AnalyticsDayDto[];
  @ApiProperty({ type: AnalyticsTopProductDto, isArray: true })
  topProducts!: AnalyticsTopProductDto[];
  @ApiProperty({
    type: AnalyticsLeastViewedDto,
    isArray: true,
    description:
      'Visible products with the fewest views, apart from the top ones',
  })
  leastViewed!: AnalyticsLeastViewedDto[];
  @ApiProperty({ type: AnalyticsContactTypeDto, isArray: true })
  contactsByType!: AnalyticsContactTypeDto[];
}
