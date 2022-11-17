import flexStyles from '../../global/styles/Flex.module.scss'
import buttonStyles from '../../global/styles/Buttons.module.scss'
import errorStyles from './Error.module.scss'

interface IError {
    message?: string;
}

export const Error = ({ message }: IError) => {
    return (
        <section className={`${flexStyles.FullCenter} ${errorStyles.Error}`}>
            <h1>{message ? message : 'Ops... Página não encontrada'}</h1>
            <button
                className={buttonStyles.Primary}
                onClick={() => window.location.reload()}
            >Tentar novamente</button>
        </section>
    )
}
