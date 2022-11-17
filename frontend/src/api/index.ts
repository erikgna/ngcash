import axios, { AxiosInstance } from "axios";

import { ICreateTransaction } from "../interface/transaction";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8030/api/v1",
});

export const APIToken = (route: string, token: string, accessToken?: string) =>
  api.get(route, {
    headers: { "refresh-token": token, Authorization: `Bearer ${accessToken}` },
  });

export const APIPostNoParams = (
  route: string,
  data:
    | ICreateTransaction
    | { username: string; password: string; confirmPassword?: string },
  token?: string
) =>
  api.post(
    `${route}`,
    data,
    token ? { headers: { Authorization: `Bearer ${token}` } } : {}
  );

export const APIGetOne = (route: string, param: number, token: string) =>
  api.get(`${route}/${param}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const APIGetAllPagination = (
  route: string,
  param: number,
  page: number,
  token: string
) =>
  api.get(`${route}/${param}/${page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const APIGetAllPaginationFilter = (
  route: string,
  param: number,
  page: number,
  filter: string,
  token: string
) =>
  api.get(`${route}/${param}/${page}/${filter}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
