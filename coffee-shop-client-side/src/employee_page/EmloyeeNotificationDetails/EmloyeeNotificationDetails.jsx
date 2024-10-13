import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import UseAxiosSecure from "../../custom_hook/UseAxiosSecure/UseAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import UseAxiosPublic from "../../custom_hook/UseAxiosPublic/UseAxiosPublic";
import { useEffect } from "react";

const EmloyeeNotificationDetails = () => {
    const axiosSecure = UseAxiosSecure();
    const axiosPublic = UseAxiosPublic();
    const { id } = useParams();
    console.log(id);

    useEffect(() => {
        const upadate = async () => {
            const notificationStatus = 'read'
            const updateNotification = { notificationStatus }
            await axiosSecure.patch(`/employeeNotification/${id}`, updateNotification);
        }
        upadate();
    }, [axiosSecure, id])

    const { data: notification, isLoading, refetch: reloadData } = useQuery({
        queryKey: ['employeeNotificationDetails', id],
        queryFn: async () => {
            const response = await axiosSecure.get(`/employeeNotificationGetById/${id}`);
            return response.data;
        },
        enabled: !!id, // Only run query if id is set
    });
    if (isLoading) {
        return <p>loading...</p>
    }
    const handelSentOTPCode = async () => {
        Swal.fire({
            title: 'Waiting ...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        const otp = Math.floor(10000 + Math.random() * 90000);
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();

        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;

        const userNotificationTitle = 'OTP Code'
        const userNotificationDetails = `Your OTP Code is: ${otp}.`;
        const userNotificationDateTime = `${hours}:${minutes} ${ampm} ${day}-${month}-${year}`;
        const notificationStatus = 'unread'
        const userNotification = { email: notification.customerEmail, userNotificationTitle, userNotificationDetails, userNotificationDateTime, notificationStatus };
        const postRes = await axiosSecure.post('/userNotification', userNotification);
        const OTP_Code = otp;
        const updateNotification = { OTP_Code }
        const patchRes = await axiosSecure.patch(`/employeeNotification/${notification._id}`, updateNotification);
        if (postRes.data.message && patchRes.data.message) {
            Swal.close();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "OTP is sent.",
                showConfirmButton: false,
                timer: 1500
            });
        }
        else {
            Swal.close();
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Faild to OTP sent.",
                showConfirmButton: false,
                timer: 1500
            });
        }
        reloadData();
    };

    const handelSubmitOTPCode = async (e) => {
        e.preventDefault();
        reloadData();
        Swal.fire({
            title: 'Waiting ...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        const otp = e.target.otp.value;
        if (otp == notification.OTP_Code) {
            try {
                // Update sells amount for each product
                await Promise.all(notification.buyProduct.map(async (product) => {
                    const getResponse = await axiosPublic.get(`/coffee/${product.coffeeId}`);
                    const sellsAmount = getResponse.data.sellsAmount + product.quantity;
                    const categoryRes = await axiosPublic.get('/categoryBySells');
                    
                    // Find the correct category by product category
                    const category = categoryRes.data.find(cat => cat.name === getResponse.data.category);
                    if (category) {
                        const quantity = category.quantity + product.quantity;
                        await axiosSecure.patch(`/categoryBySells/${category._id}`, { quantity });
                    }
                
                    const updatedcoffee = { sellsAmount };
                    await axiosSecure.put(`/coffee/${product.coffeeId}`, updatedcoffee);
                }));
    
                const now = new Date();
                const day = String(now.getDate()).padStart(2, '0');
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const year = now.getFullYear();
                const date = `${year}-${month}-${day}`;
    
                const findResult = await axiosSecure.get(`/findDate/${date}`);
                if (findResult.data.message) {
                    await Promise.all(notification.buyProduct.map(async (product) => {
                        const getResponse = await axiosPublic.get(`/coffee/${product.coffeeId}`);
                        const basePrice = getResponse.data.basePrice;
                        const sellsPrice = getResponse.data.sellsPrice;
    
                        const sellsQuantityRes = await axiosPublic.get(`/sellsQuantity/${product.coffeeId}/${date}`);
                        const currentSellsQuantity = sellsQuantityRes.data.sellsQuantity || 0;
    
                        const newSellsQuantity = currentSellsQuantity + product.quantity;
                        const totalSells = newSellsQuantity * sellsPrice;
                        const totalRevenue = (newSellsQuantity * sellsPrice) - (newSellsQuantity * basePrice);
    
                        const coffee = {
                            coffeeId: product.coffeeId,
                            coffeeName: getResponse.data.name,
                            sellsQuantity: newSellsQuantity,
                            basePrice,
                            sellsPrice,
                            totalSells,
                            totalRevenue
                        };
    
                        if (currentSellsQuantity === 0) {
                            const postRes = await axiosPublic.post('sellsCoffees', { date, coffee });
                            console.log(postRes);
                        } else {
                            const patchRes = await axiosPublic.patch('sellsCoffees', { date, coffee });
                            console.log(patchRes);
                        }
                    }));
                } else {
                    const sellsCoffees = await Promise.all(notification.buyProduct.map(async (product) => {
                        const getResponse = await axiosPublic.get(`/coffee/${product.coffeeId}`);
                        const basePrice = getResponse.data.basePrice;
                        const sellsPrice = getResponse.data.sellsPrice;
                        const totalSells = sellsPrice * product.quantity;
                        const totalRevenue = (sellsPrice * product.quantity) - (basePrice * product.quantity);
    
                        return {
                            coffeeId: product.coffeeId,
                            coffeeName: getResponse.data.name,
                            sellsQuantity: product.quantity,
                            basePrice,
                            sellsPrice,
                            totalSells,
                            totalRevenue
                        };
                    }));
    
                    const dailySells = { date, sellsCoffees };
                    const postResponse = await axiosPublic.post('/dailySells', dailySells);
                    console.log(postResponse);
                }
    
                let hours = now.getHours();
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12;
                const deliveredTime = `${day}-${month}-${year}; ${hours}:${minutes} ${ampm}`;
                const updateData = { deliveredTime, orderStatus: 'delivered' };
                const UpdateOrderResponse = await axiosSecure.patch(`/order/${notification.customerOrderId}`, updateData);
    
                const requireTimeToDelivery = parseInt(notification.requireTimeToDelivery);
                const deliveryManFreeTime = new Date(now.getTime() + requireTimeToDelivery * 60000).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });
                const workStatus = `Free at ${deliveryManFreeTime}`;
                const estimateDeliveryManFree = '';
                const updateDeliveryMan = { workStatus, estimateDeliveryManFree };
                const updateDeliveryManRes = await axiosSecure.patch(`/employee/${notification.employeeId}`, updateDeliveryMan);
    
                if (UpdateOrderResponse.data.message && updateDeliveryManRes.data.message) {
                    const deliveryStatus = 'deliveryCompleted';
                    const updateNotification = { deliveryStatus };
                    await axiosSecure.patch(`/employeeNotification/${id}`, updateNotification);
                    reloadData();
    
                    const email = notification.customerEmail;
                    const userNotificationTitle = 'Delivery Completed';
                    const userNotificationDetails = `Dear sir, Your delivery has been completed. Enjoy the coffee and also give us feedback. We are waiting for your valuable feedback.`;
                    const userNotificationDateTime = `${hours}:${minutes} ${ampm} ${day}-${month}-${year}`;
                    const notificationStatus = 'unread';
                    const userNotification = { email, userNotificationTitle, userNotificationDetails, userNotificationDateTime, notificationStatus };
                    await axiosSecure.post('/userNotification', userNotification);
    
                    Swal.close();
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Delivery Complete",
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    Swal.close();
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Failed to complete delivery. Try again.",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            } catch (error) {
                console.error(error);
                Swal.close();
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "An error occurred. Please try again.",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } else {
            Swal.close();
            Swal.fire({
                position: "center",
                icon: "error",
                title: "OTP does not match",
                showConfirmButton: false,
                timer: 1500
            });
        }
    };
    
    return (
        <div className="ms-28 mt-24 mb-12">
            <Helmet>
                <title>Espresso | Notification {notification.employeeNotificationTitle}</title>
            </Helmet>
            <div className="w-[1000px] mx-auto">
                <div className="divider divider-info">{notification.employeeNotificationDateTime}</div>

                {notification.employeeNotificationTitle === 'Order Delivery' ? (
                    <div className="w-[700px] mx-auto bg-[#ECEAE3] text-[20px] p-4 rounded-xl font-raleway">
                        <div>
                            <p className="font-semibold">{notification.employeeNotificationTitle}</p>
                            <p className="">{notification.employeeNotificationDetais}</p>
                        </div>
                        <div>
                            <div className="divider divider-info">Customer Info</div>
                            <p>Name: {notification.customerName}</p>
                            <p>Phone: {notification.customerPhone}</p>
                            <p>Total Cost: {notification.totalCost}</p>
                            <p>Order Id: {notification.customerOrderId}</p>
                            <p>Address: {notification.customerAddress}</p>
                            <div>
                                <p className="font-semibold text-[20px] pb-2">
                                    OTP Code: <span><button disabled={notification.deliveryStatus === 'deliveryCompleted'} onClick={handelSentOTPCode} className="btn btn-info">Send OTP</button></span>
                                </p>
                                <form onSubmit={handelSubmitOTPCode}>
                                    <span className="font-raleway">
                                        <input disabled={notification.deliveryStatus === 'deliveryCompleted'} type="text" name="otp" className="w-full h-10 ps-3 rounded-md" placeholder="Enter OTP Code" />
                                    </span>
                                    <input disabled={notification.deliveryStatus === 'deliveryCompleted'} type="submit" value="Submit" className="btn w-full bg-[#D2B48C] outline outline-black hover:bg-[#D2B48C] text-[20px] font-raleway secondary-h1 text-shadow-lg mt-4" />
                                </form>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-[700px] mx-auto bg-[#ECEAE3] text-[20px] p-4 rounded-xl font-raleway">
                        <p className="font-semibold">{notification.employeeNotificationTitle}</p>
                        <p>{notification.employeeNotificationDetais}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmloyeeNotificationDetails;
