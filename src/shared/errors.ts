export function BusinessLogicException(message: string, type: number) {
  this.message = message;
  this.type = type;
}

export enum BusinessError {
  NOT_FOUND,
  PRECONDITION_FAILED,
  BAD_REQUEST,
}

export enum ExceptionMessages {
  AIRLINE_NOT_FOUND = 'The Airline with the given id was not found',
  AIRLINE_DATE_IS_NOT_VALID = 'The Establishment Date is greater that current',
  AIRPORT_NOT_FOUND = 'The Airport with the given id was not found',
  AIRPORT_CODE_IS_NOT_VALID = 'The given code is not valid',
  AIRPORT_IS_NOT_ASSOCIATED = 'The Airport with the given id is not associated to the Airline',
}
