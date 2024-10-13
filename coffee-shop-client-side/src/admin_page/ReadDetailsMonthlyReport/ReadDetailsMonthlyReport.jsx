import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import UseAxiosSecure from '../../custom_hook/UseAxiosSecure/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
const ReadDetailsMonthlyReport = () => {
    const { month } = useParams();

    const axiosSecure = UseAxiosSecure();
    const { data: monthlyReport, refetch: reloadData } = useQuery({
        queryKey: ['monthlyReport', month],
        queryFn: async () => {
            const response = await axiosSecure.get(`/monthlySells/${month}`);
            return response.data;
        }
    });
    reloadData();
    // Function to get the current month name
    

 // Calculate total sells and total revenue
 const totalSells = monthlyReport?.dailySells?.reduce((total, totalSellsSpecificProduct) => total + totalSellsSpecificProduct.totalSells, 0);
    const totalRevenue = monthlyReport?.dailySells?.reduce((total, totalRevenueSpecificProduct) => total + totalRevenueSpecificProduct.totalRevenue, 0);
    const totalSellsQuantity = monthlyReport?.dailySells?.reduce((total, quantity) => total + quantity.totalSellsQuantity, 0);


    const printMonthSells = () => {
        const printContents = document.getElementById('printableArea').innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    };

    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1)
    }

    return (
        <div className="mt-28 ms-28 mb-12">
            <Helmet>
                <title> {`Monthly Details: ( ${monthlyReport?.month} )`}</title>
            </Helmet>        
            <div className="mb-4 ms-16 flex items-center gap-x-2">
                <button onClick={goBack} className="px-4 py-2 bg-[#D2B48C] text-white rounded flex items-center gap-x-2"><FaArrowLeft /> Back</button>
                <button onClick={printMonthSells} className="px-4 py-2 bg-green-500 text-white rounded flex items-center gap-x-2">Download | Print PDF</button>
            </div>
            <div></div>
            <div id='printableArea'>
                <h1 className="text-center my-12 text-[30px] font-poppins">Month Sells. Month: {monthlyReport?.month}</h1>
                <div>
                    <div className="">
                        <table className="table table-xs border border-2 w-[93%] mx-auto">
                            <thead>
                                <tr className="bg-slate-300	">
                                    <th>{`Date (yyy-mm-dd)`}</th>
                                    <th>Total Sells Quantity</th>
                                    <th>Total Sells</th>
                                    <th>Total Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {monthlyReport?.dailySells?.map(dailySell => (
                                    <tr key={dailySell?.date}>
                                        <td>{dailySell?.date}</td>
                                        <td>{dailySell?.totalSellsQuantity}</td>
                                        <td>{dailySell?.totalSells}</td>
                                        <td>{dailySell?.totalRevenue}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>Month:{monthlyReport?.month}</th>
                                    <th>Total: {totalSellsQuantity}</th>
                                    <th >Month Total Sells: {totalSells}</th>
                                    <th>Month Total Revenue: {totalRevenue}</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReadDetailsMonthlyReport;
