import { useState, createContext } from 'react'
import { useNavigate } from 'react-router'
import { useCookies } from "react-cookie";

import { APIPostNoParams } from '../api'
import { AuthContextProps, IAuthContext } from '../interface/auth'
import { useAPIHook } from '../hook/apiHooks';
import { AxiosError } from 'axios';

export const AuthContext = createContext<IAuthContext>(null!)

export const AuthContextCmpnt = ({ children }: AuthContextProps) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const { APIHookDeleteToken } = useAPIHook()

    const [cookies, setCookie, removieCookie] = useCookies(['jwt-token', 'refresh-token'])
    const navigate = useNavigate()

    const signUp = async (
        username: string,
        password: string,
        confirmPassword: string
    ) => {
        setLoading(true)
        setError(null)
        try {
            const { data, status } = await APIPostNoParams("/user/register", { username, password, confirmPassword })

            if (status !== 200) {
                setError(data)
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data)
            } else
                setError("Um erro desconhecido ocorreu, tente novamente.")
            throw new Error()
        }
        setLoading(false)
    }

    const signIn = async (
        username: string,
        password: string
    ) => {
        setLoading(true)
        setError(null)
        try {
            const { data, status } = await APIPostNoParams("/user/login", { username, password })

            if (status !== 200) {
                setError(data)
            }

            //TODO: Make Safe
            setCookie('jwt-token', data['token'], {
                secure: true,
                sameSite: true,
                httpOnly: false,
                path: '/',
                maxAge: 300
            })

            setCookie('refresh-token', data['refreshToken'], {
                secure: true,
                sameSite: true,
                httpOnly: false,
                path: '/',
                expires: new Date(new Date().getDay() + 1),
                maxAge: 86400
            })

            navigate('/')
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data)
            } else
                setError("Um erro desconhecido ocorreu, tente novamente.")
        }
        setLoading(false)
    }

    const logout = async () => {
        setLoading(true)
        setError(null)
        try {
            await APIHookDeleteToken('/user/remove-token')

            removieCookie('jwt-token')
            removieCookie('refresh-token')

        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data)
            } else
                setError("Um erro desconhecido ocorreu, tente novamente.")
        }
        setLoading(false)
        navigate('/authentication')
    }

    const initState: IAuthContext = {
        signUp,
        signIn,
        logout,
        setError,
        loading,
        error
    }

    return (
        <AuthContext.Provider value={initState} >
            {children}
        </AuthContext.Provider>
    )
}