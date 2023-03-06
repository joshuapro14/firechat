import Style from './home.module.css';

import LeftBar from "../../components/Home/LeftBar"
import RightBar from '../../components/Home/RightBar';
import { useIsShowSideBar } from '../../context/SideBarContext';

const HomeContainer = () => {
    const show = useIsShowSideBar();
    const sideBarClassName = () => {
        return show ? Style.showSideBar : Style.hideSideBar;
    }
  return (
    <div className={Style.container}>
      <div className={Style.chatContainer}>
          <div 
            className={`${Style.chatLeft} ${sideBarClassName()}`}>
            <LeftBar />
          </div>
          <div className={`${Style.chatRight} ${sideBarClassName()}`}>
            <RightBar />
          </div>

      </div>
    </div>
  )
}

export default HomeContainer