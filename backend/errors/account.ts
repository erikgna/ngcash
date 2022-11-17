export class AccountError extends Error {
  constructor(message: string, code: number) {
    super(message);
    this.name = code.toString();

    Object.setPrototypeOf(this, AccountError.prototype);
  }
}
