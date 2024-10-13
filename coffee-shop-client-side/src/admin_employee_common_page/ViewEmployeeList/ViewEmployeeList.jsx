import { Helmet } from "react-helmet";
import SingleEmployeeCard from "../SingleEmployeeCard/SingleEmployeeCard";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProviders/AuthProviders";
import UseAxiosSecure from "../../custom_hook/UseAxiosSecure/UseAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

const ViewEmployeeList = () => {
    const { user1, isAdmin } = useContext(AuthContext);
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
    // const [payButtonStatus, setPayButtonStatus] = useState(true);
    const axiosSecure = UseAxiosSecure();

    const [prevNextBtnStatus, setPrevNextBtnStatus] = useState(false);
    const [currentPage, setCurrentPage] = useState(() => {
        const hash = window.location.hash.replace('#', '');
        const page = parseInt(hash, 10);
        return page && !isNaN(page) && page > 0 ? page : 1;
    });
    const [limit] = useState(5); // Items per page
    const [pages, setPages] = useState([]);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['employees', currentPage],
        queryFn: async () => {
            const response = await axiosSecure.get(`/employee?page=${currentPage}&limit=${limit}`);
            return response.data;
        }
    });
console.log(data)
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
            setPrevNextBtnStatus(false);
        } else {
            setPrevNextBtnStatus(true);
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

    const handleEmployeeDeleteBtn = () => {
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
                    await axiosSecure.delete('/employeesDelete', { data: { ids: selectedEmployeeIds } });
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                    setSelectedEmployeeIds([]);
                    refetch();
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Failed to delete employees!",
                    });
                }
            }
        });
    };

    const handleCheckboxChange = (employeeId, isChecked) => {
        if (isChecked) {
            setSelectedEmployeeIds(prevIds => [...prevIds, employeeId]);
        } else {
            setSelectedEmployeeIds(prevIds => prevIds.filter(id => id !== employeeId));
        }
    };

    return (
        <div className="mt-28 ms-28 mb-12">
            <Helmet>
                <title>Espresso Emporium | Employee List</title>
            </Helmet>
            <h1 className="text-center pb-4 text-[45px] font-rancho secondary-h1 text-shadow-lg">Employee List</h1>
            {isLoading && Array.from({ length: 5 }).map((_, index) => (
                <div key={index}>
                    <div className="mx-[90px] px-6 py-2 bg-[#ECEAE3] rounded-md flex justify-between items-center mt-2">
                        <div>
                            <div className="skeleton bg-neutral-400 w-[80px] h-[80px]"></div>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <div className="skeleton bg-neutral-400 h-4 w-52"></div>
                            <div className="skeleton bg-neutral-400 h-4 w-52"></div>
                        </div>
                        <div className='flex flex-col gap-y-1'>
                            <div className="skeleton bg-neutral-400 h-4 w-28"></div>
                            <div className="skeleton bg-neutral-400 h-4 w-28"></div>
                        </div>
                        <div className='flex items-center gap-x-2'>
                            <button className="skeleton bg-neutral-400 w-[70px] h-[50px]"></button>
                            <button className="skeleton bg-neutral-400 w-[70px] h-[50px]"></button>
                            <button className="skeleton bg-neutral-400 w-[70px] h-[50px]"></button>
                        </div>
                    </div>
                </div>
            ))}
            <div className="flex justify-center mt-2">
                {selectedEmployeeIds.length > 0 && isAdmin && user1 && (
                    <button className='btn bg-[#EA4744]' onClick={handleEmployeeDeleteBtn}>Delete</button>
                )}
            </div>
            <div className='mx-[90px] mt-12'>
                {data?.employees.map(employee => {
                    const today = new Date();
                    const payDate = new Date(employee.paySalaryDate);
                    const isPayable = today >= payDate;

                    return (
                        <SingleEmployeeCard
                            key={employee._id}
                            employee={employee}
                            handleCheckboxChange={handleCheckboxChange}
                            selectedEmployeeIds={selectedEmployeeIds}
                            refetch={refetch}
                            payButtonStatus={!isPayable}
                        />
                    );
                })}
                {data?.employees.length !== 0 && (
                    <div className="mb-20">
                        <div className="flex justify-center gap-x-2 mt-4">
                            {prevNextBtnStatus && (
                                <button onClick={handlePrevPage} className={currentPage === 1 ? "join-item btn btn-disabled" : "join-item btn"}>Previous</button>
                            )}
                            {pages.map(page => (
                                <button key={page} onClick={() => handlePageClick(page)} className={page === currentPage ? "join-item btn btn-active" : "join-item btn"}>{page}</button>
                            ))}
                            {prevNextBtnStatus && (
                                <button onClick={handleNextPage} className={currentPage === totalPages ? "join-item btn btn-disabled" : "join-item btn"}>Next</button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewEmployeeList;
