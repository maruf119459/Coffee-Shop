import { Helmet } from "react-helmet";
import UserNotificationCard from "../UserNotificationCard/UserNotificationCard";
import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "../../custom_hook/UseAxiosSecure/UseAxiosSecure";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProviders/AuthProviders";
import { UtilitiesContext } from "../../providers/UtilitiesProviders/UtilitiesProviders";

const UserNotification = () => {
    const { unreadUserNotification, reloadUnreadUserNotification } = useContext(UtilitiesContext);
    const { user1 } = useContext(AuthContext);
    const axiosSecure = UseAxiosSecure();

    const [prevNextBtnStatus, setPrevNextBtnStatus] = useState(false);
    const [currentPage, setCurrentPage] = useState(() => {
        const hash = window.location.hash.replace('#', '');
        const page = parseInt(hash, 10);
        return page && !isNaN(page) && page > 0 ? page : 1;
    });
    const [limit] = useState(5); // Items per page
    const [pages, setPages] = useState([]);

    const { data: notificationData = { notifications: [], totalPages: 1 }, refetch: reloadNotification } = useQuery({
        queryKey: ['notification', user1?.email, currentPage],
        queryFn: async () => {
            const response = await axiosSecure.get(`/userNotification/${user1?.email}?page=${currentPage}&limit=${limit}`);
            return response.data;
        },
        refetchInterval: 10000,
    });

    useEffect(() => {
        reloadNotification();
        reloadUnreadUserNotification();
    }, [reloadNotification, reloadUnreadUserNotification]);

    const notifications = notificationData.notifications;
    const totalPages = notificationData.totalPages;

    useEffect(() => {
        window.location.hash = `#${currentPage}`;
    }, [currentPage]);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            const page = parseInt(hash, 10);
            if (page && !isNaN(page) && page > 0) {
                setCurrentPage(page);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    useEffect(() => {
        const pagesArray = [];
        if (totalPages <= 5) {
            pagesArray.push(...Array(totalPages).keys().map(i => i + 1));
            setPrevNextBtnStatus(false);
        } else {
            setPrevNextBtnStatus(true);
            if (currentPage <= 5) {
                pagesArray.push(1, 2, 3, 4, 5);
            } else if (currentPage > totalPages - 3) {
                pagesArray.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pagesArray.push(currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2);
            }
        }
        setPages(pagesArray);
    }, [currentPage, totalPages]);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="ms-28 mt-24 mb-12">
            <Helmet>
                <title>{`Espresso | Notification ${unreadUserNotification}`}</title>
            </Helmet>
            <h1 className="text-center pb-4 text-[45px] font-rancho secondary-h1 text-shadow-lg">Unread Notification : {unreadUserNotification}</h1>
            <div>
                {notifications.map(notification => (
                    <UserNotificationCard
                        key={notification._id}
                        notification={notification}
                        reloadNotification={reloadNotification}
                        reloadUnreadUserNotification={reloadUnreadUserNotification}
                    />
                ))}
            </div>
            <div>
                {notifications.length !== 0 && (
                    <div className="mb-20">
                        <div className="flex justify-center gap-x-2 mt-4">
                            {prevNextBtnStatus && (
                                <button onClick={handlePrevPage} className={currentPage === 1 ? "join-item btn btn-disabled" : "join-item btn"}>
                                    Previous
                                </button>
                            )}
                            {pages.map(page => (
                                <button
                                    key={page}
                                    onClick={() => handlePageClick(page)}
                                    className={page === currentPage ? "join-item btn btn-active" : "join-item btn"}
                                >
                                    {page}
                                </button>
                            ))}
                            {prevNextBtnStatus && (
                                <button onClick={handleNextPage} className={currentPage === totalPages ? "join-item btn btn-disabled" : "join-item btn"}>
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserNotification;
