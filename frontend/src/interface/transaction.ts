export interface ITransactions {
  transactions: ITransaction[];
  page: number;
}

interface ITransaction {
  createdat: Date;
  id: number;
  debitedaccountid: number;
  creditedaccountid: number;
  value: number;
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
