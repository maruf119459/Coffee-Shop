import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UseAxiosSecure from "../../custom_hook/UseAxiosSecure/UseAxiosSecure";
import Swal from "sweetalert2";

const TodaySells = () => {
    const axiosSecure = UseAxiosSecure();


    const { data: sellsProduts, refetch: reloadData } = useQuery({
        queryKey: ['sellsProduts'],
        queryFn: async () => {
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
            const yyyy = today.getFullYear();
            const date = `${yyyy}-${mm}-${dd}`
            const response = await axiosSecure.get(`/dailySells/${date}`);
            return response.data;
        }
    });
    reloadData();

    // Function to get today's date in "dd-mm-yyyy" format
    const getCurrentDate = () => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = today.getFullYear();
        return `${dd}-${mm}-${yyyy}`; 
    };

    // Calculate total sells and total revenue totalRevenue
    const totalSells = sellsProduts?.sellsCoffees?.reduce((total, totalSellsSpecificProduct) => total + totalSellsSpecificProduct.totalSells, 0);
    const totalRevenue = sellsProduts?.sellsCoffees?.reduce((total, totalRevenueSpecificProduct) => total + totalRevenueSpecificProduct.totalRevenue, 0);
    const totalSellsQuantity = sellsProduts?.sellsCoffees?.reduce((total, quantity) => total + quantity.sellsQuantity, 0);

    

    console.log('totalSellsQuantity',totalSellsQuantity)
    console.log('totalSells',totalSells)
    console.log('totalRevenue',totalRevenue)

    const printTodaySells = () => {
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

    const handleSaveInDB = async () => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const today = new Date();
        const year = today.getFullYear();
        const monthName = months[today.getMonth()];
        const month = `${monthName}-${year}`;
        const monthCode = parseInt(today.getMonth()) +1;
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const date = `${year}-${mm}-${dd}`;
    
        try {
            const findMonthRes = await axiosSecure.get(`/findMonth/${month}`);
    
            if (findMonthRes.data.message === 'Month found') {
                const findDateRes = await axiosSecure.get(`/monthlySellsFindDate/${date}`);
                if (findDateRes.data.message === 'Date found') {
                    // Patch the dailySells
                    const dailySells = {date, totalSellsQuantity, totalSells, totalRevenue };
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

    return (
        <div className="ms-28 mt-28 mb-12">
            <Helmet>
                <title> Today Sells ( {getCurrentDate()} )</title>
            </Helmet>

            <div className="mb-4 ms-16 flex items-center gap-x-2">
                <button onClick={goBack} className="px-4 py-2 bg-[#D2B48C] text-white rounded flex items-center gap-x-2"><FaArrowLeft /> Back</button>
                <button onClick={printTodaySells} className="px-4 py-2 bg-green-500 text-white rounded flex items-center gap-x-2">Download | Print PDF</button>
            </div>
            <div>
                <div id='printableArea'>
                    <h1 className='text-center mt-6 mb-12 text-[30px] font-poppins'>Today Sells. Date: {getCurrentDate()}</h1>
                    <div className="">
                        <table className="table table-xs border border-2 w-[93%] mx-auto">
                            <thead>
                                <tr className="bg-slate-300	">
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
                                {sellsProduts?.sellsCoffees?.map(sellsProdut => <tr key={sellsProdut.coffeeId}>
                                    <th>{sellsProdut.coffeeId}</th>
                                    <td>{sellsProdut.coffeeName}</td>
                                    <td>{sellsProdut.basePrice}</td>
                                    <td>{sellsProdut.sellsPrice}</td>
                                    <td>{sellsProdut.sellsQuantity}</td>
                                    <td>{sellsProdut.totalSells}</td>
                                    <td>{sellsProdut.totalRevenue}</td>
                                </tr>)}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan="4"></th>
                                    <th>Date: {getCurrentDate()}</th>
                                    <th>Today Total Sells: {totalSells}</th>
                                    <th>Today Total Revenue: {totalRevenue}</th>
                                </tr>
                            </tfoot>
                        </table>
                        <div className="mb-4 ms-12 mt-4 ">
                            <button onClick={handleSaveInDB} className="px-4 py-2 bg-yellow-500 text-white rounded flex items-center gap-x-2">Save in Database</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodaySells;
