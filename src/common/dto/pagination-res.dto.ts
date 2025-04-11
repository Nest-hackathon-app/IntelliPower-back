import { ApiProperty } from '@nestjs/swagger';

export class PaginationDtoRes<T> {
  @ApiProperty({
    description: 'The content of the page with the data you need',
    type: [Object],
  })
  content: Array<T>;
  @ApiProperty({ description: 'Whether this is the last page' })
  isLastPage: boolean;
  @ApiProperty({ description: 'The current page number' })
  page: number;
  @ApiProperty({ description: 'The total number of pages' })
  limit: number;
}
