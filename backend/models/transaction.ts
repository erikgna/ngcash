import { PrismaClient } from "@prisma/client";

import { ICreateTransaction } from "../interfaces/transaction";

const prisma = new PrismaClient();

const includeUsernames = {
  include: {
    accounts_accountsTotransactions_creditedaccountid: {
      select: { users: { select: { username: true } } },
    },
    accounts_accountsTotransactions_debitedaccountid: {
      select: { users: { select: { username: true } } },
    },
  },
};

export async function create(transaction: ICreateTransaction) {
  const data = await prisma.transactions.create({
    data: {
      creditedaccountid: transaction.creditId,
      debitedaccountid: transaction.id,
      value: transaction.amount,
    },
  });

  return data;
}

export async function getPagination(id: number, start: number, end: number) {
  const data = await prisma.transactions.findMany({
    where: { OR: [{ debitedaccountid: id }, { creditedaccountid: id }] },
    ...includeUsernames,
    orderBy: { createdat: "desc" },
    skip: start,
    take: end,
  });

  return data;
}

export async function getPaginationFilter(
  id: number,
  start: number,
  end: number,
  filter: string
) {
  let data = [];
  if (filter === "cashOut") {
    data = await prisma.transactions.findMany({
      where: { debitedaccountid: id },
      ...includeUsernames,
      orderBy: { createdat: "desc" },
      skip: start,
      take: end,
    });
  } else if (filter === "cashIn") {
    data = await prisma.transactions.findMany({
      where: { creditedaccountid: id },
      ...includeUsernames,
      orderBy: { createdat: "desc" },
      skip: start,
      take: end,
    });
  } else {
    data = await prisma.transactions.findMany({
      where: {
        OR: [{ debitedaccountid: id }, { creditedaccountid: id }],
        AND: [{ createdat: new Date(filter) }],
      },
      ...includeUsernames,
      orderBy: { createdat: "desc" },
      skip: start,
      take: end,
    });
  }

  return data;
}
