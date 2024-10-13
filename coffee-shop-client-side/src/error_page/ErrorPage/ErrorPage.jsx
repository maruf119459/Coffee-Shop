import { Helmet } from "react-helmet";
import { useNavigate, useRouteError } from "react-router-dom";
import NavBar from "../../common_components/NavBar/NavBar";
import Footer from "../../common_components/Footer/Footer";
import errorImg from '../../assets/image/404/404.gif'
import { FaArrowLeft } from "react-icons/fa";
export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);
    const navigate = useNavigate();
    const goBack = () =>{
        navigate(-1)
    }
    return (
        <div className="bg-[#FFF]">
            <NavBar />
            <Helmet>
                <title>Espresso | Error</title>
            </Helmet>
            <div className="">
                <div className="flex flex-col items-center justify-center my-16">
                    <button onClick={goBack} className=" mt-12 flex items-center gap-x-2 text-[25px] rounded-xl pt-3 pb-2 px-2 font-rancho secondary-h1 text-shadow-lg bg-[#D2B48C]"> <FaArrowLeft /> Go Back</button>
                    <img src={errorImg} alt="" />
                </div>
            </div>
            <Footer />
        </div>
    );
}
