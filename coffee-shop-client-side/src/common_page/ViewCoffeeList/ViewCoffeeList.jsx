import { Helmet } from "react-helmet";
import SinglePopularProductCart from "../SinglePopularProductCart/SinglePopularProductCart";
import UseAxiosPublic from "../../custom_hook/UseAxiosPublic/UseAxiosPublic";
import image from '../../assets/image/nodata.png'
import { useQuery } from "@tanstack/react-query";
import './style.css';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProviders/AuthProviders";
import { UtilitiesContext } from "../../providers/UtilitiesProviders/UtilitiesProviders";

const ViewCoffeeList = () => {
    const axiosPublic = UseAxiosPublic();
    const {userLoading} = useContext(AuthContext)
const {setShowSearchForm } = useContext(UtilitiesContext)
    const [prevNextBtnStatus, setPrevNextBtnStatus] = useState(false)
    const [currentPage, setCurrentPage] = useState(() => {
        const hash = window.location.hash.replace('#', '');
        const page = parseInt(hash, 10);
        return page && !isNaN(page) && page > 0 ? page : 1;
    });
    const [limit] = useState(10); // Items per page
    const [pages, setPages] = useState([]);
    const { data, isPending: isLoading, refetch } = useQuery({
        queryKey: ['coffees', currentPage],
        queryFn: async () => {
            const response = await axiosPublic.get(`/coffee?page=${currentPage}&limit=${limit}`);
            return response.data;
        }
    });

    console.log('cooffee list', isLoading)

    const totalPages = data?.totalPages || 1;

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
            setPrevNextBtnStatus(false)
        } else {
            setPrevNextBtnStatus(true)
            if (currentPage <= 5) {
                pagesArray.push(1, 2, 3, 4, 5);
            } else if (currentPage > totalPages - 3) {
                pagesArray.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pagesArray.push(currentPage - 4, currentPage - 3, currentPage - 2, currentPage - 1, currentPage);
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
    if(data?.coffees.length === 0 ){
        return <div  className="ms-28 mt-28">
            <div className="flex flex-col justify-center items-center mb-20">
                <img src={image} alt="" className="w-[800px]" />
                <h1 className="font-rancho text-[40px]">Sorry! No Data Found.</h1>
            </div>
        </div>
    }
    return (
        <div className="ms-28 mt-28" onClick={()=>{setShowSearchForm(true)}}>
            <Helmet>
                <title>Espresso Emporium | Coffee List</title>
            </Helmet>
            <h1 className="text-center pb-7 text-[45px] font-rancho secondary-h1 text-shadow-lg mb-12 ">All Coffees</h1>
            {isLoading || userLoading ? (
                <div className='grid grid-cols-2 gap-6 mx-[140px] mb-12 '>
                    {Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} id="product" className='flex items-center justify-center w-[600px] h-auto gap-x-10 rounded-lg py-3'>
                            <div className='skeleton bg-neutral-400 w-[185px] h-[200px] ps-[15px] rounded-s-lg	'></div>
                            <div className='px-3'>
                                <div className="skeleton bg-neutral-400 h-4 w-52 mb-3"></div>
                                <div className="skeleton bg-neutral-400 h-4 w-52 mb-3"></div>
                                <div className="skeleton bg-neutral-400 h-4 w-52 mb-3"></div>
                                <div className="skeleton bg-neutral-400 h-4 w-52 mb-3"></div>
                                <div className="skeleton bg-neutral-400 h-4 w-52 mb-3"></div>
                                <div className="skeleton bg-neutral-400 h-4 w-52 mb-3"></div>
                            </div>
                            <div className='flex flex-col items-center rounded-e-lg	'>
                                <button className='h-[40px] w-[40px] skeleton bg-neutral-400 mb-3 rounded-md'></button>
                                <button className='h-[40px] w-[40px] skeleton bg-neutral-400 mb-3 rounded-md'></button>
                                <button className='h-[40px] w-[40px] skeleton bg-neutral-400 rounded-md'></button>
                            </div>
                        </div>

                    ))}
                </div>
            ) : (
                <div>
                    <div className='grid grid-cols-2 gap-10 mx-[90px] mb-12'>
                        {data?.coffees.map(coffee => (
                            <SinglePopularProductCart key={coffee._id} coffee={coffee} refetch={refetch}></SinglePopularProductCart>
                        ))}
                    </div>
                    {
                        data?.coffees.length !== 0 && <div className="mb-20">
                            <div className="flex justify-center gap-x-2">
                                {
                                    prevNextBtnStatus && <button onClick={handlePrevPage} className={currentPage === 1 ? "join-item btn  btn-disabled" : "join-item btn"}>Previous</button>
                                }
                                {pages.map(page => (
                                    <button key={page} onClick={() => handlePageClick(page)} className={page === currentPage ? "join-item btn btn-active" : "join-item btn"}>{page}</button>
                                ))}
                                {
                                    prevNextBtnStatus && <button onClick={handleNextPage} className={currentPage === totalPages ? "join-item btn  btn-disabled" : "join-item btn"}>Next</button>
                                }
                            </div>
                        </div>
                    }
                </div>
            )}

        </div>
    );
};

export default ViewCoffeeList;
