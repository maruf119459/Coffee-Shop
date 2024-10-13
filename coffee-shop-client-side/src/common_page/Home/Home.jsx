import { useContext } from 'react';
import './Home.css';
import SinglePopularProductCart from '../SinglePopularProductCart/SinglePopularProductCart';
import { UtilitiesContext } from '../../providers/UtilitiesProviders/UtilitiesProviders';
import HomeBanner from './HomeBanner';
import FollowInstagram from '../../common_components/FollowInstagram/FollowInstagram';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import UseAxiosPublic from '../../custom_hook/UseAxiosPublic/UseAxiosPublic';
import useAdmin from '../../custom_hook/useAdmin/useAdmin';
import useEmployee from '../../custom_hook/useEmployee/useEmployee';
import useDeliveryMan from '../../custom_hook/useDeliveryMan/useDeliveryMan';

const Home = () => {
    const { setIsSidebarOpen,setShowSearchForm } = useContext(UtilitiesContext);
    const axiosPublic = UseAxiosPublic();
    const [,isAdminLoading] = useAdmin()
    const [,isEmployeeLoading] = useEmployee()
    const [,isDeliveryManLoading] = useDeliveryMan();

    const { data: coffees = [], isPending:isLoading } = useQuery({
        queryKey: ['coffees'],
        queryFn: async () => {
            const response = await axiosPublic.get('/topTenCoffee');
            return response.data;
        }
    });
    const handleToggol = () =>{
        setShowSearchForm(true)
        setIsSidebarOpen(false)
    }
    return (
        <div onClick={handleToggol}>
            <Helmet>
                <title>Espresso Emporium | Home</title>
            </Helmet>
            <HomeBanner />
            <div className='mt-[100px] h-auto homePageBanner2 ms-8 flex flex-col content-center items-center'>
                <h1 className='text-[55px] font-rancho text-center text-primary-h1 text-shadow-lg mb-12'>Our Popular 10 Coffees</h1>
                <div className='grid grid-cols-2 gap-6 mx-[140px] '>
                    {isLoading||isAdminLoading||isEmployeeLoading||isDeliveryManLoading && Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} id="product" className='flex items-center justify-center w-[600px] h-auto gap-x-10 rounded-lg'>
                            <div className='skeleton bg-neutral-400 w-[185px] h-[200px] ps-[15px]'></div>
                            <div className='px-3'>
                                <div className="skeleton bg-neutral-400 h-4 w-52 mb-3"></div>
                                <div className="skeleton bg-neutral-400 h-4 w-52 mb-3"></div>
                                <div className="skeleton bg-neutral-400 h-4 w-52 mb-3"></div>
                                <div className="skeleton bg-neutral-400 h-4 w-52 mb-3"></div>
                                <div className="skeleton bg-neutral-400 h-4 w-52 mb-3"></div>
                                <div className="skeleton bg-neutral-400 h-4 w-52 mb-3"></div>
                            </div>
                            <div className='flex flex-col items-center'>
                                <button className='h-[40px] w-[40px] skeleton bg-neutral-400 mb-3 rounded-md'></button>
                                <button className='h-[40px] w-[40px] skeleton bg-neutral-400 mb-3 rounded-md'></button>
                                <button className='h-[40px] w-[40px] skeleton bg-neutral-400 rounded-md'></button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='grid grid-cols-2 gap-6 mx-[140px]'>
                    {!isLoading && coffees.map(coffee => (
                        <SinglePopularProductCart key={coffee._id} coffee={coffee}></SinglePopularProductCart>
                    ))}
                </div>
                <Link to="/viewCoffeeList">
                    <button className='mt-10 bg-[#E3B577] w-[130px] h-[48px] px-5 text-[24px] font-rancho font-semibold hover:bg-transparent hover:border-2 hover:border-[#E3B577]'>
                        View More
                    </button>
                </Link>
            </div>
            <div className='mx-[130px] mb-[120px] mt-24'>
                <FollowInstagram />
            </div>
        </div>
    );
};

export default Home;
