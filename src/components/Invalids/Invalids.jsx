import Style from './invalids.module.css';

const Invalids = ({ isValid, invalids }) => {
    return isValid && Array.isArray(invalids) && invalids.length > 0
        ? null
        : (
            <div className={Style.invalidBox}>
                {
                    invalids.map((inv, i) => {
                        return <span key={`inv${i}`}>{inv}</span>
                    })
                }
            </div>
        )
}

export default Invalids;