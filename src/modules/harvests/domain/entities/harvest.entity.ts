import { randomUUID } from 'crypto';

import { BusinessRuleViolation } from '../../../../shared/exceptions/domain.exception';

const MIN_YEAR = 2000;
const MAX_YEAR = 2100;

export class Harvest {
  private constructor(
    public readonly id: string,
    public readonly farmId: string,
    public readonly year: number,
  ) {}

  static create(input: { id?: string; farmId: string; year: number }): Harvest {
    if (!input.farmId?.trim()) {
      throw new BusinessRuleViolation('farmId is required');
    }
    if (
      !Number.isInteger(input.year) ||
      input.year < MIN_YEAR ||
      input.year > MAX_YEAR
    ) {
      throw new BusinessRuleViolation(
        `year must be an integer between ${MIN_YEAR} and ${MAX_YEAR}`,
      );
    }
    return new Harvest(input.id ?? randomUUID(), input.farmId, input.year);
  }

  static restore(props: { id: string; farmId: string; year: number }): Harvest {
    return new Harvest(props.id, props.farmId, props.year);
  }

  get label(): string {
    return `Safra ${this.year}`;
  }
}
