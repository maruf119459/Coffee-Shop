import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import UseAxiosSecure from "../../custom_hook/UseAxiosSecure/UseAxiosSecure";

const SingleMessageCard = ({ message, refetch, unreadMessageNumberReload }) => {
    const axiosSecure = UseAxiosSecure();
    const truncateString = (email, maxLength) => {
        if (email.length > maxLength) {
            return email.substring(0, maxLength) + '...';
        }
        return email;
    };
    const markAsReadMessage = async () => {
        const status = 'read'
        const updateMessage = { status }
        await axiosSecure.patch(`/message/${message._id}`, updateMessage);
        refetch();
    }
    const reload = () => {
        markAsReadMessage();
        unreadMessageNumberReload();
    }
    refetch();
    return (
        <div onClick={reload}>
            <Link state={'/messages'} to={`/messagesDetails/${message._id}`}>
                <div className={message.status === 'unread' ? 'flex justify-around	items-center bg-red-300 my-3 p-2 font-poppins text-[#331A15] rounded-md font-semibold' : 'flex justify-around items-center bg-[#ECEAE3] my-3 p-2 font-poppins text-[#331A15] rounded-md'}>
                    <div className="">
                        {
                            message.imageUrl === '' ? <img src="https://i.ibb.co/7nW6YY8/avatar.png" alt="" className='w-[50px] h-[50px]  rounded-full' /> : <img src={message.imageUrl} alt="" className='w-[50px] h-[50px]  rounded-full' />
                        }
                    </div>
                    <div className="w-[400px]">
                        <p className='text-[20px] pt-2'>Name: {truncateString(message.name, 24)}</p>
                        <p className='text-[20px] pt-1'>Email: {truncateString(message.email, 24)}</p>
                    </div>
                    <div className="w-[500px]">
                        <p className='text-[20px] pt-2'>{truncateString(message.messageBody, 80)}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

SingleMessageCard.propTypes = {
    message: PropTypes.any.isRequired,
    refetch: PropTypes.any.isRequired,
    unreadMessageNumberReload: PropTypes.any.isRequired
};

export default SingleMessageCard;
