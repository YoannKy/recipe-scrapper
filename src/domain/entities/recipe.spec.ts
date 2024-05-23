import { DomainValidationError } from '../errors/domain-validation.error';
import { Recipe } from './recipe';

describe('Recipe entity', () => {
  it('should throw an error if no parameters are passed to instanciate a recipe', () => {
    let recipe: Recipe | undefined = undefined;
    try {
      recipe = new Recipe({} as any);
    } catch (error) {
      expect(error).toBeInstanceOf(DomainValidationError);
      expect((error as DomainValidationError).message).toContain(
        'name should not be null or undefined',
      );
      expect((error as DomainValidationError).message).toContain(
        'rating should not be null or undefined',
      );
      expect((error as DomainValidationError).message).toContain(
        'ratingsCount should not be null or undefined',
      );
      expect((error as DomainValidationError).message).toContain(
        'url should not be null or undefined',
      );
      expect(recipe).toBeUndefined();
    }
  });

  it('should not throw an error if all parameters are passed and are valid', () => {
    const recipe = new Recipe({
      url: 'http://test.com',
      name: 'test',
      rating: 5.4,
      ratingsCount: 525,
    });
    expect(recipe).toEqual(
      expect.objectContaining({
        url: 'http://test.com',
        name: 'test',
        rating: 5.4,
        ratingsCount: 525,
      }),
    );
  });
  describe('name', () => {
    it('should throw an error if the Recipe has an invalid name', () => {
      let recipe: Recipe | undefined = undefined;
      try {
        recipe = new Recipe({
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

  describe('rating', () => {
    it('should throw an error if the Recipe has an invalid rating', () => {
      let recipe: Recipe | undefined = undefined;
      try {
        recipe = new Recipe({
          rating: '1',
        } as any);
      } catch (error) {
        expect(error).toBeInstanceOf(DomainValidationError);
        expect((error as DomainValidationError).message).toContain(
          'rating must be a number',
        );
        expect(recipe).toBeUndefined();
      }
    });
  });

  describe('ratingsCount', () => {
    it('should throw an error if the Recipe has an invalid ratingsCount (not a number)', () => {
      let recipe: Recipe | undefined = undefined;
      try {
        recipe = new Recipe({
          ratingsCount: '1',
        } as any);
      } catch (error) {
        expect(error).toBeInstanceOf(DomainValidationError);
        expect((error as DomainValidationError).message).toContain(
          'ratingsCount must be a number',
        );
        expect(recipe).toBeUndefined();
      }
    });

    it('should throw an error if the Recipe has an invalid ratingsCount (more than one decimal)', () => {
      let recipe: Recipe | undefined = undefined;
      try {
        recipe = new Recipe({
          ratingsCount: 1.56,
        } as any);
      } catch (error) {
        expect(error).toBeInstanceOf(DomainValidationError);
        expect((error as DomainValidationError).message).toContain(
          'ratingsCount must be a number conforming to the specified constraints',
        );
        expect(recipe).toBeUndefined();
      }
    });
  });
});
