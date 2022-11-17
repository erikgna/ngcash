export interface ITransaction {
  id: number;
  debitedAccountId: number;
  creditedAccountId: number;
  value: number;
  createdAt: Date;
  accounts_accountsTotransactions_debitedaccountid: {
    users: { username: string }[];
  };
  accounts_accountsTotransactions_creditedaccountid: {
    users: { username: string }[];
  };
}

export interface ICreateTransaction {
  id: number;
  creditUsername: string;
  creditId?: number;
  amount: number;
}

export interface ITransactionUser {
  transactions: ITransaction[];
  page: number;
}
