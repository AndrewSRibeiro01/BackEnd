import { BusinessRuleViolation } from '../../../../shared/exceptions/domain.exception';
import { Producer } from './producer.entity';

describe('Producer entity', () => {
  describe('create', () => {
    it('creates a producer with a valid CPF and normalizes the document', () => {
      const producer = Producer.create({
        document: '111.444.777-35',
        name: 'João da Silva',
      });
      expect(producer.document).toBe('11144477735');
      expect(producer.name).toBe('João da Silva');
      expect(producer.id).toEqual(expect.any(String));
    });

    it('rejects invalid CPF/CNPJ', () => {
      expect(() =>
        Producer.create({ document: '00000000000', name: 'X' }),
      ).toThrow(BusinessRuleViolation);
    });

    it('rejects empty name', () => {
      expect(() =>
        Producer.create({ document: '11144477735', name: '  ' }),
      ).toThrow(BusinessRuleViolation);
    });
  });

  describe('rename', () => {
    it('returns a new producer instance with updated name', () => {
      const original = Producer.create({
        document: '11144477735',
        name: 'Old',
      });
      const renamed = original.rename('New');
      expect(renamed.name).toBe('New');
      expect(renamed.id).toBe(original.id);
      expect(original.name).toBe('Old');
    });

    it('rejects empty name', () => {
      const producer = Producer.create({
        document: '11144477735',
        name: 'Original',
      });
      expect(() => producer.rename('')).toThrow(BusinessRuleViolation);
    });
  });

  describe('changeDocument', () => {
    it('returns a new instance with the new document', () => {
      const original = Producer.create({
        document: '11144477735',
        name: 'Original',
      });
      const updated = original.changeDocument('11222333000181');
      expect(updated.document).toBe('11222333000181');
      expect(updated.id).toBe(original.id);
    });

    it('rejects invalid documents', () => {
      const producer = Producer.create({
        document: '11144477735',
        name: 'Original',
      });
      expect(() => producer.changeDocument('12345')).toThrow(
        BusinessRuleViolation,
      );
    });
  });
});
