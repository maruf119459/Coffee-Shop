import { Link } from 'react-router-dom';
import UseAxiosSecure from '../../custom_hook/UseAxiosSecure/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Swal from 'sweetalert2';

const ReadDailyReport = () => {
    const axiosSecure = UseAxiosSecure();
    const [searchDate, setSearchDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    const { data: dailySells,  } = useQuery({
        queryKey: ['dailySells'],
        queryFn: async () => {
            const response = await axiosSecure.get(`/dailySells`);
            return response.data;
        }
    });

    const handleSearchDate = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosSecure.get(`/dailySells/${searchDate}`);
            setSearchResult(response.data ? [response.data] : []);
        } catch (err) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: `Failed to fetch data for ${searchDate}! Try again.`,
                showConfirmButton: true
            });
            setSearchResult(null);
        }
    };

    const handleSearchRange = async (e) => {
        e.preventDefault();
        if (!startDate || !endDate) {
            Swal.fire({
                position: "center",
                icon: "warning",
                title: "Please provide both start and end dates.",
                showConfirmButton: true
            });
            return;
        }
        try {
            const response = await axiosSecure.get(`/getDataBetweenDates`, {
                params: {
                    startDate,
                    endDate
                }
            });
            setSearchResult(response.data);
        } catch (err) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: `Failed to fetch data between ${startDate} and ${endDate}! Try again.`,
                showConfirmButton: true
            });
            setSearchResult(null);
        }
    };

    return (
        <div>
            <div className="divider divider-accent mx-10 me-20 my-12"></div>

            <h1 className='text-center text-[30px] font-raleway font-bold mt-12'>Daily Report</h1>
            <div className='flex flex-col justify-center items-center mb-12 mt-6'>
                <form onSubmit={handleSearchDate}>
                    <p className="font-semibold text-[20px]">Search for Specific Date:</p>
                    <span className="font-raleway flex items-center">
                        <input
                            type="date"
                            className="w-[250px] h-10 px-3 rounded-s-md border border-slate-300 border-2"
                            value={searchDate}
                            onChange={(e) => setSearchDate(e.target.value)}
                        />
                        <button type="submit" className='bg-slate-300 px-2 py-2 rounded-e-md'>Search</button>
                    </span>
                </form>

                <form onSubmit={handleSearchRange}>
                    <span className="font-raleway">
                        <p className="font-semibold pt-4 text-[20px] pb-2">Search for Range Date:</p>
                        <div className='flex items-center'>
                            <div className='flex items-center'>
                                <p className='bg-slate-300 px-2 py-2 rounded-s-md'>Start Date</p>
                                <input
                                    type="date"
                                    className="w-[250px] h-10 px-3 border border-slate-300 border-2"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className='flex items-center'>
                                <p className='bg-slate-300 px-2 py-2'>End Date</p>
                                <input
                                    type="date"
                                    className="w-[250px] h-10 px-3 border border-slate-300 border-2"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <button type="submit" className='bg-slate-300 px-2 py-2 rounded-e-md'>Search</button>
                        </div>
                    </span>
                </form>
            </div>
            <div className="overflow-x-auto h-[400px] w-[1000px] mx-auto">
                <table className="table table-xs table-pin-rows table-pin-cols border border-4">
                    <thead>
                        <tr className='bg-slate-400'>
                            <td className='ps-2 py-2 text-[16px]'>{`Date (yyy-mm-dd)`}</td>
                            <td className='ps-2 py-2 text-[16px]'>File</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (searchResult ? searchResult : dailySells)?.map(file => (
                                <tr key={file.date}>
                                    <td className='ps-2 py-2 text-[16px]'>{file.date}</td>
                                    <td className='ps-2 py-2 text-[16px]'>
                                        <Link to={`/dailyReport/${file.date}`}>
                                            {file.date}.pdf
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReadDailyReport;
