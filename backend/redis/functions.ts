import { createClient } from "redis";

export const saveToRedis = async (username: string, token: string) => {
  const client = process.env.REDIS
    ? createClient({ socket: { port: 6379, host: "redis" } })
    : createClient();
  await client.connect();

  await client.set(username, token, { EX: 86400 });
  await client.disconnect();
};

export const getOneRedis = async (username: string) => {
  const client = process.env.REDIS
    ? createClient({ socket: { port: 6379, host: "redis" } })
    : createClient();
  await client.connect();

  const result = await client.get(username);

  await client.disconnect();
  return result;
};

export const removeOneRedis = async (username: string) => {
  const client = process.env.REDIS
    ? createClient({ socket: { port: 6379, host: "redis" } })
    : createClient();
  await client.connect();

  const result = await client.del(username);

  await client.disconnect();
  return result;
};
