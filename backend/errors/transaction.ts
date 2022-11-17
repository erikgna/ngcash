export class TransactionError extends Error {
  constructor(message: string, code: number) {
    super(message);
    this.name = code.toString();

    Object.setPrototypeOf(this, TransactionError.prototype);
  }
}
