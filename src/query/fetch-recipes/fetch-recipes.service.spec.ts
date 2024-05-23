jest.mock('../../infrastructure/pino/pino');

import { FetchRecipeService } from './fetch-recipes.service';
import { PuppeteerService } from '../../infrastructure/puppeteer/puppeteer.service';

const { PuppeteerService: MockPuppeteerService } = jest.genMockFromModule<{
  PuppeteerService: typeof PuppeteerService;
}>('../../infrastructure/puppeteer/puppeteer.service');

describe('fetchRepicesService', () => {
  let fetchRecipeService: FetchRecipeService;
  let puppeteerService: jest.Mocked<PuppeteerService>;
  beforeAll(() => {
    puppeteerService =
      new MockPuppeteerService() as jest.Mocked<PuppeteerService>;
    fetchRecipeService = new FetchRecipeService(puppeteerService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('execute', () => {
    it('should try to instanciate a recipeFilter and call puppeteerService with the right parameters', async () => {
      puppeteerService.search.mockResolvedValue([]);

      await fetchRecipeService.execute({ name: 'test' });

      expect(puppeteerService.search).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'test' }),
      );
    });

    it('should ', async () => {
      puppeteerService.search.mockResolvedValue([]);

      await fetchRecipeService.execute({ name: 'test' });

      expect(puppeteerService.search).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'test' }),
      );
    });
  });
});
