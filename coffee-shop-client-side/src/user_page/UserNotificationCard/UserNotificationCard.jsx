import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import UseAxiosSecure from '../../custom_hook/UseAxiosSecure/UseAxiosSecure';

const UserNotificationCard = ({ notification,reloadNotification,reloadUnreadUserNotification }) => {
    const axiosSecure = UseAxiosSecure();
    const words = notification.userNotificationDetails.split(' ');
    const shortNotification = words.length > 15 ? words.slice(0, 10).join(' ') + '...' : notification.userNotificationDetails;
    const handleSingleMessageMarkasRead = async() =>{
        const notificationStatus = 'read'
        const updateNotification = {notificationStatus}
        await axiosSecure.patch(`/userNotification/${notification._id}`,updateNotification);
    }
    const reload = ()=>{
        reloadNotification();
        reloadUnreadUserNotification();
    }
    return (
        <div onClick={reload} >
            <Link to={`/notificationDetails/${notification._id}`}>
                <div onClick={handleSingleMessageMarkasRead} className={notification.notificationStatus === 'unread' ? 'w-[800px] mx-auto font-raleway font-bold bg-[#ECEAE3] p-3 rounded-lg mb-4' : 'w-[800px] mx-auto font-raleway bg-[#ECEAE3] p-3 rounded-lg mb-4'}>
                    <div className='flex itms-center justify-between mb-1'>
                        <p>{notification.userNotificationTitle}</p>
                        <p>{`${notification.userNotificationDateTime}`}</p>
                    </div>
                    <div>
                        <p>{shortNotification}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default UserNotificationCard;


UserNotificationCard.propTypes = {
    notification: PropTypes.any,
    reloadNotification: PropTypes.any,
    reloadUnreadUserNotification: PropTypes.any,
};