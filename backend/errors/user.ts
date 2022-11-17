export class UserError extends Error {
  constructor(message: string, code: number) {
    super(message);
    this.name = code.toString();

    Object.setPrototypeOf(this, UserError.prototype);
  }
}
