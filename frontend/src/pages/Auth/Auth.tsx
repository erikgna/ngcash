import React, { useState, useContext } from 'react'

import { AuthContext } from '../../context/Auth'

import buttonStyles from '../../global/styles/Buttons.module.scss'
import errorStyles from '../../global/styles/Error.module.scss'
import formStyles from '../../global/styles/Form.module.scss'
import flexStyles from '../../global/styles/Flex.module.scss'
import authStyles from './Auth.module.scss'

interface IAuthForm {
    username: string;
    password: string;
    confirmPassword?: string;
}

const initialValue = { username: '', password: '' }

export const Auth = () => {
    const { signIn, signUp, setError, error } = useContext(AuthContext)

    const [login, setLogin] = useState<boolean>(true)
    const [form, setForm] = useState<IAuthForm>(initialValue)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setError('')

        if (login) signIn(form.username, form.password)
        else {
            signUp(form.username, form.password, form.confirmPassword as string).then(() => setLogin(true))
        }
    }

    return (
        <section className={`${flexStyles.FlexAlignCenter} ${authStyles.FullHeight}`}>
            <p className={authStyles.GreyText}>{login ? 'Entrar na conta' : 'Criar conta'}</p>
            <form onSubmit={(e) => handleSubmit(e)} className={formStyles.DefaultForm}>
                <h5>{login ? 'Use seu username para entrar na sua conta :)' : 'Para começar, informe o seu melhor username :)'}</h5>
                <label htmlFor="username">Username</label>
                <input
                    className={authStyles.FullWidth}
                    type="text"
                    name='username'
                    placeholder='Seu username'
                    onChange={(e) => handleChange(e)} value={form.username}
                    required
                    pattern=".{3,}"
                    onInvalid={() => setError(login ? 'Credenciais inválidas.' : 'Username deve conter 3 caracteres.')}
                />

                <label htmlFor="password">Senha</label>
                <input
                    className={authStyles.FullWidth}
                    type="password"
                    name='password'
                    placeholder='Sua senha'
                    onChange={(e) => handleChange(e)} value={form.password}
                    required
                    pattern=".{8,}"
                    onInvalid={() => setError(login ? 'Credenciais inválidas.' : 'Senha deve conter 8 caracteres, ao menos 1 maiúsculo e um número.')}
                />

                {!login && <label htmlFor="confirmPassword">Confirmar senha</label>}
                {!login && <input
                    className={authStyles.FullWidth}
                    type="password"
                    name='confirmPassword'
                    placeholder='Confirme sua senha'
                    onChange={(e) => handleChange(e)} value={form.confirmPassword}
                    required
                    pattern=".{8,}"
                    onInvalid={() => setError(form.confirmPassword === form.password ? 'Senha deve conter 8 caracteres, ao menos 1 maiúsculo e um número.' : 'Confirmar senha deve ser igual à senha.')}
                />}

                {error !== '' && <p className={errorStyles.ErrorP}>{error}</p>}

                <p>{login ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'} <strong onClick={() => {
                    setError('')
                    setLogin(!login)
                }}>Acesse aqui!</strong></p>

                <button className={`${authStyles.FullWidth} ${buttonStyles.Primary} ${authStyles.Button}`}>{login ? 'Login' : 'Criar conta'}</button>
            </form>
        </section>
    )
}
