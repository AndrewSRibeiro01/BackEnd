import {
  isValidCnpj,
  isValidCpf,
  isValidDocument,
  stripDocument,
} from './document.validator';

describe('document.validator', () => {
  describe('stripDocument', () => {
    it('removes any non-digit characters', () => {
      expect(stripDocument('111.444.777-35')).toBe('11144477735');
      expect(stripDocument('11.222.333/0001-81')).toBe('11222333000181');
    });

    it('handles empty or null-like input', () => {
      expect(stripDocument('')).toBe('');
      expect(stripDocument(undefined as unknown as string)).toBe('');
    });
  });

  describe('isValidCpf', () => {
    it('accepts a valid CPF', () => {
      expect(isValidCpf('11144477735')).toBe(true);
    });

    it('rejects CPF with wrong length', () => {
      expect(isValidCpf('1114447773')).toBe(false);
      expect(isValidCpf('111444777350')).toBe(false);
    });

    it('rejects CPF with all equal digits', () => {
      expect(isValidCpf('11111111111')).toBe(false);
      expect(isValidCpf('00000000000')).toBe(false);
    });

    it('rejects CPF with invalid check digits', () => {
      expect(isValidCpf('11144477736')).toBe(false);
    });
  });

  describe('isValidCnpj', () => {
    it('accepts a valid CNPJ', () => {
      expect(isValidCnpj('11222333000181')).toBe(true);
    });

    it('rejects CNPJ with wrong length', () => {
      expect(isValidCnpj('1122233300018')).toBe(false);
    });

    it('rejects CNPJ with all equal digits', () => {
      expect(isValidCnpj('11111111111111')).toBe(false);
    });

    it('rejects CNPJ with invalid check digits', () => {
      expect(isValidCnpj('11222333000180')).toBe(false);
    });
  });

  describe('isValidDocument', () => {
    it('accepts formatted CPF and CNPJ', () => {
      expect(isValidDocument('111.444.777-35')).toBe(true);
      expect(isValidDocument('11.222.333/0001-81')).toBe(true);
    });

    it('rejects strings that are neither 11 nor 14 digits', () => {
      expect(isValidDocument('123')).toBe(false);
      expect(isValidDocument('12345678901234567')).toBe(false);
    });
  });
});
