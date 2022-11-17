import { TransactionError } from "../errors/transaction";
import {
  ICreateTransaction,
  ITransaction,
  ITransactionUser,
} from "../interfaces/transaction";
import { getBalance, updateOne } from "../models/account";
import {
  create,
  getPagination,
  getPaginationFilter,
} from "../models/transaction";
import { getCreditId } from "../models/user";

export class TransactionController {
  public async create(data: ICreateTransaction) {
    if (!data) throw new TransactionError("Dados inválidos.", 400);

    const balance = await getBalance(data.id).catch(() => {
      throw new TransactionError("Não foi possível recuperar seu saldo.", 502);
    });

    const creditId = await getCreditId(data.creditUsername).catch(() => {
      throw new TransactionError("Não foi possível localizar o usuário.", 400);
    });

    if (!creditId)
      throw new TransactionError("Não foi possível localizar o usuário.", 400);

    if (creditId === data.id)
      throw new TransactionError(
        "Você não pode fazer uma transação para si mesmo.",
        400
      );

    if (balance < data.amount)
      throw new TransactionError("Você não tem saldo suficiente.", 400);

    await create({ ...data, creditId }).catch(() => {
      throw new TransactionError(
        "Não foi possível finalizar a transação.1",
        500
      );
    });

    await updateOne(data.id, -data.amount).catch(() => {
      throw new TransactionError(
        "Não foi possível finalizar a transação.2",
        500
      );
    });

    await updateOne(creditId, data.amount).catch(() => {
      throw new TransactionError(
        "Não foi possível finalizar a transação.3",
        500
      );
    });
  }

  public async getPagination(id: number, page: number) {
    if (page < 1) throw new TransactionError("Requisição inválida.", 400);
    const start = (page - 1) * 20;
    const end = page * 20 + 1;

    const items = await getPagination(id, start, end).catch(() => {
      throw new TransactionError(
        "Não foi possível recuperar suas transações.",
        502
      );
    });

    const transactions: ITransactionUser = {
      transactions: items as unknown as ITransaction[],
      page: items.length > 20 ? page + 1 : -1,
    };

    if (transactions.transactions.length > 20) {
      transactions.transactions.pop();
    }

    return transactions;
  }

  public async getPaginationFilter(id: number, page: number, filter: string) {
    if (page < 1) throw new TransactionError("Requisição inválida.", 400);
    const start = (page - 1) * 20;
    const end = page * 20 + 1;

    const items = await getPaginationFilter(id, start, end, filter).catch(
      () => {
        throw new TransactionError(
          "Não foi possível recuperar suas transações.",
          502
        );
      }
    );

    const transactions: ITransactionUser = {
      transactions: items as unknown as ITransaction[],
      page: items.length > 20 ? page + 1 : -1,
    };

    if (transactions.transactions.length > 20) {
      transactions.transactions.pop();
    }

    return transactions;
  }
}
