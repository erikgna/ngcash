import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getBalance(id: number): Promise<number> {
  const data = await prisma.accounts.findUnique({
    where: { id },
    select: {
      balance: true,
    },
  });

  if (!data) throw new Error("An error ocurred.");

  return data?.balance.toNumber();
}

export async function updateOne(id: number, amount: number) {
  await prisma.accounts.update({
    where: { id },
    data: { balance: { increment: amount } },
  });
}
