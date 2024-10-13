import { Helmet } from "react-helmet";
import SingleMessageCard from "../SingleMessageCard/SingleMessageCard";
import UseAxiosSecure from "../../custom_hook/UseAxiosSecure/UseAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { UtilitiesContext } from "../../providers/UtilitiesProviders/UtilitiesProviders";

const Messages = () => {
    const axiosSecure = UseAxiosSecure();
    const { unreadMessage, unreadMessageNumberReload } = useContext(UtilitiesContext)
    unreadMessageNumberReload();

    const [prevNextBtnStatus, setPrevNextBtnStatus] = useState(false)
    const [currentPage, setCurrentPage] = useState(() => {
        const hash = window.location.hash.replace('#', '');
        const page = parseInt(hash, 10);
        return page && !isNaN(page) && page > 0 ? page : 1;
    });
    const [limit] = useState(5); // Items per page
    const [pages, setPages] = useState([]);

    const { data, isLoading,refetch } = useQuery({
        queryKey: ['message',currentPage],
        queryFn: async () => {
            const response = await axiosSecure.get(`/message?page=${currentPage}&limit=${limit}`);
            return response.data;
        }
    });
    refetch();

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

    return (
        <div className="mt-28 ms-28 mb-20">
            <Helmet>
                <title>{`Espresso Emporium | (${unreadMessage}) Messages`}</title>
            </Helmet>
            <h1 className="text-center pb-4 text-[45px] font-rancho secondary-h1 text-shadow-lg">Unread Messsage Number: {unreadMessage}</h1>
            <div className="mx-[90px]">
                {
                    isLoading ? <div className="flex flex-col justify-center items-center mt-2">
                        <div className="skeleton h-[90px] w-[1200px] mt-2"></div>
                        <div className="skeleton h-[90px] w-[1200px] mt-2"></div>
                        <div className="skeleton h-[90px] w-[1200px] mt-2"></div>
                        <div className="skeleton h-[90px] w-[1200px] mt-2"></div>
                        <div className="skeleton h-[90px] w-[1200px] mt-2"></div>
                        <div className="skeleton h-[90px] w-[1200px] mt-2"></div>

                    </div> : <>
                        {
                            data?.messages.map(message => <SingleMessageCard key={message._id} message={message} unreadMessageNumberReload={unreadMessageNumberReload} refetch={refetch}></SingleMessageCard>)
                        }
                        {
                            data?.messages.length !== 0 && <div className="mb-20">
                                <div className="flex justify-center gap-x-2 mt-4">
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
                    </>
                }
            </div>
        </div>
    );
};

export default Messages;

