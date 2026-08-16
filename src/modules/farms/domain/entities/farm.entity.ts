import { randomUUID } from 'crypto';

import { BusinessRuleViolation } from '../../../../shared/exceptions/domain.exception';
import { BrazilianState, isBrazilianState } from './brazilian-state';
import { FarmAreas } from './farm-areas.value-object';

export interface FarmProps {
  id?: string;
  producerId: string;
  name: string;
  city: string;
  state: string;
  totalHa: number;
  arableHa: number;
  vegetationHa: number;
}

export class Farm {
  private constructor(
    public readonly id: string,
    public readonly producerId: string,
    public readonly name: string,
    public readonly city: string,
    public readonly state: BrazilianState,
    public readonly areas: FarmAreas,
  ) {}

  static create(props: FarmProps): Farm {
    const name = props.name?.trim();
    if (!name) throw new BusinessRuleViolation('Farm name is required');

    const city = props.city?.trim();
    if (!city) throw new BusinessRuleViolation('City is required');

    const state = props.state?.trim().toUpperCase();
    if (!state || !isBrazilianState(state)) {
      throw new BusinessRuleViolation('State must be a valid Brazilian UF');
    }

    if (!props.producerId?.trim()) {
      throw new BusinessRuleViolation('producerId is required');
    }

    const areas = FarmAreas.create({
      totalHa: props.totalHa,
      arableHa: props.arableHa,
      vegetationHa: props.vegetationHa,
    });

    return new Farm(
      props.id ?? randomUUID(),
      props.producerId,
      name,
      city,
      state,
      areas,
    );
  }

  static restore(props: {
    id: string;
    producerId: string;
    name: string;
    city: string;
    state: string;
    totalHa: number;
    arableHa: number;
    vegetationHa: number;
  }): Farm {
    return new Farm(
      props.id,
      props.producerId,
      props.name,
      props.city,
      props.state as BrazilianState,
      FarmAreas.create({
        totalHa: props.totalHa,
        arableHa: props.arableHa,
        vegetationHa: props.vegetationHa,
      }),
    );
  }

  update(patch: Partial<Omit<FarmProps, 'id' | 'producerId'>>): Farm {
    return Farm.create({
      id: this.id,
      producerId: this.producerId,
      name: patch.name ?? this.name,
      city: patch.city ?? this.city,
      state: patch.state ?? this.state,
      totalHa: patch.totalHa ?? this.areas.totalHa,
      arableHa: patch.arableHa ?? this.areas.arableHa,
      vegetationHa: patch.vegetationHa ?? this.areas.vegetationHa,
    });
  }
}
