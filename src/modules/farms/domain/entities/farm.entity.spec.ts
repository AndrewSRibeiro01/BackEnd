import { BusinessRuleViolation } from '../../../../shared/exceptions/domain.exception';
import { Farm } from './farm.entity';

const baseProps = {
  producerId: '11111111-1111-1111-1111-111111111111',
  name: 'Fazenda Boa Vista',
  city: 'Uberaba',
  state: 'MG',
  totalHa: 100,
  arableHa: 60,
  vegetationHa: 40,
};

describe('Farm entity', () => {
  it('creates a valid farm and normalizes state to uppercase', () => {
    const farm = Farm.create({ ...baseProps, state: 'mg' });
    expect(farm.state).toBe('MG');
    expect(farm.areas.totalHa).toBe(100);
  });

  it('rejects an invalid Brazilian state', () => {
    expect(() => Farm.create({ ...baseProps, state: 'XX' })).toThrow(
      BusinessRuleViolation,
    );
  });

  it('rejects when arable + vegetation exceeds total', () => {
    expect(() =>
      Farm.create({
        ...baseProps,
        totalHa: 100,
        arableHa: 80,
        vegetationHa: 30,
      }),
    ).toThrow(BusinessRuleViolation);
  });

  it('rejects empty name or city', () => {
    expect(() => Farm.create({ ...baseProps, name: '  ' })).toThrow(
      BusinessRuleViolation,
    );
    expect(() => Farm.create({ ...baseProps, city: '' })).toThrow(
      BusinessRuleViolation,
    );
  });

  describe('update', () => {
    it('keeps unchanged fields when a subset is provided', () => {
      const farm = Farm.create(baseProps);
      const updated = farm.update({ name: 'Novo Nome' });
      expect(updated.name).toBe('Novo Nome');
      expect(updated.city).toBe(baseProps.city);
      expect(updated.areas.totalHa).toBe(baseProps.totalHa);
    });

    it('re-validates area invariant when areas are partially updated', () => {
      const farm = Farm.create(baseProps);
      expect(() => farm.update({ arableHa: 90 })).toThrow(
        BusinessRuleViolation,
      );
    });
  });
});
