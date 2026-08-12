import { BusinessRuleViolation } from '../../../../shared/exceptions/domain.exception';
import { Harvest } from './harvest.entity';

const farmId = '11111111-1111-1111-1111-111111111111';

describe('Harvest entity', () => {
  it('creates a valid harvest', () => {
    const harvest = Harvest.create({ farmId, year: 2024 });
    expect(harvest.year).toBe(2024);
    expect(harvest.label).toBe('Safra 2024');
  });

  it('rejects year outside supported range', () => {
    expect(() => Harvest.create({ farmId, year: 1999 })).toThrow(
      BusinessRuleViolation,
    );
    expect(() => Harvest.create({ farmId, year: 2101 })).toThrow(
      BusinessRuleViolation,
    );
  });

  it('rejects non-integer year', () => {
    expect(() => Harvest.create({ farmId, year: 2024.5 })).toThrow(
      BusinessRuleViolation,
    );
  });

  it('rejects missing farmId', () => {
    expect(() => Harvest.create({ farmId: '', year: 2024 })).toThrow(
      BusinessRuleViolation,
    );
  });
});
