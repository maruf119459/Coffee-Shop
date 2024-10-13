import { useNavigate, useParams } from 'react-router-dom';
import OrderRowProduct from '../OrderRowProduct/OrderRowProduct';
import { FaArrowLeft } from 'react-icons/fa6';
import './Style.css';
import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import UseAxiosPublic from '../../custom_hook/UseAxiosPublic/UseAxiosPublic';
import UseAxiosSecure from '../../custom_hook/UseAxiosSecure/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const OrderDetails = () => {
    const { id } = useParams();
    const axiosPublic = UseAxiosPublic();
    const axiosSecure = UseAxiosSecure();
    const [userData, setUserData] = useState({});
    const [showCancelMessage, setShowCancelMessage] = useState(false);
    const [showAcceptButton, setShowAcceptButton] = useState(false);

    const { data: order, refetch: reloadData } = useQuery({
        queryKey: ['order', id],
        queryFn: async () => {
            const response = await axiosSecure.get(`/order/${id}`);
            return response.data;
        }
    });

    const { data: deliveryMan=[], } = useQuery({
        queryKey: ['deliveryMan', id],
        queryFn: async () => {
            const employeeType = "Delivery Man"
            const response = await axiosSecure.get(`/deliveryMan/${employeeType}`);
            return response.data;
        }
    })

    useEffect(() => {
        const loadUserData = async () => {
            if (order?.email) {
                const userResponse = await axiosPublic.get('/userByEmail', { params: { email: order.email } });
                setUserData(userResponse.data);
            }
        };
        loadUserData();
    }, [axiosPublic, order]);

    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    const printOrderInfo = () => {
        const printContents = document.getElementById('printableArea').innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    const handleAcceptForm = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Waiting ...',
            text: 'Accept order.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        const makingTime = parseInt(e.target.makingTime.value);
        const deliveryTime = parseInt(e.target.deliveryTime.value);
        const receivingStatus = `To delivery estimate time: ${makingTime + deliveryTime} minutes. To make coffee ${makingTime} minutes and to delivery ${deliveryTime} minutes.`;

        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();

        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const receivingTime = `${day}-${month}-${year}; ${hours}:${minutes} ${ampm}`;


        const ToDeliveryTime = new Date(now.getTime() + (makingTime + deliveryTime) * 60000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        const updateData = { receivingStatus, receivingTime, orderStatus: 'receiving', requireTimeToDelivery: deliveryTime };
        const response = await axiosSecure.patch(`/order/${order._id}`, updateData);
        // title, details, date time
        const email = userData.email
        const userNotificationTitle = 'Order Accepted'
        const userNotificationDetails = `Dear sir, We accept you order. please waite around  ${makingTime + deliveryTime} minutes. Your estimate delivery time at ${ToDeliveryTime}`
        const userNotificationDateTime = `${hours}:${minutes} ${ampm} ${day}-${month}-${year}`
        const notificationStatus = 'unread'
        const userNotification = { email, userNotificationTitle, userNotificationDetails, userNotificationDateTime, notificationStatus, };
        const userSentNotificationRes = await axiosSecure.post('/userNotification', userNotification);
        if (response.data.message && userSentNotificationRes.data.message) {
            Swal.close()
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Order Accepted",
                showConfirmButton: false,
                timer: 1500
            });
        }
        else {
            Swal.close()
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Faild to accepted",
                showConfirmButton: false,
                timer: 1500
            });
        }
        console.log(response)
        reloadData();
    };

    const handleCancelForm = async (e) => {
        e.preventDefault();
        const cancelReason = e.target.cancelReason.value;
        // Further cancellation logic here

        Swal.fire({
            title: 'Waiting...',
            text: 'Cancle order',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        order?.buyProduct?.map(async (product) => {
            const getResponse = await axiosPublic.get(`/coffee/${product.coffeeId}`);
            const updateQuantity = parseInt(getResponse.data.availableQuantity + product.quantity)
            const updatedcoffee = { availableQuantity: updateQuantity }
            await axiosSecure.put(`/coffee/${product.coffeeId}`, updatedcoffee);
        })


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




        const updateData = { cancelReason, cancelledTime, orderStatus: 'cancelled' };
        const response = await axiosSecure.patch(`/order/${order._id}`, updateData);
        // title, details, date time
        const email = userData.email
        const userNotificationTitle = 'Order cancelled'
        const userNotificationDetails = cancelReason;
        const userNotificationDateTime = `${hours}:${minutes} ${ampm} ${day}-${month}-${year}`
        const notificationStatus = 'unread'
        const userNotification = { email, userNotificationTitle, userNotificationDetails, userNotificationDateTime, notificationStatus };
        const userSentNotificationRes = await axiosSecure.post('/userNotification', userNotification);
        if (response.data.message && userSentNotificationRes.data.message) {
            Swal.close()
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Order Accepted",
                showConfirmButton: false,
                timer: 1500
            });
        }
        else {
            Swal.close()
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Faild to accepted",
                showConfirmButton: false,
                timer: 1500
            });
        }
        console.log(response)
        reloadData();
    };


    const handleDeliveryMan = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Waiting ...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        const value = e.target.elements.deliveryManSelect.value;
        console.log(value)
        const idMatch = value.match(/\((\d+)\)$/);
        const id = idMatch ? idMatch[1] : null;
        console.log(id);
        if (value === 'Select Delivery Man') {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Please select a delivery man",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();

        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const employeeNotificationTitle = 'Order Delivery';
        const employeeNotificationDateTime = `${hours}:${minutes} ${ampm} ${day}-${month}-${year}`;
        const totalCost = order.totalPrice
        const employeeNotificationDetais = `Hi ${value}, I hope this message finds you well. I would like to request the delivery of a product to the following customer. You complet this delivery within ${order?.requireTimeToDelivery} minutes.`;
        const customerAddress = order.address;
        const customerName = order.name;
        const customerPhone = order.phone;
        const customerOrderId = order._id;
        const employeeId = parseInt(id);

        const employeeNotification = { employeeId, notificationStatus: 'unread', employeeNotificationTitle, employeeNotificationDateTime, employeeNotificationDetais, customerOrderId, customerName, customerPhone, totalCost, customerAddress, requireTimeToDelivery: order?.requireTimeToDelivery, customerEmail: userData.email, buyProduct: order.buyProduct }
        //employeeNotification post in employeeNotificationCollection 
        const employeeNotificationresponse = await axiosSecure.post('/employeeNotification', employeeNotification);
        console.log(employeeNotificationresponse)

        const requireTimeToDelivery= order?.requireTimeToDelivery * 2;
        const workStatus = 'inWork';
        const estimateDeliveryManFree = new Date(now.getTime() + (requireTimeToDelivery) * 60000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }); 
        const updateDeliveryMan = { workStatus,estimateDeliveryManFree }
        // updateDeliveryMan patch in employee collection by employeeId
        const updateDeliveryManRes = await axiosSecure.patch(`/employee/${employeeId}`, updateDeliveryMan);
        console.log(updateDeliveryManRes)


        const shippedTime = ` ${day}-${month}-${year}; ${hours}:${minutes} ${ampm}`
        const updateData = { shippedTime, orderStatus: 'shipped' };
        const UpdateOrderResponse = await axiosSecure.patch(`/order/${order._id}`, updateData);


        let additionalMessage = '';
        if (order?.paymentMethod === 'cod') {
            additionalMessage = `Your payment amount is ${order.totalPrice} BDT. `
        }
        const email = userData.email
        const userNotificationTitle = 'Order Delivery'
        const userNotificationDetails = `Dear sir, we are ready to delivery your coffee. We deliver you product within ${order?.requireTimeToDelivery} minutes.` + additionalMessage;
        const userNotificationDateTime = `${hours}:${minutes} ${ampm} ${day}-${month}-${year}`
        const notificationStatus = 'unread'
        const userNotification = { email, userNotificationTitle, userNotificationDetails, userNotificationDateTime, notificationStatus };
        const userSentNotificationRes = await axiosSecure.post('/userNotification', userNotification);

        if (employeeNotificationresponse.data.message && updateDeliveryManRes.data.message && UpdateOrderResponse.data.message && userSentNotificationRes.data.message) {
            Swal.close();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Delivery man selected",
                showConfirmButton: false,
                timer: 1500
            });
        }
        else {
            Swal.close();
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Faild to delivery man selected",
                showConfirmButton: false,
                timer: 1500
            });
        }
        reloadData();

    }

    return (
        <div className="mt-28 ms-28">
            <Helmet>
                <title>{`Espresso Emporium | Order Details`}</title>
            </Helmet>
            <div className="me-[950px]">
                <button onClick={goBack} className=" text-[25px] rounded-xl py-3 px-2 font-rancho secondary-h1 text-shadow-lg hover:bg-[#D2B48C] flex items-center gap-x-2 mb-6">
                    <FaArrowLeft />Go Back
                </button>
            </div>
            <div id='printableArea' className='mx-5'>
                <h1 className="text-center pb-4 text-[45px] font-rancho secondary-h1 text-shadow-lg">Order Info</h1>
                <p className="text-center text-[30px] pb-3">
                    <span className="font-semibold pe-2">Order Id:</span>
                    <span className="font-poppins">{order?._id}</span>
                </p>
                <div className='me-10'>
                    <div className="">
                        <table className="table border">
                            <thead>
                                <tr>
                                    <th>Checkbox</th>
                                    <th>Product Image</th>
                                    <th>Product Name</th>
                                    <th>Product ID</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order?.buyProduct?.map(product => (
                                    <OrderRowProduct key={product.coffeeId} product={product} />
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th className='bg-green-200'>Total:</th>
                                    <th className='bg-green-200'>
                                        {order?.buyProduct?.reduce((acc, product) => acc + product.coffeeSellPrice * product.quantity, 0)}
                                    </th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div>
                    <h1 className="text-center py-4 text-[45px] font-rancho secondary-h1 text-shadow-lg">Buyer Info</h1>
                    <div className="me-10">
                        <table className="table border">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Address</th>
                                    <th>Payment Type</th>
                                    <th>Order Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{userData?.name}</td>
                                    <td>{userData?.email}</td>
                                    <td>{userData?.phone}</td>
                                    <td>{userData?.address}</td>
                                    <td>{order?.paymentMethod}</td>
                                    <td>{order?.date};{order?.time}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className='flex justify-center'>
                <button onClick={printOrderInfo} className='btn btn-accent mt-4'>Print Info</button>
            </div>
            <div className='mb-20'>
                {order?.orderStatus === 'pending' ? (
                    <div className='flex justify-center flex-col items-center mt-8 '>
                        <div className='w-[600px] h-[320px] bg-red-200 rounded-md mb-4 '>
                            <div className=" overflow-x-auto h-[280px] m-4">
                                <table className="table table-pin-rows   font-raleway border-2">
                                    <thead className='border-t-4	'>
                                        <tr className='text-[18px] text-center'>
                                            <td className='border-2	'>Name</td>
                                            <td className='border-2	'>ID</td>
                                            <td className='border-2'>Work status</td>
                                            <td className='border-2'>Free at</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            deliveryMan?.map(man => <tr key={man._id} className='text-[18px] border-2'>
                                                <td className='text-[14px] border-2'>{man?.name}</td>
                                                <td className='text-[14px] border-2'>{man?.employee_id}</td>
                                                <td className='text-[14px] border-2'>{man?.workStatus}</td>
                                                <td className='text-[14px] border-2'>{man?.estimateDeliveryManFree}</td>
                                            </tr>)
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className='flex justify-center items-center bg-slate-200 rounded-md'>
                            <div className="flex w-full flex-col lg:flex-row p-16">
                                <div>
                                    <h1 className="text-center text-[45px] font-rancho secondary-h1 text-shadow-lg mt-6">Accept Order</h1>
                                    <button
                                        onClick={() => setShowAcceptButton(!showAcceptButton)}
                                        className={showCancelMessage ? "btn btn-success btn-disabled rounded-full text-[#FFF] mx-auto w-[250px] text-[18px] px-5 my-6" : "btn btn-success rounded-full text-[#FFF] mx-auto w-[250px] text-[18px] px-5 my-6"}
                                    >
                                        Accept Order
                                    </button>
                                    {showAcceptButton && (
                                        <form onSubmit={handleAcceptForm}>
                                            <input
                                                name="makingTime"
                                                placeholder='Making time in minutes'
                                                className='block mb-2 py-2 ps-[12px] w-full overflow-y-auto rounded-md'
                                                required
                                            />
                                            <input
                                                name="deliveryTime"
                                                placeholder='Delivery time in minutes'
                                                className='block mb-2 py-2 ps-[12px] w-full overflow-y-auto rounded-md'
                                                required
                                            />
                                            <button className="ms-48 btn btn-sm rounded-none px-3 py-2">Submit</button>
                                        </form>
                                    )}
                                </div>
                                <div className="divider divider-warning lg:divider-horizontal">OR</div>
                                <div>
                                    <h1 className="text-center text-[45px] font-rancho secondary-h1 text-shadow-lg mt-6">Cancel Order</h1>
                                    <button
                                        onClick={() => setShowCancelMessage(!showCancelMessage)}
                                        className={showAcceptButton ? "btn btn-warning btn-disabled rounded-full text-[#FFF] mx-auto w-[250px] text-[18px] px-5 my-6" : "btn btn-warning rounded-full text-[#FFF] mx-auto w-[250px] text-[18px] px-5 my-6"}
                                    >
                                        Cancel Order
                                    </button>
                                    {showCancelMessage && (
                                        <form onSubmit={handleCancelForm}>
                                            <textarea
                                                name="cancelReason"
                                                placeholder='Message'
                                                className='block mb-[18px] pt-[10px] h-[105px] ps-[12px] w-full overflow-y-auto rounded-md'
                                                required
                                            />
                                            <button className="ms-48 btn btn-sm rounded-full px-3 py-2">Submit</button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : order?.orderStatus === 'receiving' ? (
                    <div className='flex flex-col justify-center items-center order-bg h-[520px]'>
                        <div>
                            <h1 className="text-center text-[45px] font-rancho secondary-h1 text-shadow-lg">Set Delivery Time & Delivery Man</h1>
                            <div className='w-[400px]'>
                                <form onSubmit={handleDeliveryMan}>
                                    <span className="font-raleway">
                                        <p className="font-semibold pt-4 text-[20px] pb-2">Select Delivery Man</p>
                                        <select name="deliveryManSelect" className="w-full h-10 ps-3 rounded-md">
                                            <option disabled selected>Select Delivery Man</option>
                                            {
                                                deliveryMan.map(man => (
                                                    <option key={man._id} value={`${man.name} (${man.employee_id})`} disabled={man.workStatus === 'inWork'}>
                                                        {`${man.name} (${man.employee_id}) ${man.workStatus}`}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </span>
                                    <button className="btn btn-success mt-4 w-full">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default OrderDetails;
