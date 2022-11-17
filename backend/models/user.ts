import { PrismaClient } from "@prisma/client";

import { IUser, IUserDB } from "../interfaces/user";

const prisma = new PrismaClient();

export async function getOne(user: IUser): Promise<IUserDB> {
  const data = await prisma.users.findUnique({
    where: { username: user.username },
  });

  return data as IUserDB;
}

export async function create(user: IUser) {
  const account = await prisma.accounts.create({
    data: {
      balance: 100,
    },
  });

  const data = await prisma.users.create({
    data: { ...user, accountid: account.id },
  });

  return "data";
}

export async function getCreditId(username: string): Promise<number> {
  const data = await prisma.users.findUnique({
    where: { username },
    select: {
      accountid: true,
    },
  });

  if (!data) throw new Error("An error ocurred.");

  return data?.accountid;
}
