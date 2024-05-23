import { PuppeteerService } from '../../infrastructure/puppeteer/puppeteer.service';
import { RecipeFilter } from '../../domain/entities/recipe-filter';
import { logger } from '../../infrastructure/pino/pino';

/**
 * Handles the creation of a recipe filter domain and call pupeteerService to scrap recipes
 */
export class FetchRecipeService {
  constructor(protected readonly puppeteerService?: PuppeteerService) {
    if (!puppeteerService) {
      this.puppeteerService = new PuppeteerService();
    }
  }

  public async execute({
    page,
    name,
    maxRating,
    minRating,
    maxRatingsCount,
    minRatingsCount,
  }: Omit<RecipeFilter, 'validate'>) {
    const filters = new RecipeFilter({
      page,
      name,
      maxRating,
      minRating,
      maxRatingsCount,
      minRatingsCount,
    });

    logger.info({ filters }, 'Calling puppeteerService');

    return this.puppeteerService!.search(filters);
  }
}
