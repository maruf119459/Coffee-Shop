import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import NavBar from "../../common_components/NavBar/NavBar";
import Footer from "../../common_components/Footer/Footer";
import forbidden from '../../assets/image/404/forbidden.png'
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProviders/AuthProviders";
const ForbiddenAccessError = () => {
    const {user1} = useContext(AuthContext);
    const navigate = useNavigate();
    const goBack = () =>{
        navigate(-1)
    }
    const goHome = () =>{
        navigate('/')
    }
    const goLogin = () =>{
        navigate('/login')
    }
    const goRegistration = () =>{
        navigate('/registration')
    }
    return (
        <div className="bg-[#FFF]">
            <NavBar />
            <Helmet>
                <title>Espresso | Error</title>
            </Helmet>
            <div className="">
               {
                user1 ?  <div className="flex flex-col items-center justify-center my-36">
                <img src={forbidden} alt="" />
                <h1 className=" font-bold text-[20px] font-raleway mb-10">Forbidden Access. Please <span onClick={goBack} className="text-red-500 text-[20px] font-bold label-text-alt link link-hover">go back</span> or <span onClick={goHome} className="text-red-500 text-[20px] font-bold label-text-alt link link-hover">go home</span>.</h1>
            </div>:<div className="flex flex-col items-center justify-center my-36">
                <img src={forbidden} alt="" />
                <h1 className=" font-bold text-[20px] font-raleway mb-10">Forbidden Access. Please <span onClick={goLogin} className="text-red-500 text-[20px] font-bold label-text-alt link link-hover">login</span> or <span onClick={goRegistration} className="text-red-500 text-[20px] font-bold label-text-alt link link-hover">Registration</span>.</h1>
            </div>
               }
            </div>
            <Footer />
        </div>
    );
}
export default ForbiddenAccessError;

