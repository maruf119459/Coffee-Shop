import { Helmet } from "react-helmet";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import {  useContext, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";
import UseCategoryDataLoad from "../../custom_hook/UseCategoryDataLoad/UseCategoryDataLoad";
import useAdmin from "../../custom_hook/useAdmin/useAdmin";
import useEmployee from "../../custom_hook/useEmployee/useEmployee";
import UseAxiosSecure from "../../custom_hook/UseAxiosSecure/UseAxiosSecure";
import { AuthContext } from "../../providers/AuthProviders/AuthProviders";
import Swal from "sweetalert2";
import { UtilitiesContext } from "../../providers/UtilitiesProviders/UtilitiesProviders";
import useDeliveryMan from "../../custom_hook/useDeliveryMan/useDeliveryMan";

const ViewCoffeeDetails = () => {
    const {user1} = useContext(AuthContext)

    const {cartsLengthReload,setShowSearchForm} =useContext(UtilitiesContext)
    const [isDeliveryMan,] = useDeliveryMan();

    const [isadmin,] = useAdmin()
    const [isemployee,] = useEmployee();
    const coffee = useLoaderData();
    console.log(coffee);

    const [productQuantity, setProductQuantity] = useState(1);
    const location = useLocation();
    const employee = isadmin || isemployee;
    const axiosSecure = UseAxiosSecure();


    const navigate = useNavigate();
    const goBackHome = () => {
        navigate(-1);
    };

    const handleBuy =async (id) => {
        const quantity = productQuantity;
        const productId = id;
        const pathName = '/viewCoffeDetails'
        navigate('/payment', { state: { pathName,productId,quantity } });
    };

    const handleIncrement = () => {
        if(coffee.availableQuantity > productQuantity){
            setProductQuantity(productQuantity + 1);

        }
    };
    const handleDecrement = () => {
        if (productQuantity > 1) {
            setProductQuantity(productQuantity - 1);
        }
    };

    const handleAddToCart = async (id, name, imageUrl, price) => {
        const quantity = productQuantity;
        const customerEmail = user1.email;
        const coffeeId = id;
        const coffeeName = name;
        const coffeeImageUrl = imageUrl;
        const coffeeSellPrice = price;
        const cartProduct = { quantity, customerEmail, coffeeId, coffeeName, coffeeImageUrl, coffeeSellPrice };
        Swal.fire({
            title: 'Wating Product add to cart...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            const response = await axiosSecure.post('/cart', cartProduct);
            if (response.status === 200) {
                Swal.close()
                Swal.fire({
                    title: 'Success!',
                    text: 'Product added to cart',
                    icon: 'success'
                });
                cartsLengthReload()
            }
        } catch (error) {
            Swal.close()
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to add product to cart',
            });
        }
    };

    return (
        <div onClick={()=>setShowSearchForm(true)} className="ms-28 mt-28 mb-12">
            <Helmet>
                <title>Espresso Emporium | {coffee.name}</title>
            </Helmet>
            <div className="flex flex-col justify-center items-center mb-[120px]">
                <div className="me-[950px]">
                    <button onClick={goBackHome} className=" text-[25px] rounded-xl pt-3 pb-2 px-2 font-rancho secondary-h1 text-shadow-lg hover:bg-[#D2B48C] flex items-center gap-x-2 mb-16">
                        <FaArrowLeft /> {location.state === '/' ? 'Back to Home' : 'Go Back'}
                    </button>
                </div>
                <div className="bg-[#F4F3F0] w-[1100px] px-[112px] flex flex-col justify-center rounded-md py-16">
                    <p className="text-center pb-7 text-[45px] font-rancho secondary-h1 text-shadow-lg">{coffee.name}</p>
                    <div className="flex justify-center items-center justify-around">
                        <div>
                            <img src={coffee.imageUrl} alt="" className="w-full h-full" />
                        </div>
                        <div className="text-5 text-[#5C5B5B] font-raleway space-y-2.5">
                            <p><span className="font-semibold pe-2">Name:</span>{coffee.name}</p>
                            {!employee && <p><span className="font-semibold pe-2">Price:</span><span className="font-poppins">{coffee.sellsPrice}</span>tk</p>}
                            {employee && <p><span className="font-semibold pe-2">Sell Price:</span><span className="font-poppins">{coffee.sellsPrice}</span>tk</p>}
                            {employee && !isDeliveryMan && <p><span className="font-semibold pe-2">Base Price:</span> {coffee.basePrice}tk</p>}
                            <p><span className="font-semibold pe-2">Category:</span> {coffee.category}</p>
                            <p><span className="font-semibold pe-2">Taste:</span> {coffee.taste}</p>
                            <p><span className='font-semibold pe-2 pb-3'>Available Quantity: </span><span className="font-poppins">{coffee.availableQuantity} </span>pis</p>
                            <p><span className="font-semibold pe-2">Details:</span> {coffee.details}</p>
                            <p><span className='font-semibold pe-2 pb-3'>Rating:</span><span className="font-poppins"> {coffee.rating.toFixed(1)}</span> out of <span className="font-poppins">5</span></p>
                            {employee && <p><span className="font-semibold pe-2">Supplier:</span> {coffee.supplier}</p>}
                            {!employee && <div className="flex items-center gap-x-3">
                                <p className="font-semibold pe-2">Set Buy Quantity: </p>
                                <button onClick={handleDecrement}><FaMinus /></button>
                                <p className="font-poppins">{productQuantity}</p>
                                <button onClick={handleIncrement}><FaPlus /></button>
                            </div>}
                        </div>
                    </div>
                    {/* id, name, imageUrl, price */}
                    {!employee && <div className="flex justify-center gap-x-8 pt-2 mt-3">
                        <button className={coffee.availableQuantity <= 0 ? 'btn btn-outline btn-info  btn-disabled' : 'btn btn-outline btn-info'} onClick={()=>handleAddToCart(coffee._id, coffee.name, coffee.imageUrl, coffee.sellsPrice)}>Add To Cart</button>
                        <button onClick={() => handleBuy(coffee._id)} className={coffee.availableQuantity <= 0 ? 'btn btn-outline btn-success  btn-disabled' : 'btn btn-outline btn-success'}  >Buy Now</button>
                    </div>}
                </div>
            </div>
            {!employee && <div>
                <h1 className="text-center pb-7 text-[45px] font-rancho secondary-h1 text-shadow-lg">View more similar products:</h1>
                <UseCategoryDataLoad category={coffee.category}></UseCategoryDataLoad>
            </div>}
            {isDeliveryMan && <div>
                <h1 className="text-center pb-7 text-[45px] font-rancho secondary-h1 text-shadow-lg">View more similar products:</h1>
                <UseCategoryDataLoad category={coffee.category}></UseCategoryDataLoad>
            </div>}
        </div>
    );
};

export default ViewCoffeeDetails;
