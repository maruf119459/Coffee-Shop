import { Helmet } from 'react-helmet';
import { useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import YourOrderRowProduct from '../YourOrderRowProduct/YourOrderRowProduct';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProviders/AuthProviders';
import UseAxiosSecure from '../../custom_hook/UseAxiosSecure/UseAxiosSecure';

const YourOrderDetails = () => {
    const { id } = useParams();
    const { user1 } = useContext(AuthContext);
    const axiosSecure = UseAxiosSecure();
    const [userData, setUserData] = useState({});
    const [statusValue, setStatusValue] = useState(0);

    // const { data: order, refetch:reloadRatingValue } = useQuery(['order', id], async () => {
    //     const response = await axiosSecure.get(`/order/${id}`);
    //     return response.data;
    // });

    const { data: order, refetch:reloadRatingValue } = useQuery({
        queryKey: ['order'],
        queryFn: async () => {
            const response = await axiosSecure.get(`/order/${id}`);
            return response.data;
        }
    });

    useEffect(() => {
        if (order?.orderStatus === 'pending') {
            setStatusValue(0);
        }
        if (order?.orderStatus === 'receiving') {
            setStatusValue(1);
        }
        if (order?.orderStatus === 'shipped') {
            setStatusValue(2);
        }
        if (order?.orderStatus === 'delivered') {
            setStatusValue(3);
        }
        const loadUserData = async () => {
            const userResponse = await axiosSecure.get('/userByEmail', { params: { email: user1?.email } });
            const user = userResponse.data;
            setUserData(user)
        }
        loadUserData();
    }, [order?.orderStatus, axiosSecure, user1?.email]);

    if (!order) {
        return <div>Loading...</div>;
    }

    return (
        <div className='ms-28 mt-28 mb-12'>
            <Helmet>
                <title>Espresso | Order Details</title>
            </Helmet>
            <p className="text-center text-[30px] pb-1"><span className="font-semibold pe-2">Order Id:</span>{order._id}<span className="font-poppins">{order.order_id}</span>;<br></br> <span className="font-semibold pe-2">Order Date:</span> {order.date}, <span className="font-semibold pe-2">Time:</span> {order.time}</p>
            {order?.orderStatus !== 'delivered'&&order?.orderStatus !== 'pending' &&<p className="text-center text-[30px] pb-5">{order?.receivingStatus?.split('.')[0]}.</p>}
            <div className='me-10'>
                <div className="">
                    <table className="table border">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>Porduct Image</th>
                                <th>Porduct Name</th>
                                <th>Product ID</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                {order.orderStatus === 'delivered' ? <th>Give Rating</th> : null}
                            </tr>
                        </thead>
                        <tbody>
                            {/* row 1 */}
                            {
                                order.buyProduct.map(product => (
                                    <YourOrderRowProduct 
                                        key={product.coffeeId} 
                                        product={product} 
                                        orderStatus={order.orderStatus} 
                                        orderId={order._id}
                                        reloadRatingValue={reloadRatingValue} 
                                    />
                                ))
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th className='bg-green-200'>Total : </th>
                                <th className='bg-green-200'>
                                    {order.buyProduct.reduce((acc, product) => acc + product.coffeeSellPrice * product.quantity, 0)}
                                </th>
                                <th></th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            <div className='flex flex-col justify-center items-center'>
                <h1 className="text-center my-7 text-[45px] font-rancho secondary-h1 text-shadow-lg">Customer information: </h1>
                <table className="table border w-[1000px]">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Customer Email</th>
                            <th>Phone Number</th>
                            <th>Delivery Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{userData?.name}</td>
                            <td>{userData?.email}</td>
                            <td>{userData?.phone}</td>
                            <td>{userData?.address}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <h1 className="text-center mt-8 pb-7 text-[45px] font-rancho secondary-h1 text-shadow-lg mb-5">Delivery Status </h1>
                <div className='bg-[#ECEAE3] py-8 px-16 w-[800px] mx-auto rounded-2xl'>
                    <ul className="timeline timeline-vertical">
                        {
                            statusValue >= 0 && (
                                <li>
                                    <div className="timeline-start timeline-box">Pending.<br></br> Date: {order.date}; Time: {order.time}</div>
                                    <div className="timeline-middle">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                    </div>
                                    <hr className="bg-primary" />
                                </li>
                            )
                        }
                        {
                            statusValue >= 1 && (
                                <li>
                                    <hr className="bg-primary" />
                                    <div className="timeline-middle">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                    </div>
                                    <div className="timeline-end timeline-box">Receiving.<br></br> Date: {order.receivingTime} <br></br>
                                    Receiving Status: {order.receivingStatus}
                                    </div>
                                    <hr className="bg-primary" />
                                </li>
                            )
                        }
                        {
                            statusValue >= 2 && (
                                <li>
                                    <hr className="bg-primary" />
                                    <div className="timeline-start timeline-box">Shipped.<br></br> Date: {order.shippedTime}</div>
                                    <div className="timeline-middle">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                    </div>
                                    <hr className="bg-primary" />
                                </li>
                            )
                        }
                        {
                            statusValue >= 3 && (
                                <li>
                                    <hr className="bg-primary" />
                                    <div className="timeline-middle">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                    </div>
                                    <div className="timeline-end timeline-box">Delivered.<br></br> Date: {order.deliveredTime}</div>
                                </li>
                            )
                        }
                    </ul>
                    {
                        order.orderStatus === 'cancelled' && (
                            <div>
                                <div className="timeline-end timeline-box -mt-[2px] w-[300px] mx-auto">Cancelled.<br></br>Date: {order.cancelledTime} <br></br>
                                Reason: {order.cancelReason}
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default YourOrderDetails;
