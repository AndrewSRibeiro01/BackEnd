import { BusinessRuleViolation } from '../../../../shared/exceptions/domain.exception';
import { FarmAreas } from './farm-areas.value-object';

describe('FarmAreas', () => {
  it('accepts when arable + vegetation equals total', () => {
    const areas = FarmAreas.create({
      totalHa: 100,
      arableHa: 60,
      vegetationHa: 40,
    });
    expect(areas.totalHa).toBe(100);
  });

  it('accepts when arable + vegetation is less than total', () => {
    expect(() =>
      FarmAreas.create({ totalHa: 100, arableHa: 30, vegetationHa: 20 }),
    ).not.toThrow();
  });

  it('rejects when arable + vegetation exceeds total', () => {
    expect(() =>
      FarmAreas.create({ totalHa: 100, arableHa: 70, vegetationHa: 40 }),
    ).toThrow(BusinessRuleViolation);
  });

  it('rejects negative values', () => {
    expect(() =>
      FarmAreas.create({ totalHa: 100, arableHa: -1, vegetationHa: 40 }),
    ).toThrow(BusinessRuleViolation);
    expect(() =>
      FarmAreas.create({ totalHa: -1, arableHa: 0, vegetationHa: 0 }),
    ).toThrow(BusinessRuleViolation);
  });

  it('rejects non-finite values', () => {
    expect(() =>
      FarmAreas.create({
        totalHa: Number.NaN,
        arableHa: 0,
        vegetationHa: 0,
      }),
    ).toThrow(BusinessRuleViolation);
  });
});
