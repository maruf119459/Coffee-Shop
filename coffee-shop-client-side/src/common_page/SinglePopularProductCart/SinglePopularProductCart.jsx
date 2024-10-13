

import { useContext } from 'react';
import './SinglePopularProductCart.css'
import PropTypes from 'prop-types';
import { AiTwotoneEye } from "react-icons/ai";
import { IoPencil } from "react-icons/io5";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { FaMoneyCheckDollar, FaOpencart } from "react-icons/fa6";

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProviders/AuthProviders';
import UseAxiosSecure from '../../custom_hook/UseAxiosSecure/UseAxiosSecure';
import Swal from 'sweetalert2';
import { UtilitiesContext } from '../../providers/UtilitiesProviders/UtilitiesProviders';
import useDeliveryMan from '../../custom_hook/useDeliveryMan/useDeliveryMan';
const SinglePopularProductCart = ({ coffee, refetch }) => {
    const { user1, isEmployee, isAdmin } = useContext(AuthContext)
    const { cartsLengthReload } = useContext(UtilitiesContext)
    const [isDeliveryMan,] = useDeliveryMan();

    const navigate = useNavigate();
    const location = useLocation();
    const axiosSecure = UseAxiosSecure();

    const pathName = location.pathname;

    const employee = (isEmployee || isAdmin) && user1;

    const handleBuy = async (id) => {
        const quantity = 1;
        const productId = id;
        navigate('/payment', { state: { pathName, productId, quantity } });
    };

    const deleteProduct = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/coffee/${id}`);
                    Swal.fire({
                        title: "Deleted!",
                        text: "Coffee has been deleted.",
                        icon: "success"
                    });
                    refetch();
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Failed to delete coffee!",
                    });
                }
            }
        });
    };
    //handleAddToCart(coffee._id,coffee.name,coffee.imageUrl,coffee.sellsPrice)
    const handleAddToCart = async (id, name, imageUrl, price) => {
        const quantity = 1;
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
                cartsLengthReload();
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
        <div  className={coffee.availableQuantity <= 0 ?  'text-[20px] font-raleway bg-[#F0094A59] flex flex-col  items-center justify-center w-[600px] h-auto rounded-lg  	' : 'text-[20px] font-raleway product flex flex-col  items-center justify-center w-[600px] h-auto   rounded-lg  	'}>
            <div className=' flex  items-center gap-x-10 pt-4 pe-4'>
                <div className=''>
                    <img src={coffee.imageUrl} alt="" className='w-[185px] h-[239px] ps-[15px]' />
                </div>

                <div className='px-3'>
                    <p><span className='font-semibold pe-2 pb-3'>Name:</span>{coffee.name}</p>
                    <p><span className='font-semibold pe-2 pb-3'>Category:</span>{coffee.category}</p>
                    <p><span className='font-semibold pe-2 pb-3'>Price:</span> <span className="font-poppins">{coffee.sellsPrice}</span>Tk</p>
                    <p><span className='font-semibold pe-2 pb-3'>Available Quantity:</span><span className="font-poppins">{coffee.availableQuantity}</span> pis</p>
                    <p><span className='font-semibold pe-2 pb-3'>Rating:</span><span className="font-poppins"> {coffee.rating.toFixed(1)}</span> out of <span className="font-poppins">5</span></p>
                </div >
                <div className='flex flex-col items-center gap-y-3  '>
                    <Link to={`/viewCoffeDetails/${coffee._id}`}><button className='bg-[#D2B48C] p-3 rounded-md	'><AiTwotoneEye className='text-[20px]'></AiTwotoneEye></button></Link>
                    {isDeliveryMan && <button className='btn p-3 rounded-md	btn-info btn-disabled' onClick={() => handleAddToCart(coffee._id, coffee.name, coffee.imageUrl, coffee.sellsPrice)}><FaOpencart className='text-[20px]'></FaOpencart></button>}
                    {!employee  && <button className={coffee.availableQuantity <= 0 ? 'btn p-3 rounded-md	btn-info btn-disabled' : 'btn p-3 rounded-md	btn-info '} onClick={() => handleAddToCart(coffee._id, coffee.name, coffee.imageUrl, coffee.sellsPrice)}><FaOpencart className='text-[20px]'></FaOpencart></button>}
                    {!employee  && <button onClick={() => handleBuy(coffee._id)} className={coffee.availableQuantity <= 0 ? 'btn p-3 rounded-md	btn-success  btn-disabled' : 'btn p-3 rounded-md	btn-success'}><FaMoneyCheckDollar className='text-[20px]'></FaMoneyCheckDollar></button>}
                    {isDeliveryMan && <button onClick={() => handleBuy(coffee._id)} className='btn p-3 rounded-md	btn-success btn-disabled'><FaMoneyCheckDollar className='text-[20px]'></FaMoneyCheckDollar></button>}
                    {!isDeliveryMan && employee && <Link to={`/updateCoffee/${coffee._id}`} state={location.pathname}><button className='bg-[#3C393B] p-3 rounded-md	'><IoPencil className='text-[20px] text-[#fff]  ' ></IoPencil></button></Link>}
                    {!isDeliveryMan && employee && <button onClick={() => deleteProduct(coffee._id)} className='bg-[#EA4744] p-3 rounded-md	'><RiDeleteBin7Fill className='text-[20px] text-[#fff]  '></RiDeleteBin7Fill></button>}
                </div>
            </div>
            {
                coffee.availableQuantity <= 0 ?<p className='pb-4'>Note: This coffee not available</p> :null
            }
        </div>
    );
};

export default SinglePopularProductCart;

SinglePopularProductCart.propTypes = {
    coffee: PropTypes.object,
    refetch: PropTypes.func,
}
/*



*/