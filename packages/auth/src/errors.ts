export class VerificationError extends Error {
  constructor(public reason: string) {
    super(reason);
  }
}
