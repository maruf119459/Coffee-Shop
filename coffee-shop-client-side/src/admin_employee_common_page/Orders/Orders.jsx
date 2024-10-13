import { Helmet } from "react-helmet";
import SingleOrderCard from "../SingleOrderCard/SingleOrderCard";
import { RiCheckboxBlankFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import UseAxiosSecure from "../../custom_hook/UseAxiosSecure/UseAxiosSecure";

const Orders = () => {
    const axiosSecure = UseAxiosSecure();
    const [orders, setOrders] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [receivingCount, setReceivingCount] = useState(0);
    const [shippingCount, setShippingCount] = useState(0);
    const [deliveredCount, setDeliveredCount] = useState(0);
    const [prevNextBtnStatus, setPrevNextBtnStatus] = useState(false);
    const [currentPage, setCurrentPage] = useState(() => {
        const hash = window.location.hash.replace('#', '');
        const page = parseInt(hash, 10);
        return page && !isNaN(page) && page > 0 ? page : 1;
    });
    const [limit] = useState(5); // Items per page
    const [pages, setPages] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosSecure.get('/orders', {
                    params: { page: currentPage, limit }
                });
                setOrders(response.data.orders);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const date = `${day}-${month}-${year}`;

        const fetchCounts = async () => {
            try {
                const pendingResponse = await axiosSecure.get(`/orders/count/pending`);
                setPendingCount(pendingResponse.data.count);

                const receivingResponse = await axiosSecure.get(`/orders/count/receiving/${date}`);
                setReceivingCount(receivingResponse.data.count);

                const shippingResponse = await axiosSecure.get(`/orders/count/shipped/${date}`);
                setShippingCount(shippingResponse.data.count);

                const deliveredResponse = await axiosSecure.get(`/orders/count/delivered/${date}`);
                setDeliveredCount(deliveredResponse.data.count);
            } catch (error) {
                console.error('Error fetching counts:', error);
            }
        };

        fetchOrders();
        fetchCounts();
    }, [axiosSecure, currentPage, limit]);

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

    const getCurrentDate = () => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = today.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
    };

    return (
        <div className="mt-28 ms-28 mb-12">
            <Helmet>
                <title>{`Espresso Emporium | (${pendingCount}) Orders`}</title>
            </Helmet>
            <div>
                <h1 className="ms-20 pb-4 text-[30px] font-raleway secondary-h1 text-shadow-lg">Date: <span className="font-poppins">{getCurrentDate()}</span></h1>
            </div>
            <div>
                <h1 className="text-center pb-4 text-[45px] font-rancho secondary-h1 text-shadow-lg">Total Order Pending: {pendingCount} </h1>
            </div>
            <div className="flex items-center gap-x-2 justify-center text-[25px] font-poppins">
                <div className="flex items-center gap-x-2 border-e-2 border-orange-500 pe-3">
                    <RiCheckboxBlankFill className="text-red-500" />
                    <p>Pending : {pendingCount}</p>
                </div>
                <div className="divider divider-success"></div>

                <div className="flex items-center gap-x-2 border-e-2 border-orange-500 pe-3">
                    <RiCheckboxBlankFill className="text-yellow-400" />
                    <p>Today Receiving: {receivingCount}</p>
                </div>
                <div className="flex items-center gap-x-2 border-e-2 border-orange-500 pe-3">
                    <RiCheckboxBlankFill className="text-cyan-400" />
                    <p>Today Shipping: {shippingCount}</p>
                </div>
                <div className="flex items-center gap-x-2 ">
                    <RiCheckboxBlankFill className="text-green-600" />
                    <p>Today Delivered: {deliveredCount}</p>
                </div>
            </div>
            <div className="mx-[90px] mt-5">
                {orders.map(order => <SingleOrderCard key={order._id} order={order}></SingleOrderCard>)}
            </div>
            {orders.length !== 0 && (
                <div className="mb-20">
                    <div className="flex justify-center gap-x-2 mt-4">
                        {prevNextBtnStatus && (
                            <button onClick={handlePrevPage} className={currentPage === 1 ? "join-item btn btn-disabled" : "join-item btn"}>
                                Previous
                            </button>
                        )}
                        {pages.map(page => (
                            <button key={page} onClick={() => handlePageClick(page)} className={page === currentPage ? "join-item btn btn-active" : "join-item btn"}>
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
    );
};

export default Orders;
