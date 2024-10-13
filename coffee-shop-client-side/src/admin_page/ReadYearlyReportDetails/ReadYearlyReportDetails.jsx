import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import UseAxiosSecure from '../../custom_hook/UseAxiosSecure/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const ReadYearlyReportDetails = () => {
    const { year } = useParams();
    const axiosSecure = UseAxiosSecure();
    const { data: yearlyReport=[],isLoading } = useQuery({
        queryKey: ['yearlyReport', year],
        queryFn: async () => {
            const response = await axiosSecure.get(`/yearlySells/${year}`);
            return response.data;
        }
    });
    
    // Calculate total sells and total revenue for the entire year
    let totalSells = 0;
    let totalRevenue = 0;
    let totalSellsQuantity = 0;

    yearlyReport?.forEach(monthReport => {
        monthReport.dailySells.forEach(dailySell => {
            totalSells += dailySell.totalSells;
            totalRevenue += dailySell.totalRevenue;
            totalSellsQuantity += dailySell.totalSellsQuantity;
        });
    });

    const printYearlySells = () => {
        const printContents = document.getElementById('printableArea').innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    };

    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="mt-28 ms-28 mb-12">
            <Helmet>
                <title>Yearly Details: {year}</title>
            </Helmet>
            <div className="mb-4 ms-16 flex items-center gap-x-2">
                <button onClick={goBack} className="px-4 py-2 bg-[#D2B48C] text-white rounded flex items-center gap-x-2"><FaArrowLeft /> Back</button>
                <button onClick={printYearlySells} className="px-4 py-2 bg-green-500 text-white rounded flex items-center gap-x-2">Download | Print PDF</button>
            </div>
            <div id='printableArea'>
                <h1 className="text-center my-12 text-[30px] font-poppins">Yearly Sells. Year: {year}</h1>
                <div>
                    <table className="table table-xs border border-2 w-[93%] mx-auto">
                        <thead>
                            <tr className="bg-slate-300">
                                <th>Month</th>
                                <th>Total Sells Quantity</th>
                                <th>Total Sells</th>
                                <th>Total Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {yearlyReport?.map(monthReport => (
                                <tr key={monthReport?.month}>
                                    <td>{monthReport?.month}</td>
                                    <td>{monthReport?.dailySells?.reduce((total, dailySell) => total + dailySell.totalSellsQuantity, 0)}</td>
                                    <td>{monthReport?.dailySells?.reduce((total, dailySell) => total + dailySell.totalSells, 0)}</td>
                                    <td>{monthReport?.dailySells?.reduce((total, dailySell) => total + dailySell.totalRevenue, 0)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Year: {year}</th>
                                <th>Total: {totalSellsQuantity}</th>
                                <th>Yearly Total Sells: {totalSells}</th>
                                <th>Yearly Total Revenue: {totalRevenue}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReadYearlyReportDetails;
