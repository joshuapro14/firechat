import Style from './leftbar.module.css';
import InfoBar from './InfoBar';
import SearchBar from './SearchBar';
import ChatsBar from './ChatsBar';

const LeftBar = () => {
  return (
    <div className={Style.bar}>
        <InfoBar />
        <div className={Style.scrollableBar}>
                <SearchBar />
                <ChatsBar />
        </div>        
    </div>
  )
}

export default LeftBar;
