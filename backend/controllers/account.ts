import { AccountError } from "../errors/account";
import { IAccount } from "../interfaces/account";
import { getBalance } from "../models/account";

export class AccountController {
  public async getOne(id: string): Promise<IAccount> {
    if (!id) throw new AccountError("Nenhum usuário encontrado.", 400);

    const data = await getBalance(parseInt(id)).catch(() => {
      throw new AccountError("Não foi possivel encontrar o seu saldo", 502);
    });

    if (!data)
      throw new AccountError("Não foi possivel recuperar seu saldo.", 404);

    return { balance: data };
  }
}
