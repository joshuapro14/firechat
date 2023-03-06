import Style from './initial.module.css';
import Logo from '../../components/Logo';

const Initial = () => {
  return (
    <div className={Style.container}>
      <div className={Style.box}>
        <span className={Style.title}>
        <Logo /> Fire Chat
        </span>
        <span className={Style.info}>
            Fire Chat is Loading .... Please wait!
        </span>
      </div>
    </div>
  )
}

export default Initial