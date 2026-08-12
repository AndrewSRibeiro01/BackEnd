export function stripDocument(input: string): string {
  return (input ?? '').replace(/\D/g, '');
}

export function isValidCpf(digits: string): boolean {
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  const calc = (slice: string, factor: number): number => {
    let sum = 0;
    for (const char of slice) {
      sum += parseInt(char, 10) * factor--;
    }
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const d1 = calc(digits.slice(0, 9), 10);
  const d2 = calc(digits.slice(0, 10), 11);
  return d1 === parseInt(digits[9], 10) && d2 === parseInt(digits[10], 10);
}

export function isValidCnpj(digits: string): boolean {
  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const calc = (slice: string, weights: number[]): number => {
    let sum = 0;
    for (let i = 0; i < slice.length; i++) {
      sum += parseInt(slice[i], 10) * weights[i];
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const d1 = calc(digits.slice(0, 12), weights1);
  const d2 = calc(digits.slice(0, 13), weights2);
  return d1 === parseInt(digits[12], 10) && d2 === parseInt(digits[13], 10);
}

export function isValidDocument(document: string): boolean {
  const digits = stripDocument(document);
  if (digits.length === 11) return isValidCpf(digits);
  if (digits.length === 14) return isValidCnpj(digits);
  return false;
}
