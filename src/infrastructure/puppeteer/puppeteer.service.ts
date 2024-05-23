import { ElementHandle, Page } from 'puppeteer';
import { Recipe } from '../../domain/entities/recipe';
import { Cluster } from 'puppeteer-cluster';
import { logger } from '../pino/pino';
import { RecipeFilter } from 'src/domain/entities/recipe-filter';

/**
 * This class handles the scrapping logic by using puppeteer library
 * For now it will only fetch the name, the rating, the ratingCount and the url
 */
export class PuppeteerService {
  /**
   * The url to scrap the recipes
   */
  protected baseUrl = 'https://www.allrecipes.com/';

  protected recipes: Recipe[] = [];

  protected cluster!: Cluster;

  /**
   * Search for a recipe by scrapping allRecipes website
   * @param name The name of the ingredient of the recipe
   * @param page The number of pages to scraps
   * @returns Recipe
   */
  public async search(filters: RecipeFilter): Promise<Recipe[]> {
    this.cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 5,
      puppeteerOptions: {
        args: ['--no-sandbox'],
      },
    });

    await this.cluster.task(this.getRecipes.bind(this));

    await this.setWorkers(filters);

    await this.cluster.idle();
    await this.cluster.close();

    logger.info(
      {
        numberOfRecipesFound: this.recipes.length,
      },
      'Scrapping with puppeteer done',
    );

    return this.recipes;
  }

  /**
   * For each pages that have been requested by the user, queue a worker
   * that will handle the scrapping
   * Note that since each page is paginated with 24 elements, the offset to get
   * the next set of data (ie the next page) is a multiple of 24
   * @param filters
   */
  protected async setWorkers(filters: RecipeFilter): Promise<void> {
    await Promise.allSettled(
      Array.from({ length: filters.page! }, (_, k) => k).map((index) => {
        return this.cluster.execute(
          { ...filters, page: index * 24 },
          this.getRecipes.bind(this),
        );
      }),
    );
  }

  /**
   *  Get a set of recipes based on the filters provided by the user
   */
  protected async getRecipes({
    page,
    data,
  }: {
    page: Page;
    data: RecipeFilter;
  }): Promise<void> {
    await page.goto(
      `https://www.allrecipes.com/search?offset=${data.page}&q=${data.name}`,
      { waitUntil: 'domcontentloaded' },
    );

    const listSelector = '#mntl-search-results__list_1-0';

    const cardboxSelector = `${listSelector} .mntl-card-list-items`;

    const listELement = await page.$(listSelector);

    if (!listELement) {
      logger.warn('No results found, aborting');
      return;
    }

    const cardBoxElements = await page.$$(cardboxSelector);

    for (const cardBoxElement of cardBoxElements) {
      await this.extractRecipeData(data, cardBoxElement);
    }
  }

  /**
   * Get data from a recipe element such as the title, the rating, the rating count and the url to the recipe
   * The data received is then converted to a recipe domain object
   * @param element The element containing the recipe data
   */
  protected async extractRecipeData(
    filters: RecipeFilter,
    element: ElementHandle<Element>,
  ): Promise<void> {
    const titleSelector = '.card__title-text';

    const halfStarSelector = '.icon-star-half';

    const fullStarSelector = '.icon-star';

    const ratingCountSelector = '.mntl-recipe-card-meta__rating-count-number';

    const halfStar = await element.$(halfStarSelector);
    const fullStars = await element.$$(fullStarSelector);
    const rating = this.computeRating(fullStars, halfStar);

    if (
      (filters.minRating && rating < filters.minRating) ||
      (filters.maxRating && rating > filters.maxRating)
    ) {
      return logger.debug(
        {
          filters: {
            maxRating: filters.maxRating,
            minRating: filters.minRating,
          },
          rating,
        },
        'Recipe rating does not meet one of the filters',
      );
    }

    const ratingCountElement = await element.$(ratingCountSelector);
    const ratingsCountRaw = (await (
      await ratingCountElement!.getProperty('innerText')
    ).jsonValue()) as string;
    const ratingsCount = Number(ratingsCountRaw.replace(',', '').split(' ')[0]);

    if (
      (filters.minRatingsCount && ratingsCount < filters.minRatingsCount) ||
      (filters.maxRatingsCount && ratingsCount > filters.maxRatingsCount)
    ) {
      return logger.debug(
        {
          filters: {
            maxRatingsCount: filters.maxRatingsCount,
            minRatingsCount: filters.minRatingsCount,
          },
          ratingsCount,
        },
        'Recipe ratings count does not meet one of the filters',
      );
    }

    const titleElement = await element.$(titleSelector);
    const name = await titleElement!.evaluate((el) => el.textContent);

    const url = (await (
      await element.getProperty('href')
    ).jsonValue()) as string;

    this.recipes.push(
      new Recipe({
        name: name!,
        ratingsCount,
        rating,
        url,
      }),
    );
  }

  /**
   * Compute the rating by calculating the number of fullstars
   * and adding 0.5 to the rating if a halfStar is present
   * @param fullStars An array of DOM elements representing the full stars
   * @param halfStar The DOM element containing the half star
   * @returns
   */
  protected computeRating(
    fullStars: ElementHandle<Element>[],
    halfStar: ElementHandle<Element> | null,
  ): number {
    return fullStars.length + (!!halfStar ? 0.5 : 0);
  }

  /**
   * Converts "1,636 ratings" into 1.636
   * @param ratingsCountRaw  - The ratings count text scrapped by puppeteer
   * @returns
   */
  protected extractRatingsCountFromHtmlContent(
    ratingsCountRaw: string,
  ): number {
    return Number(ratingsCountRaw.replace(',', '').split(' ')[0]);
  }
}
