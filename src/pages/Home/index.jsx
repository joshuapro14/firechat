// import {signOut} from "firebase/auth";
// import { useLoggedIn } from "../../context/AuthContext";
// import {auth} from '../../firebase';

// import Style from './home.module.css';

// import LeftBar from "../../components/Home/LeftBar"
// import RightBar from '../../components/Home/RightBar';
import { SideBarCtxProvider } from '../../context/SideBarContext';
import HomeContainer from './HomeContainer';

function Home() {
  // const {isLoggedIn: login} = useLoggedIn();
  return (
    <SideBarCtxProvider>
      <HomeContainer />
    </SideBarCtxProvider>
  )
}

export default Home