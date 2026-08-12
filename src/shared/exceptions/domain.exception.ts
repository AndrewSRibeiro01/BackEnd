export abstract class DomainException extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class BusinessRuleViolation extends DomainException {
  readonly code = 'BUSINESS_RULE_VIOLATION';
  readonly statusCode = 422;
}

export class EntityNotFound extends DomainException {
  readonly code = 'ENTITY_NOT_FOUND';
  readonly statusCode = 404;

  constructor(entity: string, identifier: string) {
    super(`${entity} not found: ${identifier}`);
  }
}

export class ConflictError extends DomainException {
  readonly code = 'CONFLICT';
  readonly statusCode = 409;
}
