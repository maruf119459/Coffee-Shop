import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const YourOrdersCard = ({ order,handleCancelBtn }) => {
    return (
            <div className='flex justify-around bg-[#ECEAE3] my-3 p-2 font-poppins text-[#331A15] rounded-md'>
            <Link to={`/yourOrderDetails/${order._id}`}>
                    <p className='font-semibold text-[20px] pt-4'>Date: {order.date}; Time: {order.time}</p>
                </Link>
                <Link to={`/yourOrderDetails/${order._id}`}>
                <p className='font-semibold text-[20px] pt-4'>Order Id: {order._id}</p>
                </Link> 
                <Link to={`/yourOrderDetails/${order._id}`} className='col-span-2'>
                    <p className='font-semibold text-[20px] pt-4'>Total Price: {order.totalPrice}</p>
                </Link>
                <div className="flex items-center gap-x-1 ">
                    <p className={order.orderStatus === 'delivered' ? 'bg-green-600 font-semibold text-[20px] p-2 text-center rounded-full  mt-1 w-[270px]' : order.orderStatus === 'receiving' ? 'bg-yellow-400 font-semibold text-[20px] p-2 text-center rounded-full  mt-1 w-[270px]' : order.orderStatus === 'shipped' ? 'bg-cyan-400 font-semibold text-[20px] p-2 text-center rounded-full mt-1 w-[270px]' :  order.orderStatus === 'cancelled' ? 'bg-gray-300 font-semibold text-[20px] p-2 text-center rounded-full  mt-1 w-[270px]':'bg-red-500 font-semibold text-[20px] p-2 text-center rounded-full mt-1 '}>Status: {order.orderStatus}</p>
                   {
                    order.orderStatus === 'pending'? <button onClick={()=>handleCancelBtn(order)} className="bg-gray-300 font-semibold  p-2 text-center rounded-full  mt-1 w-[90px] hover:bg-gray-600">Cancle</button>:null
                   }
                </div>
            </div>
    );
};

YourOrdersCard.propTypes = {
    order: PropTypes.object.isRequired,
    handleCancelBtn: PropTypes.func.isRequired,
};

export default YourOrdersCard;
