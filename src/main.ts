'phantom image: web-node:v3';

/**
 * This script takes a buster argument which is an input provided upon the GUI of phantombuster
 * and will then fetch a set of recipes based on the filters that have been provided in the argument
 * The script accepts the following filters
 * - name
 * - page
 * - maxRating
 * - minRating
 * - minRatingsCount
 * - maxRatingCounts
 * Several pages can be requested but beware that this will take more time to fetch (100 pages to fetch takes ~1min)
 */

import Buster from 'phantombuster';
import { logger } from './infrastructure/pino/pino';
import { RecipeFilter } from './domain/entities/recipe-filter';
import { FetchRecipeService } from './query/fetch-recipes/fetch-recipes.service';
import { Recipe } from './domain/entities/recipe';
import { DomainValidationError } from './domain/errors/domain-validation.error';

const buster = new Buster();

(async () => {
  logger.info('Script has been launched');

  const {
    page,
    name,
    minRating,
    maxRating,
    maxRatingsCount,
    minRatingsCount,
  }: RecipeFilter = buster.argument as RecipeFilter;

  const fetchRecipeService = new FetchRecipeService();

  let recipes: Recipe[];
  try {
    recipes = await fetchRecipeService.execute({
      page,
      name,
      minRating,
      maxRating,
      maxRatingsCount,
      minRatingsCount,
    });
  } catch (error) {
    if (error instanceof DomainValidationError) {
      logger.error(
        {
          error: {
            message: (error as Error).message,
            stack: (error as Error).stack,
          },
        },
        'One of the arguments passed is wrong',
      );
    } else {
      logger.error(
        {
          error: {
            message: (error as Error).message,
            stack: (error as Error).stack,
          },
        },
        'Something went wrong while trying to build the filters',
      );
    }
    return process.exit(1);
  }

  try {
    await buster.setResultObject(recipes);
  } catch (error) {
    logger.error(
      {
        error: {
          message: (error as Error).message,
          stack: (error as Error).stack,
        },
      },
      'Could not upload the result to phantombuster container',
    );
  }

  logger.info({ numberOfRecipes: recipes.length }, 'Script done');

  process.exit();
})();
