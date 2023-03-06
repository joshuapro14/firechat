import Modal from ".";
import Style from './modal.module.css';

const Errors = ({ error }) => {
    if (error == null || `${error}`.trim() === "") return;
    let errors = Array.isArray(error) ? error : [error];
    return (
        <Modal title="Errors">
            <div className={Style.errorBox}>
                {
                    errors.map((inv, i) => {
                        return <span key={`error${i}`}>{inv}</span>
                    })
                }
            </div>
        </Modal>
    )
}

export default Errors;