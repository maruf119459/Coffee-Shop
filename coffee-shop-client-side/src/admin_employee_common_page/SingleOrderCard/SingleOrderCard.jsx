import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";

const YourOrdersCard = ({ order }) => {
    const [toDayDate, setToDayDate] = useState();
    useEffect(()=>{
        const findTodayDate = () =>{
            const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const date = `${day}-${month}-${year}`;
        setToDayDate(date)
        }
        findTodayDate();
    },[])
    return (
        <Link  to={`/orderDetails/${order._id}`}>
            {
                toDayDate === order.date ? <div className='flex justify-around bg-[#ECEAE3] my-3 p-2 font-poppins text-[#331A15] rounded-md'>
                <div>
                    <p className='font-semibold text-[20px] pt-4'>Date: {order.date}; Time: {order.time}</p>
                </div>
                <div>
                    <p className='font-semibold text-[20px] pt-4'>Order Id: {order._id}</p>
                </div> 
                <div className='col-span-2'>
                    <p className='font-semibold text-[20px] pt-4'>Total Price: {order.totalPrice}</p>
                </div>
                <div>
                    <p className={order.orderStatus === 'delivered' ? 'bg-green-600 font-semibold text-[20px] p-2 text-center rounded-full me-9 mt-2' : order.orderStatus === 'receiving' ? 'bg-yellow-400 font-semibold text-[20px] p-2 text-center rounded-full me-9 mt-2' : order.orderStatus === 'shipped' ? 'bg-cyan-400 font-semibold text-[20px] p-2 text-center rounded-full me-9 mt-2' : order.orderStatus === 'cancelled' ?'bg-gray-300 font-semibold text-[20px] p-2 text-center rounded-full me-9 mt-2':'bg-red-500 font-semibold text-[20px] p-2 text-center rounded-full me-9 mt-2'}>Status: {order.orderStatus}</p>
                </div>
            </div> : <div className='flex justify-around bg-red-300	 my-3 p-2 font-poppins text-[#331A15] rounded-md'>
                <div>
                    <p className='font-semibold text-[20px] pt-4'>Date: {order.date}; Time: {order.time}</p>
                </div>
                <div>
                    <p className='font-semibold text-[20px] pt-4'>Order Id: {order._id}</p>
                </div> 
                <div className='col-span-2'>
                    <p className='font-semibold text-[20px] pt-4'>Total Price: {order.totalPrice}</p>
                </div>
                <div>
                    <p className={order.orderStatus === 'delivered' ? 'bg-green-600 font-semibold text-[20px] p-2 text-center rounded-full me-9 mt-2' : order.orderStatus === 'receiving' ? 'bg-yellow-400 font-semibold text-[20px] p-2 text-center rounded-full me-9 mt-2' : order.orderStatus === 'shipped' ? 'bg-cyan-400 font-semibold text-[20px] p-2 text-center rounded-full me-9 mt-2' : order.orderStatus === 'cancelled' ?'bg-gray-300 font-semibold text-[20px] p-2 text-center rounded-full me-9 mt-2':'bg-red-500 font-semibold text-[20px] p-2 text-center rounded-full me-9 mt-2'}>Status: {order.orderStatus}</p>
                </div>
            </div>
            }
        </Link>
    );
};

YourOrdersCard.propTypes = {
    order: PropTypes.object.isRequired
};

export default YourOrdersCard;
