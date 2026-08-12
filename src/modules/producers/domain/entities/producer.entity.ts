import { randomUUID } from 'crypto';

import { BusinessRuleViolation } from '../../../../shared/exceptions/domain.exception';
import {
  isValidDocument,
  stripDocument,
} from '../../../../shared/validation/document.validator';

export class Producer {
  private constructor(
    public readonly id: string,
    public readonly document: string,
    public readonly name: string,
  ) {}

  static create(input: { document: string; name: string; id?: string }): Producer {
    const document = stripDocument(input.document);
    if (!isValidDocument(document)) {
      throw new BusinessRuleViolation('Invalid CPF or CNPJ');
    }
    const name = input.name?.trim();
    if (!name) {
      throw new BusinessRuleViolation('Producer name is required');
    }
    return new Producer(input.id ?? randomUUID(), document, name);
  }

  static restore(props: { id: string; document: string; name: string }): Producer {
    return new Producer(props.id, props.document, props.name);
  }

  rename(name: string): Producer {
    const trimmed = name?.trim();
    if (!trimmed) {
      throw new BusinessRuleViolation('Producer name is required');
    }
    return new Producer(this.id, this.document, trimmed);
  }

  changeDocument(document: string): Producer {
    const digits = stripDocument(document);
    if (!isValidDocument(digits)) {
      throw new BusinessRuleViolation('Invalid CPF or CNPJ');
    }
    return new Producer(this.id, digits, this.name);
  }
}
