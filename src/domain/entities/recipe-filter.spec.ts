import { DomainValidationError } from '../errors/domain-validation.error';
import { RecipeFilter } from './recipe-filter';

describe('RecipeFilter entity', () => {
  it('should throw an error if no parameters are passed to instanciate a recipe', () => {
    let recipe: RecipeFilter | undefined = undefined;
    try {
      recipe = new RecipeFilter({} as any);
    } catch (error) {
      expect(error).toBeInstanceOf(DomainValidationError);
      expect((error as DomainValidationError).message).toContain(
        'name should not be null or undefined',
      );
      expect(recipe).toBeUndefined();
    }
  });

  it('should not throw an error if all parameters are passed and are valid', () => {
    const recipe = new RecipeFilter({
      name: 'test',
      page: 1,
      minRatingsCount: 100,
      maxRatingsCount: 1000,
      minRating: 3.5,
      maxRating: 4,
    });
    expect(recipe).toEqual(
      expect.objectContaining({
        name: 'test',
        page: 1,
        minRatingsCount: 100,
        maxRatingsCount: 1000,
        minRating: 3.5,
        maxRating: 4,
      }),
    );
  });
  describe('name', () => {
    it('should throw an error if the RecipeFilter has an invalid name', () => {
      let recipe: RecipeFilter | undefined = undefined;
      try {
        recipe = new RecipeFilter({
          name: 1,
        } as any);
      } catch (error) {
        expect(error).toBeInstanceOf(DomainValidationError);
        expect((error as DomainValidationError).message).toContain(
          'name must be a string',
        );
        expect(recipe).toBeUndefined();
      }
    });
  });

  describe('page', () => {
    it('should throw an error if the RecipeFilter has an invalid page', () => {
      let recipe: RecipeFilter | undefined = undefined;
      try {
        recipe = new RecipeFilter({
          page: '1',
        } as any);
      } catch (error) {
        expect(error).toBeInstanceOf(DomainValidationError);
        expect((error as DomainValidationError).message).toContain(
          'page must be a number',
        );
        expect(recipe).toBeUndefined();
      }
    });

    it('should default page to 1 if page is not provided', () => {
      const recipe = new RecipeFilter({
        name: 'test',
      });
      expect(recipe.page).toEqual(1);
    });

    it('should throw an error if the RecipeFilter has an invalid page( lower than 1)', () => {
      let recipe: RecipeFilter | undefined = undefined;
      try {
        recipe = new RecipeFilter({
          page: 0,
        } as any);
      } catch (error) {
        expect(error).toBeInstanceOf(DomainValidationError);
        expect((error as DomainValidationError).message).toContain(
          'page must not be less than 1',
        );
        expect(recipe).toBeUndefined();
      }
    });
  });

  describe('minRating', () => {
    it('should throw an error if the RecipeFilter has an invalid min rating', () => {
      let recipe: RecipeFilter | undefined = undefined;
      try {
        recipe = new RecipeFilter({
          minRating: '1',
        } as any);
      } catch (error) {
        expect(error).toBeInstanceOf(DomainValidationError);
        expect((error as DomainValidationError).message).toContain(
          'minRating must be a number',
        );
        expect(recipe).toBeUndefined();
      }
    });

    it('should throw an error if the RecipeFilter has an invalid rating (more than one decimal)', () => {
      let recipe: RecipeFilter | undefined = undefined;
      try {
        recipe = new RecipeFilter({
          minRating: '1',
        } as any);
      } catch (error) {
        expect(error).toBeInstanceOf(DomainValidationError);
        expect((error as DomainValidationError).message).toContain(
          'minRating must be a number conforming to the specified constraints',
        );
        expect(recipe).toBeUndefined();
      }
    });
  });

  describe('maxRating', () => {
    it('should throw an error if the RecipeFilter has an invalid max rating', () => {
      let recipe: RecipeFilter | undefined = undefined;
      try {
        recipe = new RecipeFilter({
          maxRating: '1',
        } as any);
      } catch (error) {
        expect(error).toBeInstanceOf(DomainValidationError);
        expect((error as DomainValidationError).message).toContain(
          'maxRating must be a number',
        );
        expect(recipe).toBeUndefined();
      }
    });

    it('should throw an error if the RecipeFilter has an invalid rating (more than one decimal)', () => {
      let recipe: RecipeFilter | undefined = undefined;
      try {
        recipe = new RecipeFilter({
          maxRating: '1',
        } as any);
      } catch (error) {
        expect(error).toBeInstanceOf(DomainValidationError);
        expect((error as DomainValidationError).message).toContain(
          'maxRating must be a number conforming to the specified constraints',
        );
        expect(recipe).toBeUndefined();
      }
    });
  });

  describe('minRatingsCount', () => {
    it('should throw an error if the RecipeFilter has an invalid minRatingsCount', () => {
      let recipe: RecipeFilter | undefined = undefined;
      try {
        recipe = new RecipeFilter({
          minRatingsCount: '1',
        } as any);
      } catch (error) {
        expect(error).toBeInstanceOf(DomainValidationError);
        expect((error as DomainValidationError).message).toContain(
          'minRatingsCount must be a number',
        );
        expect(recipe).toBeUndefined();
      }
    });
  });

  describe('maxRatingsCount', () => {
    it('should throw an error if the RecipeFilter has an invalid maxRatingsCount', () => {
      let recipe: RecipeFilter | undefined = undefined;
      try {
        recipe = new RecipeFilter({
          maxRatingsCount: '1',
        } as any);
      } catch (error) {
        expect(error).toBeInstanceOf(DomainValidationError);
        expect((error as DomainValidationError).message).toContain(
          'maxRatingsCount must be a number',
        );
        expect(recipe).toBeUndefined();
      }
    });
  });
});
