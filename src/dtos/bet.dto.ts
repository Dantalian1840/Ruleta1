import { IsOptional, IsString, IsInt, IsIn, Max, Min } from 'class-validator';

export class BetCreationDTO {
  @IsOptional()
  @IsString()
  @IsIn(['red', 'black'], { message: 'Color must be either "red" or "black"' })
  color?: string;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'Number must be at least 0' })
  @Max(36, { message: 'Number cannot be greater than 36' })
  number?: number;

  @IsInt()
  @Min(1, { message: 'Amount must be at least 1' })
  @Max(10000, { message: 'Amount cannot be greater than 10000' })
  amount: number;
}
