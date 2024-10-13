import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import UseAxiosSecure from '../../custom_hook/UseAxiosSecure/UseAxiosSecure';

const EmployeeNotificationCard = ({ notification,reloadData,reloadUnreadEmployeeNotification }) => {
    const axiosSecure = UseAxiosSecure();
    const words = notification.employeeNotificationDetais.split(' ');
    const shortNotification = words.length > 15 ? words.slice(0, 10).join(' ') + '...' : notification.employeeNotificationDetais;
    //orderId:'6',customerName
   
    const handleSingleMessageMarkasRead = async() =>{
        const notificationStatus = 'read'
        const updateNotification = {notificationStatus}
        await axiosSecure.patch(`/employeeNotification/${notification._id}`,updateNotification);
        reloadData();
    }
    const reload = () =>{
        handleSingleMessageMarkasRead();
        reloadUnreadEmployeeNotification()
    }
    return (
        <div onClick={reload}>
            <Link to={`/employeeNotificationDetais/${notification._id}`}>
                <div className={notification.notificationStatus==='unread'?'w-[800px] mx-auto font-raleway font-bold bg-[#ECEAE3] p-3 rounded-lg mb-4':'w-[800px] mx-auto font-raleway bg-[#ECEAE3] p-3 rounded-lg mb-4'}>
                    <div className='flex itms-center justify-between mb-1'>
                        <p>{notification.employeeNotificationTitle}</p>
                        <p>{notification.employeeNotificationDateTime}</p>
                    </div>
                    
                    <div>
                        <p>{shortNotification}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default EmployeeNotificationCard;

EmployeeNotificationCard.propTypes = {
    notification: PropTypes.object,
    reloadData: PropTypes.func,
    reloadUnreadEmployeeNotification: PropTypes.func,
};