import { Helmet } from "react-helmet";
import { FaArrowLeft } from "react-icons/fa";
import { useLoaderData, useNavigate } from "react-router-dom";
import HistoryRowProduct from "../HistoryRowProduct/HistoryRowProduct";


const HistoryDetails = () => {
    const order = useLoaderData();
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1)
    }
    return (
        <div className="mt-28 ms-28 mb-12">
            <Helmet>
                <title>Espresso | History Details</title>
            </Helmet>
            <div className="me-[950px]">
                <button onClick={goBack} className=" text-[25px] rounded-xl py-3  px-2 font-rancho secondary-h1 text-shadow-lg hover:bg-[#D2B48C] flex items-center gap-x-2 mb-6"><FaArrowLeft />Go Back</button>
            </div>
            <div id='printableArea' className='mx-5'>
                <h1 className="text-center pb-4 text-[45px] font-rancho secondary-h1 text-shadow-lg">Purchase Info</h1>
                <p className="text-center text-[30px] pb-3"><span className="font-semibold pe-2">Order Id:</span><span className="font-poppins">{order._id}</span></p>
                <p className="text-center text-[30px] pb-3"><span className="font-semibold pe-2">Order Date:</span><span className="font-poppins">{order.date}; {order.time}</span> - <span className="font-semibold pe-2">Delivery Date:</span><span className="font-poppins">{order.deliveredTime}</span></p>
                <div className='me-10'>
                    <div className="">
                        <table className="table border">
                            {/* head */} 
                            <thead>
                                <tr>
                                    <th>Porduct Image</th>
                                    <th>Porduct Name</th>
                                    <th>Product ID</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* row 1 */}
                                {
                                    order.buyProduct.map(product => <HistoryRowProduct key={product.id} product={product}></HistoryRowProduct>)
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th className='bg-green-200	'>Total : </th>
                                    <th className='bg-green-200	'>{order.buyProduct.reduce((acc, product) => acc + product.coffeeSellPrice * product.quantity, 0)}</th>
                                </tr>
                            </tfoot>

                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryDetails;