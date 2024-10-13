import { Helmet } from "react-helmet";
import { useLoaderData } from "react-router-dom";
import PropTypes from 'prop-types';
import { useEffect } from "react";
import UseAxiosSecure from "../../custom_hook/UseAxiosSecure/UseAxiosSecure";

const UserNotificationDetails = () => {
    const notification = useLoaderData();
    const axiosSecure = UseAxiosSecure();
    console.log(notification);

    useEffect(() => {
        const upadate = async() => {
            const notificationStatus = 'read'
            const updateNotification = { notificationStatus }
            await axiosSecure.patch(`/userNotification/${notification._id}`,updateNotification);
        }
        upadate();
    }, [axiosSecure, notification._id])
    if (!notification) {
        return <div>Loading...</div>;
    }

    return (
        <div className="ms-28 mt-24 mb-12">
            <Helmet>
                <title>{`Espresso | Notification ${notification.userNotificationTitle}`}</title>
            </Helmet>
            <div className="w-[1000px] mx-auto">
                <div className="divider divider-info">{notification.userNotificationDateTime}</div>
                <div className="w-[700px] mx-auto bg-[#ECEAE3] text-[20px] p-4 rounded-xl font-raleway">
                    <p className="font-semibold">{notification.userNotificationTitle}</p>
                    <p>{notification.userNotificationDetails}</p>
                </div>
            </div>
        </div>
    );
};

UserNotificationDetails.propTypes = {
    notification: PropTypes.shape({
        userNotificationTitle: PropTypes.string.isRequired,
        userNotificationDetails: PropTypes.string.isRequired,
        userNotificationDateTime: PropTypes.string.isRequired,
    })
};

export default UserNotificationDetails;
