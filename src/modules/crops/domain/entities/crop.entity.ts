import { randomUUID } from 'crypto';

import { BusinessRuleViolation } from '../../../../shared/exceptions/domain.exception';

export class Crop {
  private constructor(
    public readonly id: string,
    public readonly harvestId: string,
    public readonly name: string,
  ) {}

  static create(input: { id?: string; harvestId: string; name: string }): Crop {
    if (!input.harvestId?.trim()) {
      throw new BusinessRuleViolation('harvestId is required');
    }
    const name = input.name?.trim();
    if (!name) throw new BusinessRuleViolation('Crop name is required');
    return new Crop(input.id ?? randomUUID(), input.harvestId, name);
  }

  static restore(props: { id: string; harvestId: string; name: string }): Crop {
    return new Crop(props.id, props.harvestId, props.name);
  }
}
