import { Helmet } from "react-helmet";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProviders/AuthProviders";
import UseAxiosSecure from "../../custom_hook/UseAxiosSecure/UseAxiosSecure";
import YourOrdersCard from '../YourOrdersCard/YourOrdersCard';
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import UseAxiosPublic from "../../custom_hook/UseAxiosPublic/UseAxiosPublic";

const YourOrders = () => {
    const { user1 } = useContext(AuthContext);
    const axiosSecure = UseAxiosSecure();
    const axiosPublic = UseAxiosPublic();
    const [prevNextBtnStatus, setPrevNextBtnStatus] = useState(false);
    const [currentPage, setCurrentPage] = useState(() => {
        const hash = window.location.hash.replace('#', '');
        const page = parseInt(hash, 10);
        return page && !isNaN(page) && page > 0 ? page : 1;
    });
    const [limit] = useState(5); // Items per page
    const [totalPages, setTotalPages] = useState(1);
    const [pages, setPages] = useState([]);

    const { data: ordersData, isLoading, refetch } = useQuery({
        queryKey: ['orders', user1?.email, currentPage],
        queryFn: async () => {
            if (user1.email) {
                const response = await axiosSecure.get(`/orders/${user1.email}`, {
                    params: { page: currentPage, limit }
                });
                return response.data;
            }
            return { orders: [], totalPages: 1, currentPage: 1 };
        },
        keepPreviousData: true
    });

    useEffect(() => {
        if (ordersData) {
            setTotalPages(ordersData.totalPages);
        }
    }, [ordersData]);

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
            if (currentPage <= 3) {
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

    const handleCancelBtn = async (order) => {
        Swal.fire({
            title: 'Waiting...',
            text: 'Cancel order',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            // Update product quantities
            await Promise.all(order?.buyProduct?.map(async (product) => {
                const getResponse = await axiosPublic.get(`/coffee/${product.coffeeId}`);
                const updateQuantity = parseInt(getResponse.data.availableQuantity + product.quantity);
                const updatedcoffee = { availableQuantity: updateQuantity };
                await axiosSecure.put(`/coffee/${product.coffeeId}`, updatedcoffee);
            }));

            // Cancel order
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            const cancelledTime = `${day}-${month}-${year}; ${hours}:${minutes} ${ampm}`;
            const cancelReason = 'Dear sir, you cancelled your order. If there is any problem, please contact us by message. We will respond as soon as possible. Thank you sir. Please order again.';
            const updateData = { cancelReason, cancelledTime, orderStatus: 'cancelled' };
            const response = await axiosSecure.patch(`/order/${order._id}`, updateData);

            // Send notification
            const email = user1.email;
            const userNotificationTitle = 'Order cancelled';
            const userNotificationDetails = cancelReason;
            const userNotificationDateTime = `${hours}:${minutes} ${ampm} ${day}-${month}-${year}`;
            const notificationStatus = 'unread';
            const userNotification = { email, userNotificationTitle, userNotificationDetails, userNotificationDateTime, notificationStatus };
            const userSentNotificationRes = await axiosSecure.post('/userNotification', userNotification);

            if (response.data.message && userSentNotificationRes.data.message) {
                Swal.close();
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Order Cancelled",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                throw new Error('Failed to cancel order');
            }
            refetch();
        } catch (error) {
            Swal.close();
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Failed to cancel order",
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mt-28 ms-28 mb-12">
            <Helmet>
                <title>{`Espresso | Orders `}</title>
            </Helmet>
            <div>
                <h1 className="text-center mt-4 pb-7 text-[45px] font-rancho secondary-h1 text-shadow-lg">Your Orders</h1>
                <div>
                    {ordersData.orders.map(order => (
                        <YourOrdersCard key={order._id} order={order} handleCancelBtn={handleCancelBtn} />
                    ))}
                </div>
                <div>
                    {
                        ordersData.orders.length !== 0 && <div className="mb-20">
                            <div className="flex justify-center gap-x-2 mt-4">
                                {
                                    prevNextBtnStatus && <button onClick={handlePrevPage} className={currentPage === 1 ? "join-item btn btn-disabled" : "join-item btn"}>Previous</button>
                                }
                                {pages.map(page => (
                                    <button key={page} onClick={() => handlePageClick(page)} className={page === currentPage ? "join-item btn btn-active" : "join-item btn"}>{page}</button>
                                ))}
                                {
                                    prevNextBtnStatus && <button onClick={handleNextPage} className={currentPage === totalPages ? "join-item btn btn-disabled" : "join-item btn"}>Next</button>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default YourOrders;
