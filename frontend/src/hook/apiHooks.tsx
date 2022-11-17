import { useCookies } from "react-cookie";
import { decodeToken } from "react-jwt";
import { redirect } from "react-router";

import { APIGetOne, APIGetAllPagination, APIGetAllPaginationFilter, APIToken, APIPostNoParams } from "../api";
import { IDecodedToken } from "../interface/auth";
import { ICreateTransaction } from "../interface/transaction";

export function useAPIHook() {
    const [cookies, setCookie, removeCookie] = useCookies(['jwt-token', 'refresh-token'])

    const verifyToken = async () => {
        const decodedToken: IDecodedToken | null = decodeToken(cookies['jwt-token'])
        const nowTimestamp = parseInt((Date.now() / 1000).toString())
        if (decodedToken === null || nowTimestamp > decodedToken.exp) {
            const refreshToken = cookies['refresh-token']
            const { data, status } = await APIToken('/user/token', refreshToken)
            if (status !== 200) {
                removeCookie('jwt-token')
                redirect('/authorization')
                return;
            }
            setCookie('jwt-token', data, {
                secure: true,
                sameSite: true,
                httpOnly: false,
                path: '/',
                maxAge: 300
            })
        }
    }

    const APIHookPostNoParams = async (route: string, data: ICreateTransaction) => {
        await verifyToken()
        return await APIPostNoParams(route, data, cookies["jwt-token"])
    }

    const APIHookDeleteToken = async (route: string) => {
        await verifyToken()
        return await APIToken(route, cookies["refresh-token"], cookies["jwt-token"])
    }

    const APIHookGetOne = async (route: string, param: number) => {
        await verifyToken()
        return await APIGetOne(route, param, cookies["jwt-token"])
    }

    const APIHookGetAllPagination = async (route: string, param: number, page: number) => {
        await verifyToken()
        return await APIGetAllPagination(route, param, page, cookies["jwt-token"])
    }

    const APIHookGetAllPaginationFilter = async (route: string, param: number, page: number, filter: string) => {
        await verifyToken()
        return await APIGetAllPaginationFilter(route, param, page, filter, cookies["jwt-token"])
    }

    return { APIHookGetOne, APIHookGetAllPagination, APIHookGetAllPaginationFilter, APIHookDeleteToken, APIHookPostNoParams }
}