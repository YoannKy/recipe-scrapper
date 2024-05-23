import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Validator } from './validator';
import { DomainValidationError } from '../errors/domain-validation.error';

/**
 * Upon searching for a recipe, a set of filters can be applied to narrow the results
 */
export class RecipeFilter extends Validator<RecipeFilter> {
  constructor(object: Omit<RecipeFilter, 'validate'>) {
    super(object);
    if (object.page === undefined) {
      this.page = 1;
    }
  }
  /**
   * The name of the recipe/ingredient to look for
   * ie: 'Ratatouille'
   */
  @IsDefined()
  @IsString()
  public name!: string;

  /**
   * How many pages should be requested upon scrapping the recipes
   * if the argument is not provided, default page will be 1
   * ie: 5
   */
  @IsOptional()
  @IsNumber()
  @Min(1)
  public page?: number;

  /**
   * Users can rate a recipe
   * What is the minimum rating the recipe should have
   * ie: '4.3'
   */
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Max(5)
  @Min(0)
  public minRating?: number;

  /**
   * Users can rate a recipe
   * What is the maximum rating the recipe should have
   * ie: '5'
   */
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Max(5)
  @Min(0)
  public maxRating?: number;

  /**
   * What is the minimum number of ratings the recipe should have
   * ie: '2'
   */
  @IsOptional()
  @IsNumber()
  public minRatingsCount?: number;

  /**
   * What is the maximum number of ratings the recipe should have
   * ie: '500'
   */
  @IsOptional()
  @IsNumber()
  public maxRatingsCount?: number;

  public validate(): void {
    super.validate();
    if (
      this.maxRatingsCount &&
      this.minRatingsCount &&
      this.maxRatingsCount < this.minRatingsCount
    ) {
      throw new DomainValidationError(
        'The maxRatingsCount cannot be lower than minRatingsCount',
      );
    }
    if (this.minRating && this.maxRating && this.maxRating < this.minRating) {
      throw new DomainValidationError(
        'The maxRatingsCount cannot be lower than minRatingsCount',
      );
    }
  }
}
