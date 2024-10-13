import '@react-pdf-viewer/core/lib/styles/index.css';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import UseAxiosSecure from '../../custom_hook/UseAxiosSecure/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';


const ReadDetailsDailyReport = () => {
    const { date } = useParams();

    const axiosSecure = UseAxiosSecure();
    const { data: sellsProduts, refetch: reloadData } = useQuery({
        queryKey: ['sellsProduts', date],
        queryFn: async () => {
            const response = await axiosSecure.get(`/dailySells/${date}`);
            return response.data;
        }
    });
    reloadData();

    const totalSells = sellsProduts?.sellsCoffees?.reduce((total, totalSellsSpecificProduct) => total + totalSellsSpecificProduct.totalSells, 0);
    const totalRevenue = sellsProduts?.sellsCoffees?.reduce((total, totalRevenueSpecificProduct) => total + totalRevenueSpecificProduct.totalRevenue, 0);
    const totalSellsQuantity = sellsProduts?.sellsCoffees?.reduce((total, quantity) => total + quantity.sellsQuantity, 0);

    const handlePrint = () => {
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

    const handleSaveInDB = async () => {
        const month = sellsProduts?.month;
        const date = sellsProduts?.date;
        const newDate = new Date(sellsProduts?.date)
        const year = newDate.getFullYear();
        const monthCode = parseInt(newDate.getMonth()) +1;

        try {
            const findMonthRes = await axiosSecure.get(`/findMonth/${month}`);

            if (findMonthRes.data.message === 'Month found') {
                const findDateRes = await axiosSecure.get(`/monthlySellsFindDate/${date}`);
                if (findDateRes.data.message === 'Date found') {
                    // Patch the dailySells
                    const dailySells = { date, totalSellsQuantity, totalSells, totalRevenue };
                    const patchRes = await axiosSecure.patch('/monthlySellsDailyReport', { month, date, dailySells });
                    if (patchRes.data.message) {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: `Successfully saved.`,
                            showConfirmButton: false,
                            timer: 3000

                        });
                    } else {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: `Failed to save! Try again.`,
                            showConfirmButton: true
                        });
                    }
                } else {
                    // Post the new dailySells
                    const dailySells = { date, totalSellsQuantity, totalSells, totalRevenue };
                    const postRes = await axiosSecure.post('/monthlySellsDailyReport', { month, dailySells });
                    if (postRes.data.message) {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: `Successfully saved.`,
                            showConfirmButton: false,
                            timer: 3000

                        });
                    } else {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: `Failed to save! Try again.`,
                            showConfirmButton: true
                        });
                    }
                }
            } else {
                // Post the new monthlySells
                const monthlySells = {
                    month,
                    dailySells: [{ date, totalSellsQuantity, totalSells, totalRevenue }],
                    year,
                    monthCode
                };
                const monthlySellsRes = await axiosSecure.post('/monthlySells', monthlySells);
                if (monthlySellsRes.data.message) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: `Successfully saved.`,
                        showConfirmButton: false,
                        timer: 3000
                    });
                } else {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: `Failed to save! Try again.`,
                        showConfirmButton: true
                    });
                }
            }
        } catch (error) {
            console.error('Error in handleSaveInDB:', error);
            Swal.fire({
                position: "center",
                icon: "error",
                title: `An error occurred! Try again.`,
                showConfirmButton: true
            });
        }
    };
    const isToday = (someDate) => {
        const today = new Date();
        return someDate.getDate() === today.getDate() &&
            someDate.getMonth() === today.getMonth() &&
            someDate.getFullYear() === today.getFullYear();
    };
    return (
        <div className="mt-28 ms-28 mb-12">
            <Helmet>
                <title> {`Daily Details: ( ${sellsProduts?.date} )`}</title>
            </Helmet>
            <div className="mb-4 ms-16 flex items-center gap-x-2">
                <button onClick={goBack} className="px-4 py-2 bg-[#D2B48C] text-white rounded flex items-center gap-x-2"><FaArrowLeft /> Back</button>
                <button onClick={handlePrint} className="px-4 py-2 bg-green-500 text-white rounded flex items-center gap-x-2">Download | Print PDF</button>
            </div>
            <div>
                <div id='printableArea'>
                    <h1 className='text-center mt-6 mb-12 text-[30px] font-poppins'>Date: {sellsProduts?.date} {`(yyy-mm-dd)`}</h1>
                    <div className="">
                        <table className="table table-xs border border-2 w-[93%] mx-auto">
                            <thead>
                                <tr className="bg-slate-300">
                                    <th>Product Id</th>
                                    <th>Product Name</th>
                                    <th>Wholesale Price</th>
                                    <th>Sell Price</th>
                                    <th>Sells Quantity</th>
                                    <th>Total Sells</th>
                                    <th>Total Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sellsProduts?.sellsCoffees?.map(sellsProdut => (
                                    <tr key={sellsProdut.coffeeId}>
                                        <th>{sellsProdut.coffeeId}</th>
                                        <td>{sellsProdut.coffeeName}</td>
                                        <td>{sellsProdut.basePrice}</td>
                                        <td>{sellsProdut.sellsPrice}</td>
                                        <td>{sellsProdut.sellsQuantity}</td>
                                        <td>{sellsProdut.totalSells}</td>
                                        <td>{sellsProdut.totalRevenue}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan="4"></th>
                                    <th>Date: {sellsProduts?.date} {`(yyy-mm-dd)`}</th>
                                    <th>Today Total Sells: {totalSells}</th>
                                    <th>Today Total Revenue: {totalRevenue}</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            {
                sellsProduts?.date && !isToday(new Date(sellsProduts.date)) && (
                    <div className="mb-4 ms-12 mt-4">
                        <button onClick={handleSaveInDB} className="px-4 py-2 bg-yellow-500 text-white rounded flex items-center gap-x-2">Save in Database</button>
                    </div>
                )
            }

        </div>
    );
};

export default ReadDetailsDailyReport;
