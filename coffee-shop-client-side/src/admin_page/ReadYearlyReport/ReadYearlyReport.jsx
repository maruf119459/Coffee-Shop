import { Link } from 'react-router-dom';
import UseAxiosSecure from '../../custom_hook/UseAxiosSecure/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { useState } from 'react';

const ReadYearlyReport = () => {
    const axiosSecure = UseAxiosSecure();
    const [searchYear, setSearchYear] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    const { data: yearlySells = [], isLoading, error } = useQuery({
        queryKey: ['yearlySells'],
        queryFn: async () => {
            const response = await axiosSecure.get(`/unique-years`);
            return response.data;
        }
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        Swal.fire({
            position: "center",
            icon: "error",
            title: `Failed to fetch data! Try again.`,
            showConfirmButton: true
        });
        return <div>Error loading data.</div>;
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosSecure.get(`/yearlySells/${searchYear}`);
            const data = [response.data[0]]
            setSearchResult(data);
        } catch (err) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: `Failed to fetch data for ${searchYear}! Try again.`,
                showConfirmButton: true
            });
            setSearchResult(null);
        }
    };

    return (
        <div className='my-12'>
            <div className="divider divider-accent mx-10 me-20 my-12"></div>

            <h1 className='text-center text-[30px] font-raleway font-bold mt-12'>Yearly Report</h1>
            <div className='flex flex-col justify-center items-center mb-12 mt-6'>
                <form onSubmit={handleSearch}>
                    <p className="font-semibold text-[20px]">Search for Specific Year:</p>
                    <span className="font-raleway flex items-center">
                        <input
                            type="text"
                            className="w-[250px] h-10 px-3 rounded-s-md border border-slate-300 border-2"
                            placeholder="Enter year"
                            value={searchYear}
                            onChange={(e) => setSearchYear(e.target.value)}
                        />
                        <button type="submit" className='bg-slate-300 px-2 py-2 rounded-e-md'>Search</button>
                    </span>
                </form>
            </div>
            <div className="overflow-x-auto h-[400px] w-[1000px] mx-auto">
                <table className="table table-xs table-pin-rows table-pin-cols border border-4 ">
                    <thead>
                        <tr className='bg-slate-400 '>
                            <td className=' ps-2 py-2 text-[16px]'>Year</td>
                            <td className=' ps-2 py-2 text-[16px]'>File</td>
                        </tr>
                    </thead>
                    <tbody>
                        {searchResult ? (
                            searchResult.map((file, index) => (
                                <tr key={index}>
                                    <td className='text-[16px]  ps-2 py-2'>{file?.year}</td>
                                    <td className='text-[16px]  ps-2 py-2'>
                                        <Link to={`/yearlyReport/${file?.year}`}>
                                            {file?.year}.pdf
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            Array.isArray(yearlySells) && yearlySells.map((file, index) => (
                                <tr key={index}>
                                    <td className='text-[16px]  ps-2 py-2'>{file?.year}</td>
                                    <td className='text-[16px]  ps-2 py-2'>
                                        <Link to={`/yearlyReport/${file?.year}`}>
                                            {file?.year}.pdf
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReadYearlyReport;
