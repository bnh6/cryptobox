export class Password {
  passwordManagerRef: string;
  passwordValue: string;

  constructor(passwordValue: string) {
    this.passwordValue = passwordValue;
  }
}

export enum PasswordState {
  Saved,
  NotSaved,
  UserProvided,
}
