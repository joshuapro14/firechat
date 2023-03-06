import {Navigate, Route} from "react-router-dom"

const CustomRoute = ({children, condition, onFailNavigateTo, isReadyCheck, notReadyComponent}) => {
    if(typeof isReadyCheck === "function" && !isReadyCheck() && notReadyComponent){
        return notReadyComponent;
    }
    if(typeof condition !== "function" || !condition()){
        return <Navigate to={onFailNavigateTo || "/"}/>
        /* return (
            <Route {...rest} element={<Navigate to={navigateTo || "/"}/>} />
        ) */
    }
    return children;

}

export default CustomRoute;