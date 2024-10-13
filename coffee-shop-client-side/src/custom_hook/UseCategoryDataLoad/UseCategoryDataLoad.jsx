import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { Virtual, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './styles.css';
import { Link, useNavigate } from 'react-router-dom';
import { AiTwotoneEye } from 'react-icons/ai';
import { FaMoneyCheckDollar, FaOpencart } from 'react-icons/fa6';
import UseAxiosPublic from '../UseAxiosPublic/UseAxiosPublic';
import useAdmin from '../useAdmin/useAdmin';
import useEmployee from '../useEmployee/useEmployee';
import UseAxiosSecure from '../../custom_hook/UseAxiosSecure/UseAxiosSecure';
import { AuthContext } from '../../providers/AuthProviders/AuthProviders';
import Swal from 'sweetalert2';
import { UtilitiesContext } from '../../providers/UtilitiesProviders/UtilitiesProviders';
import useDeliveryMan from '../useDeliveryMan/useDeliveryMan';

const UseCategoryDataLoad = ({ category }) => {
    const {user1} = useContext(AuthContext)

    const {cartsLengthReload,setShowSearchForm} =useContext(UtilitiesContext)
    const [isadmin,] = useAdmin()
    const [isemployee,] = useEmployee();
    const axiosPublic = UseAxiosPublic();
    const [coffees, setCoffees] = useState([])
    const navigate = useNavigate();
    const employee = isadmin || isemployee;
    const axiosSecure = UseAxiosSecure();
    const [isDeliveryMan,] = useDeliveryMan();

    useEffect(() => {
        const fetchCoffees = async () => {
            try {
                const response = await axiosPublic.get(`/coffee/category/${category}`);
                setCoffees(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Failed to fetch coffees', error);
            }
        };

        fetchCoffees();
    }, [axiosPublic, category]);

    const handleBuy =async (id) => {
        const quantity = 1;
        const productId = id;
        const pathName = '/loadDatabyCategory'
        navigate('/payment', { state: { pathName,productId ,quantity} });
    };

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
        <div onClick={()=>setShowSearchForm(true)}>
            <Swiper
                modules={[Virtual, Navigation, Pagination]}
                slidesPerView={2}
                centeredSlides={true}
                spaceBetween={30}
                pagination={{
                    type: 'fraction',
                }}
                navigation={true}
                virtual
            >
                {coffees.map((coffee, index) => (
                    <SwiperSlide key={coffee._id} virtualIndex={index}>
                        <div key={coffee._id} id="product" className='text-[20px] font-raleway flex items-center w-[600px] h-auto justify-between rounded-lg'>
                            <div className='py-[31px] w-[140px]  h-[290px] ms-4'>
                                <img src={coffee.imageUrl} alt="" className='w-[100px] h-[239px]' />
                            </div>

                            <div className='text-left	'>
                                <p><span className='font-semibold pe-2 pb-3'>Name:</span>{coffee.name}</p>
                                <p><span className='font-semibold pe-2 pb-3'>Category:</span>{coffee.category}</p>
                                <p><span className='font-semibold pe-2 pb-3'>Price:</span> <span className="font-poppins">{coffee.sellsPrice}</span>Tk</p>
                                <p><span className='font-semibold pe-2 pb-3'>Available Quantity:</span><span className="font-poppins">{coffee.availableQuantity}</span> pis</p>
                                <p><span className='font-semibold pe-2 pb-3'>Rating:</span><span className="font-poppins"> {coffee.rating.toFixed(1)}</span> out of <span className="font-poppins">5</span></p>
                            </div >
                            <div className='flex flex-col items-center gap-y-3 py-[31px] me-10'>
                                <Link to={`/viewCoffeDetails/${coffee._id}`}><button className='bg-[#D2B48C] p-3 rounded-md	'><AiTwotoneEye className='text-[20px]'></AiTwotoneEye></button></Link>
                                {!employee && <button className='btn p-3 rounded-md	btn-info' onClick={()=>handleAddToCart(coffee._id, coffee.name, coffee.imageUrl, coffee.sellsPrice)}><FaOpencart className='text-[20px]'></FaOpencart></button>}
                                {!employee && <button onClick={() => handleBuy(coffee._id)} className='btn p-3 rounded-md	btn-success'><FaMoneyCheckDollar className='text-[20px]'></FaMoneyCheckDollar></button>}
                                {isDeliveryMan &&  <button className='btn p-3 rounded-md	btn-info  btn-disabled' onClick={()=>handleAddToCart(coffee._id, coffee.name, coffee.imageUrl, coffee.sellsPrice)}><FaOpencart className='text-[20px]'></FaOpencart></button>}
                                {isDeliveryMan && <button onClick={() => handleBuy(coffee._id)} className='btn p-3 rounded-md	btn-success btn-disabled'><FaMoneyCheckDollar className='text-[20px]'></FaMoneyCheckDollar></button>}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

UseCategoryDataLoad.propTypes = {
    category: PropTypes.string.isRequired,
};

export default UseCategoryDataLoad;
