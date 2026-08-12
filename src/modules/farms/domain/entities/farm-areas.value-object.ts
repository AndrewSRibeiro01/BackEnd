import { BusinessRuleViolation } from '../../../../shared/exceptions/domain.exception';

export class FarmAreas {
  private constructor(
    public readonly totalHa: number,
    public readonly arableHa: number,
    public readonly vegetationHa: number,
  ) {}

  static create(input: {
    totalHa: number;
    arableHa: number;
    vegetationHa: number;
  }): FarmAreas {
    const { totalHa, arableHa, vegetationHa } = input;

    for (const [label, value] of [
      ['totalHa', totalHa],
      ['arableHa', arableHa],
      ['vegetationHa', vegetationHa],
    ] as const) {
      if (!Number.isFinite(value) || value < 0) {
        throw new BusinessRuleViolation(`${label} must be a non-negative number`);
      }
    }

    if (arableHa + vegetationHa > totalHa) {
      throw new BusinessRuleViolation(
        'The sum of arable and vegetation areas cannot exceed the total area',
      );
    }

    return new FarmAreas(totalHa, arableHa, vegetationHa);
  }
}
