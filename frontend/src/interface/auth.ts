import { ReactNode } from "react";

export type AuthContextProps = {
  children: ReactNode;
};

export interface IAuthContext {
  signUp: (
    username: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  error: string | null;
}

export interface IDecodedToken {
  id: number;
  username: string;
  account: number;
  iat: number;
  exp: number;
}
