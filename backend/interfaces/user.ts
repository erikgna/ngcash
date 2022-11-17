export interface IUser {
  username: string;
  password: string;
}

export interface IRegisterUser extends IUser {
  confirmPassword: string;
}

export interface IUserDB extends IUser {
  id: number;
  accountid: number;
}
