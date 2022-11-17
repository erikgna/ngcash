import modalStyles from './Modal.module.scss'

interface IModalProps {
    content: JSX.Element;
}

export const Modal = ({ content }: IModalProps) => {
    return (
        <section className={modalStyles.Modal}>
            <div className={modalStyles.Content}>
                {content}
            </div>
        </section>
    )
}
