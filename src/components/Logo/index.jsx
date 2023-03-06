import React from 'react'
import firechatLogo from '../../assets/firechat_512.svg'
import Style from './logo.module.css';

const Logo = ({style}) => {
  return (
    <div>
        <img src={firechatLogo} className={Style.logo} alt="Firechat logo" style={style || {}}/>
    </div>
  )
}

export default React.memo(Logo);