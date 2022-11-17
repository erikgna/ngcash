import flexStyles from '../../global/styles/Flex.module.scss'
import loadingStyles from './Loading.module.scss'

import loading from '../../assets/images/infinity_loading.svg'

export const Loading = () => {
    return (
        <section className={`${flexStyles.FullCenter} ${loadingStyles.Loading}`}>
            <img src={loading} alt="Loading" />
            <h1>Carregando...</h1>
        </section>
    )
}
