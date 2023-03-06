import Modal from ".";

const Loading = ({ isLoading, loadingMessage }) => {
    if (!isLoading || loadingMessage == null || `${loadingMessage}`.trim() === "") return;
    return (
        <Modal title="Loading Status">
            {loadingMessage}
        </Modal>
    )
}

export default Loading