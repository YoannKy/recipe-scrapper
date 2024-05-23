import { IsDefined, IsNumber, IsString } from 'class-validator';
import { Validator } from './validator';

/**
 * A Recipe is a set of instructions for preparing a dish
 */
export class Recipe extends Validator<Recipe> {
  /**
   * A recipe can be identified by its name
   * ie: 'Ratatouille'
   */
  @IsDefined()
  @IsString()
  public name!: string;

  /**
   * Average score from 0 to 5, 0 meaning that the recipe was abysmal
   * while 5 means that the recipe is excellent
   * ie: '4.3'
   */
  @IsDefined()
  @IsNumber()
  public rating!: number;

  /**
   * How many users have rated the recipe
   * ie: '563'
   */
  @IsDefined()
  @IsNumber({
    maxDecimalPlaces: 1,
  })
  public ratingsCount!: number;

  /**
   * The link to see the eetails of the recipe
   */
  @IsDefined()
  @IsString()
  public url!: string;
}
