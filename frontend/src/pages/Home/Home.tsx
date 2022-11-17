import { useQuery } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import { useCookies } from 'react-cookie'
import { decodeToken } from 'react-jwt'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { MdAttachMoney, MdMoneyOffCsred } from 'react-icons/md'
import { AxiosError } from 'axios'

import { Loading } from '../../components/Loading/Loading'
import { AuthContext } from '../../context/Auth'
import { useAPIHook } from '../../hook/apiHooks'
import { IDecodedToken } from '../../interface/auth'
import { ICreateTransaction, ITransactions } from '../../interface/transaction'
import { convertDatabaseDate } from '../../utils/DateFormatter'
import { Modal } from '../../components/Modal/Modal'
import { formatMoney } from '../../utils/MoneyFormatter'
import { Error } from '../Error/Error'
import { IDefaultErrorResponse } from '../../interface/apiResponse'

import emptySvg from '../../assets/images/empty.svg'

import buttonStyles from '../../global/styles/Buttons.module.scss'
import formStyles from '../../global/styles/Form.module.scss'
import homeStyles from './Home.module.scss'
import errorStyles from '../../global/styles/Error.module.scss'

interface IBalance {
    balance: number;
}

const decodeCookie = (token: string): number => {
    const decodedToken: IDecodedToken | null = decodeToken(token)
    return decodedToken?.id as number
}

const defaultValue: ICreateTransaction = {
    id: 0,
    creditUsername: '',
    amount: 0
}

export const Home = () => {
    const { logout } = useContext(AuthContext)
    const { APIHookGetOne, APIHookGetAllPagination, APIHookGetAllPaginationFilter, APIHookPostNoParams } = useAPIHook()

    const [cookies] = useCookies(['jwt-token'])

    const [page, setPage] = useState<number>(1)
    const [filter, setFilter] = useState<string>('')
    const [transfer, setTransfer] = useState<ICreateTransaction>({ ...defaultValue, id: decodeCookie(cookies['jwt-token']) })
    const [modal, setModal] = useState<boolean>(false)
    const [showBalance, setShowBalance] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const [transferSuccess, setTransferSuccess] = useState<boolean>(false)

    const sendTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setError('')

            const { status, data } = await APIHookPostNoParams('/transaction', transfer)
            setTransfer({ ...defaultValue, id: decodeCookie(cookies['jwt-token']) })

            if (status !== 200) {
                setError(data)
                return
            }

            setTransferSuccess(true)
            await accountQuery.refetch()
            await transactionQuery.refetch()
        } catch (error) {
            if (error instanceof AxiosError) {
                setError(error.response?.data)
            } else
                setError("Um erro desconhecido ocorreu, tente novamente.")

            setModal(false)
        }
    }

    const accountQuery = useQuery({
        queryKey: ['account'],
        refetchOnWindowFocus: false,
        queryFn: () => APIHookGetOne('/account', decodeCookie(cookies['jwt-token']))
    })
    const transactionQuery = useQuery({
        queryKey: ['transactions', filter, page],
        refetchOnWindowFocus: false,
        queryFn: () => filter === '' ? APIHookGetAllPagination('/transaction', decodeCookie(cookies['jwt-token']), page) :
            APIHookGetAllPaginationFilter('/transaction', decodeCookie(cookies['jwt-token']), page, filter)
    })

    if (accountQuery.isLoading || transactionQuery.isLoading) {
        return <Loading />
    }

    if (transactionQuery.isError)
        return <Error message={(transactionQuery.error as IDefaultErrorResponse).response.data} />

    if (accountQuery.isError)
        return <Error message={(accountQuery.error as IDefaultErrorResponse).response.data} />

    if (error !== '' && !modal)
        return <Error message={error} />


    const { balance }: IBalance = accountQuery.data?.data as IBalance

    return (
        <section className={homeStyles.Home}>
            {modal && <Modal content={
                <form className={`${formStyles.DefaultForm} ${homeStyles.AddBalance}`} onSubmit={(e) => sendTransfer(e)}>
                    <label htmlFor="creditUsername">Para quem deseja transferir?</label>
                    <input
                        type="text"
                        placeholder='Username'
                        name="creditUsername"
                        id="creditUsername"
                        value={transfer.creditUsername}
                        onChange={(e) => setTransfer({ ...transfer, creditUsername: e.target.value })}
                        required
                        pattern=".{3,}"
                        onInvalid={() => setError('Username inválido.')}
                    />
                    <label htmlFor="creditUsername">Valor a transferir</label>
                    <input
                        type="number"
                        placeholder='R$ 10,00'
                        name="amount"
                        id="amount"
                        value={transfer.amount === 0 ? '' : transfer.amount}
                        onChange={(e) => setTransfer({ ...transfer, amount: parseFloat(e.target.value) })}
                        required
                        onInvalid={() => setError('Valor está vazio.')}
                    />
                    {error !== '' && <p className={errorStyles.ErrorP}>{error}</p>}
                    {transferSuccess && <p className={homeStyles.Success}>Transferência concluida!</p>}
                    <div className={buttonStyles.Buttons}>
                        <button className={`${buttonStyles.Secondary} ${buttonStyles.BlackShadow} ${homeStyles.NoMargin}`} onClick={() => {
                            setError('')
                            setModal(false)
                        }}>{transferSuccess ? 'Fechar' : 'Cancelar'}</button>
                        {!transferSuccess && <button className={buttonStyles.Primary}>Confirmar</button>}
                    </div>
                </form>
            } />}
            <div className={homeStyles.Center}>
                <div>
                    <div className={homeStyles.Balance}>
                        <div onClick={() => setShowBalance(!showBalance)}>
                            {showBalance ?
                                <AiFillEyeInvisible /> :
                                <AiFillEye />
                            }
                        </div>
                        <h2>R${showBalance && formatMoney(balance)}</h2>
                    </div>
                    <button className={buttonStyles.Primary} onClick={() => {
                        setTransferSuccess(false)
                        setModal(true)
                    }}>Transferir</button>
                </div>

                <div className={homeStyles.Filters} onClick={() => console.log(transactionQuery.data.data)}>
                    <input type="date" onChange={(e) => setFilter(e.target.value)} value={filter} />
                    <select
                        name="type"
                        id="type"
                        onChange={(e) => setFilter(e.target.value)}
                        defaultValue={filter}
                    >
                        <option value="">Sem filtro</option>
                        <option value="cashIn">Cash-In</option>
                        <option value="cashOut">Cash-Out</option>
                    </select>
                </div>

                {transactionQuery.data.data.transactions.length === 0 ?
                    <div className={homeStyles.EmptyTransactions}>
                        <img src={emptySvg} alt="No transactions" />
                        <h2>Não há transações.</h2>
                    </div> :
                    <div className={homeStyles.Transactions}>
                        {(transactionQuery.data?.data as ITransactions).transactions.map((transaction) => {
                            if (transaction.debitedaccountid === decodeCookie(cookies['jwt-token'])) {
                                return <div key={transaction.id} className={homeStyles.Transaction}>
                                    <div className={homeStyles.Icon} style={{ background: 'rgb(223, 54, 54)' }}>
                                        <MdMoneyOffCsred />
                                    </div>
                                    <div>
                                        <strong>Transferência enviada</strong>
                                        <p>{transaction.accounts_accountsTotransactions_creditedaccountid.users[0].username}</p>
                                        <p>R${formatMoney(transaction.value)}</p>
                                    </div>
                                    <p>{convertDatabaseDate(transaction.createdat)}</p>
                                </div>
                            } else if (transaction.creditedaccountid === decodeCookie(cookies['jwt-token'])) {
                                return <div key={transaction.id} className={homeStyles.Transaction}>
                                    <div className={homeStyles.Icon} style={{ background: 'rgb(48, 173, 48)' }}>
                                        <MdAttachMoney />
                                    </div>
                                    <div>
                                        <strong>Transferência recebida</strong>
                                        <p>{transaction.accounts_accountsTotransactions_debitedaccountid.users[0].username}</p>
                                        <p>R${formatMoney(transaction.value)}</p>
                                    </div>
                                    <p>{convertDatabaseDate(transaction.createdat)}</p>
                                </div>
                            }
                        })}
                    </div>}

                {transactionQuery.data.data.transactions.length > 0 &&
                    <div className={`${buttonStyles.Buttons} ${homeStyles.FullWidth}`}>
                        <button className={`${buttonStyles.Secondary} ${buttonStyles.BlackShadow}`} onClick={() => { setPage(page - 1) }} disabled={page !== 1 ? false : true}>Anterior</button>
                        <button className={buttonStyles.Primary} onClick={() => setPage(page + 1)} disabled={transactionQuery.data?.data.page > 0 ? false : true}>Próxima</button>
                    </div>}

                <button className={buttonStyles.Primary} onClick={logout}>Sair da Conta</button>
            </div>
        </section>
    )
}
