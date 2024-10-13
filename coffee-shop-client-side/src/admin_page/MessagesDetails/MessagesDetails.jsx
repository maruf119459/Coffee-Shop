import { Helmet } from "react-helmet";
import './style.css'
import { useLoaderData } from "react-router-dom";
import { useEffect } from "react";
import UseAxiosSecure from "../../custom_hook/UseAxiosSecure/UseAxiosSecure";
const MessagesDetails = () => {
    // const [messagess] = useLoaderData();
    const message = useLoaderData();
    const axiosSecure = UseAxiosSecure();
    console.log(message)

    useEffect(() => {
        const update = () => {
            const status = 'read'
            const updateMessage = { status }
            const response = axiosSecure.patch(`/message/${message._id}`, updateMessage);
            console.log(response.data)

        }
        update();
    }, [axiosSecure, message._id])




    // const message = { id: '670183073yu1334', status: 'unread', uers_img: 'https://t4.ftcdn.net/jpg/03/26/98/51/360_F_326985142_1aaKcEjMQW6ULp6oI9MYuv8lN9f8sFmj.jpg', user_name: 'Ali', user_email: 'ali56@gmail.com', message: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deserunt consequatur perferendis sed reprehenderit et rem, vitae totam laudantium, quibusdam ex velit officiis. Quod alias error voluptatum nobis reiciendis! Mollitia, alias?' }

    return (
        <div className=" mt-16 ms-24">
            <Helmet>
                <title>{`Espresso Emporium | Messages Details`}</title>
            </Helmet>
            <div className="flex flex-col justify-center items-center message-bg h-[800px]">
                <div className="w-[800px] border-solid border-2 border-[#331A15] ps-2 py-3">
                    <p className="font-bold">From: <span className="font-normal	">{message?.email}</span></p>
                </div>
                <div className="w-[800px] border-solid border-x-2 border-[#331A15] ps-2 py-3">
                    <p className="font-bold">Name: <span className="font-normal	">{message?.name}</span></p>
                </div>
                <div className="w-[800px] border-solid border-2 border-[#331A15] ps-2 py-3">
                    <p className="font-bold">Message: <span className="font-normal	">{message?.messageBody}</span></p>
                </div>
            </div>
        </div>
    );

};

export default MessagesDetails;