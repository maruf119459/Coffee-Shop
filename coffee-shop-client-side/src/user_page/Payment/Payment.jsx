import { useLocation, useNavigate } from 'react-router-dom';
import onlinePaymentMethod from '../../assets/image/sslc.png';
import codPaymentMethod from '../../assets/image/cod.png';
import { Helmet } from 'react-helmet';
import { useContext, useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { AuthContext } from '../../providers/AuthProviders/AuthProviders';
import image from '../../assets/image/nodata.png'
import { FaPenToSquare } from "react-icons/fa6";
import UseAxiosSecure from '../../custom_hook/UseAxiosSecure/UseAxiosSecure';
import Swal from 'sweetalert2';
import { UtilitiesContext } from '../../providers/UtilitiesProviders/UtilitiesProviders';
import YourPaymentRowProduct from '../YourPaymentRowProduct/YourPaymentRowProduct';
import UseAxiosPublic from '../../custom_hook/UseAxiosPublic/UseAxiosPublic';

const Payment = () => {
    const { user1 } = useContext(AuthContext);
    const { cartsLengthReload } = useContext(UtilitiesContext)

    const location = useLocation();
    const { pathName } = location.state || '';
    const { productId } = location.state || 0;
    const { quantity } = location.state || 0;
    const { selectedProducts } = location.state || [];
    const axiosSecure = UseAxiosSecure();
    const axiosPublic = UseAxiosPublic()
    const [paymentMethod, setPaymentMethod] = useState(0);
    const navigate = useNavigate();
    const [buyProduct, setBuyProduct] = useState([])
    const [userData, setUserData] = useState({});
    const [quantityError, setQuantityError] = useState(false)
    const [payAndConfrimBtnStatus, setPayAndConfrimBtnStatus] = useState(false);
    console.log('Pth name: ', pathName, '-> product Id', productId, '-> user email', user1?.email, '-> Sells price: ', buyProduct[0]?.sellsPrice)
    console.log(selectedProducts);


    useEffect(() => {
        const loadBuyProduct = async () => {
            const response = await axiosSecure.get(`/buyCoffees/${productId}`);
            setBuyProduct(response.data)
        };

        const loadBuyProductArray = async () => {
            const response = await axiosSecure.get(`/cart/selectedProducts/${user1?.email}`, {
                params: { productIds: selectedProducts }
            });
            console.log(response.data)
            setBuyProduct(response.data);
        }

        const loadUserData = async () => {
            const userResponse = await axiosSecure.get('/userByEmail', { params: { email: user1?.email } });
            const user = userResponse.data;
            if (user.address && user.phone) {
                setPayAndConfrimBtnStatus(true)
            }
            setUserData(user)
        }
        if (pathName === '/' || pathName === '/viewCoffeeList' || pathName === '/viewCoffeDetails' || pathName === '/loadDatabyCategory') {
            loadBuyProduct();
            loadUserData();
        }
        if (pathName === '/cart') {
            loadBuyProductArray()
            loadUserData();
        }
    }, [productId, axiosSecure, pathName, user1?.email, selectedProducts]);


    if (pathName === undefined) {
        return <div className="ms-28 mt-28">
            <div className="flex flex-col justify-center items-center mb-20">
                <img src={image} alt="" className="w-[800px]" />
                <h1 className="font-rancho text-[40px]">Sorry! Your No Order Data Found.</h1>
            </div>
        </div>
    }

    const goBack = () => {
        navigate(-1);
    };


    const navigateUpdateProfile = () => {
        navigate('/updateProfile');
    }
    console.log(buyProduct[0])

    const handlePayandOrderBtn = async (paymentMethod) => {
        Swal.fire({
            title: 'Waiting for payment...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        const email = user1.email;
        const name = userData?.name
        const phone = userData?.phone
        const address = userData?.address;
        let payMethod;
        if (paymentMethod === 1) {
            payMethod = 'sslc';
        }
        if (paymentMethod === 2) {
            payMethod = 'cod';
        }
        const now = new Date();
        console.log(now)
        // Format date as DD-MM-YYYY
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const date = `${day}-${month}-${year}`;

        // Format time in 12-hour format with AM/PM
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const time = `${hours}:${minutes} ${ampm}`;

        let totalPrice = 0;
        let path;

        if (pathName === '/' || pathName === '/viewCoffeeList' || pathName === '/viewCoffeDetails' || pathName === '/loadDatabyCategory') {
            totalPrice = buyProduct[0]?.sellsPrice * quantity;
            const coffeeId = buyProduct[0]?._id
            const response = await axiosPublic.get(`/coffee/${coffeeId}`);
            Swal.close();


            if (response.data.availableQuantity >= quantity) {
                const coffeeImageUrl = buyProduct[0]?.imageUrl
                const coffeeName = buyProduct[0]?.name
                const coffeeSellPrice = buyProduct[0]?.sellsPrice
                const customerEmail = user1.email

                const Product = [{ coffeeId, coffeeImageUrl, coffeeName, coffeeSellPrice, customerEmail, quantity }]
                const order = { paymentMethod: payMethod, orderStatus: 'pending', date, time, totalPrice, buyProduct: Product, email, name, phone, address };
                console.log('order details', order)
                try {
                    const orderResponse = await axiosSecure.post('/order', order);
                    console.log('Order posted successfully:', orderResponse.data);

                    if (orderResponse.data.insertedId) {
                        const availableQuantity = response.data.availableQuantity - quantity;

                        const updatedcoffee = { availableQuantity }
                        await axiosSecure.put(`/coffee/${coffeeId}`, updatedcoffee);







                        const now = new Date();
                        const day = String(now.getDate()).padStart(2, '0');
                        const month = String(now.getMonth() + 1).padStart(2, '0');
                        const year = now.getFullYear();

                        let hours = now.getHours();
                        const minutes = String(now.getMinutes()).padStart(2, '0');
                        const ampm = hours >= 12 ? 'PM' : 'AM';
                        hours = hours % 12;
                        hours = hours ? hours : 12;
                        let payMessage = ''
                        if(paymentMethod === 1){
                            payMessage += `You pay by online. Your total paid amount is ${totalPrice} BDT` 
                        }
    
                        if(paymentMethod === 2){
                            payMessage += `You want to pay cash on delivery. Your will paid total amount is ${totalPrice} BDT when you product rechive.` 
                        }
                        const userNotificationTitle = 'Order placed'
                        const userNotificationDetails = 'Dear sir, we get your order. We try to delivery you coffee as soon as possible. '+payMessage
                        const userNotificationDateTime = `${hours}:${minutes} ${ampm} ${day}-${month}-${year}`;
                        const notificationStatus = 'unread'
                        const userNotification = { email: user1.email, userNotificationTitle, userNotificationDetails, userNotificationDateTime, notificationStatus };
                        await axiosSecure.post('/userNotification', userNotification);







                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Your order has been placed.",
                            showConfirmButton: false,
                            timer: 3000
                        });
                        navigate('/yourOrders')
                    }

                } catch (error) {
                    console.error('Error posting order or deleting cart items:', error);
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Failed to place order! Try again.",
                        showConfirmButton: false,
                        timer: 3000
                    });
                }
            } else {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: `Avaiable quantity error`,
                    text: "You cross the avaiable quantity. Try again.",
                    showConfirmButton: true,
                });
            }
        }

        if (pathName === '/cart') {
            Swal.close();
            totalPrice = buyProduct.reduce((acc, product) => acc + product.coffeeSellPrice * product.quantity, 0);
            const order = { paymentMethod: payMethod, orderStatus: 'pending', date, time, totalPrice, buyProduct, email, name, phone, address, path };
            console.log('order details', order)
            //  product.coffeeId
            for (const product of buyProduct) {
                const response = await axiosPublic.get(`/coffee/${product.coffeeId}`);
                if (response.data.availableQuantity < product.quantity) {
                    setQuantityError(true);
                }
            }

            if (quantityError) {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: `Avaiable quantity error`,
                    text: "You cross the avaiable quantity. Try again.",
                    showConfirmButton: true,
                });
                return;
            }
            try {
                const orderResponse = await axiosSecure.post('/order', order);
                console.log('Order posted successfully:', orderResponse.data);

                if (orderResponse.data.insertedId) {
                    for (const product of buyProduct) {
                        const response = await axiosPublic.get(`/coffee/${product.coffeeId}`);
                        const availableQuantity = response.data.availableQuantity - product.quantity;
                        const updatedCoffee = { availableQuantity };
                        await axiosSecure.put(`/coffee/${product.coffeeId}`, updatedCoffee);
                    }

                    const productIdArray = buyProduct.map(product => product.coffeeId);
                    await axiosSecure.delete(`/cart/${user1.email}`, {
                        data: { productIds: productIdArray }
                    });
                    cartsLengthReload();








                    const now = new Date();
                    const day = String(now.getDate()).padStart(2, '0');
                    const month = String(now.getMonth() + 1).padStart(2, '0');
                    const year = now.getFullYear();

                    let hours = now.getHours();
                    const minutes = String(now.getMinutes()).padStart(2, '0');
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours ? hours : 12;
                    let payMessage = ''
                    if(paymentMethod === 1){
                        payMessage += `You pay by online. Your total paid amount is ${totalPrice} BDT` 
                    }

                    if(paymentMethod === 2){
                        payMessage += `You want to pay cash on delivery. Your will paid total amount is ${totalPrice} BDT when you product rechive.` 
                    }
                    const userNotificationTitle = 'Order placed'
                    const userNotificationDetails = 'Dear sir, we get your order. We try to delivery you coffee as soon as possible. '+payMessage;
                    const userNotificationDateTime = `${hours}:${minutes} ${ampm} ${day}-${month}-${year}`;
                    const notificationStatus = 'unread'
                    const userNotification = { email: user1.email, userNotificationTitle, userNotificationDetails, userNotificationDateTime, notificationStatus };
                    await axiosSecure.post('/userNotification', userNotification);






                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Your order has been placed.",
                        showConfirmButton: false,
                        timer: 3000
                    });
                    navigate('/yourOrders')
                }
            } catch (error) {
                console.error('Error posting order or deleting cart items:', error);
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Failed to place order! Try again.",
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        }



    };



    return (
        <div className='ms-28 mt-24 mb-12'>
            <Helmet>
                <title>Espresso | Check Out</title>
            </Helmet>
            <button onClick={goBack} className="mt-12 flex items-center gap-x-2 text-[25px] rounded-xl pt-3 pb-2 px-2 font-rancho secondary-h1 text-shadow-lg bg-[#D2B48C]">
                <FaArrowLeft /> Go Back
            </button>
            <h1 className="text-center pb-7 text-[45px] font-rancho secondary-h1 text-shadow-lg">Check Out Info</h1>
            <div className='me-10'>
                <div>
                    <table className="table border">
                        <thead>
                            <tr>
                                <th>Product Image</th>
                                <th>Product Name</th>
                                <th>Product ID</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buyProduct?.map(product => <YourPaymentRowProduct key={product._id} product={product} pathName={pathName} quantity={quantity} />)}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th className='bg-green-200'>Total :</th>
                                <th className='bg-green-200'>
                                    {
                                        (pathName === '/' || pathName === '/viewCoffeeList' || pathName === '/viewCoffeDetails' || pathName === '/loadDatabyCategory') ? <span>{buyProduct[0]?.sellsPrice * quantity}</span>
                                            : <span>
                                                {buyProduct.reduce((acc, product) => acc + product.coffeeSellPrice * product.quantity, 0)}
                                            </span>
                                    }
                                </th>
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
                            <th className='text-center'>Change Delivery Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        <td>{userData?.name}</td>
                        <td>{userData?.email}</td>
                        <td>{userData?.phone}</td>
                        <td>{userData?.address}</td>
                        <td className='text-center'><button onClick={navigateUpdateProfile}><FaPenToSquare ></FaPenToSquare></button></td>
                    </tbody>
                </table>
            </div>
            <div className='mt-12 w-[550px] h-auto mx-auto bg-[#ECEAE3] text-[20px] rounded-xl font-raleway'>
                <div className='mb-2 text-[#ECEAE3]'>.</div>
                <div className="divider divider-info">Select Payment Option</div>
                <div className='mb-1 text-[#ECEAE3]'>.</div>
                <form className='flex flex-col' onSubmit={(e) => { e.preventDefault(); handlePayandOrderBtn(paymentMethod); }}>
                    <div onClick={() => setPaymentMethod(1)}>
                        <span className='font-raleway mt-8'>
                            <div className={paymentMethod === 1 ? 'flex flex-col bg-green-400 w-[550px] pt-8 px-36 h-[150px]' : 'flex flex-col bg-[#ECEAE3] w-[550px] py-4 px-36 h-[150px]'}>
                                <p className="font-semibold text-[15px] pb-2 ps-1">Online Payment by</p>
                                <img src={onlinePaymentMethod} alt="Online Payment Method" className='w-[230px]' />
                            </div>
                        </span>
                    </div>
                    <div onClick={() => setPaymentMethod(2)}>
                        <span className='font-raleway mt-8'>
                            <div className={paymentMethod === 2 ? 'flex flex-col bg-green-400 w-[550px] pt-6 px-36 h-[150px]' : 'flex flex-col bg-[#ECEAE3] w-[550px] py-4 px-36 h-[150px]'}>
                                <p className="font-semibold text-[15px] ps-1">Cash on Delivery</p>
                                <img src={codPaymentMethod} alt="Cash on Delivery" className='w-[230px] h-[80px]' />
                            </div>
                        </span>
                    </div>
                    {
                        payAndConfrimBtnStatus ? <button type='submit' className={paymentMethod === 1 || paymentMethod === 2 ? "btn btn-success rounded-full text-[#FFF] mx-auto w-[250px] text-[18px] px-5 my-6" : "btn btn-disabled rounded-full text-[#FFF] mx-auto w-[250px] text-[18px] px-5 my-6"}>Pay & Confirm Order</button>
                            : <div className="tooltip tooltip-bottom" data-tip="Please update your profile and give your address and phone number">
                                <button disabled={true} className='btn btn-disabled rounded-full text-[#FFF] mx-auto w-[250px] text-[18px] px-5 my-6'>Pay & Confirm Order</button>
                            </div>
                    }

                </form>
            </div>
        </div>
    );
};

export default Payment;
