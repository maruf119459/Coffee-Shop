import { Outlet } from "react-router-dom";
import NavBar from "../../common_components/NavBar/NavBar";
import Footer from "../../common_components/Footer/Footer";
import useNetworkStatus from "../../custom_hook/useNetworkStatus/useNetworkStatus";

const Root = () => {
    useNetworkStatus();
    return (
        <div className="bg-[#FFF]">
            <NavBar/>
            <Outlet/>
            <Footer/>
        </div>
    );
};

export default Root;

