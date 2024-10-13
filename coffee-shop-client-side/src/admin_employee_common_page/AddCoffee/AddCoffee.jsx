import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import UseAxiosSecure from "../../custom_hook/UseAxiosSecure/UseAxiosSecure";
import Swal from "sweetalert2";

const img_hosting_key = 'f4bad12b7d481fe4bafabe514b16b077'
const img_hosting_api = `https://api.imgbb.com/1/upload?key=${img_hosting_key}`;

const AddCoffee = () => {
    const navigate = useNavigate();
    const axiosSecure = UseAxiosSecure();
    const goBackHome = () => {
        navigate('/')
    }

    const handleAddCoffee = async e => {
        e.preventDefault();
        const photo = e.target.photo.files[0];        
        const formData = new FormData();
        formData.append('image', photo);

        Swal.fire({
            title: 'Adding coffee...',
            text: 'Please wait while the coffee is being added.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const res = await axiosSecure.post(img_hosting_api, formData, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            });

            if (res.data.success) {
                const name = e.target.name.value;
                const supplier = e.target.supplier.value;
                const category = e.target.category.value;
                const imageUrl = res.data.data.display_url;
                const photo_delete_url = res.data.data.delete_url;
                const basePrice = parseFloat(e.target.basePrice.value);
                const sellsPrice = parseFloat(e.target.sellsPrice.value);
                const taste = e.target.taste.value;
                const details = e.target.details.value;
                const availableQuantity = parseInt(e.target.quantity.value);
                const rating = parseFloat(0);
                const sellsAmount = parseInt(0);
                const ratingCount = parseInt(0);
                const totalRating = parseFloat(0);
                const coffee = { name, supplier, category, imageUrl, basePrice, sellsPrice, taste, details, availableQuantity,rating,sellsAmount,totalRating,photo_delete_url,ratingCount };
                console.log('coffee', coffee);

                const response = await axiosSecure.post('/coffee', coffee, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                Swal.close();
                
                if (response.data.insertedId) {
                    e.target.reset();
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: `Coffee added successfully`,
                        showConfirmButton: false,
                        timer: 3000
                    });
                } else {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: `Failed to add coffee! Try again.`,
                        showConfirmButton: true,
                    });
                }
            }
        }catch (error) {
            Swal.close();
            if (error.response && error.response.data && error.response.data.error) {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: `Failed to add employee! ${error.response.data.error}`,
                    showConfirmButton: true
                });
            } else {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: `Failed to add employee! Try again.`,
                    showConfirmButton: true
                });
            }
        }
    }

    return (
        <div className="ms-28 mt-28">
            <Helmet>
                <title>Espresso Emporium | Add Coffee</title>
            </Helmet>
            <div className="flex flex-col justify-center items-center mb-[120px]">
                <div className="me-[950px]">
                    <button onClick={goBackHome} className="text-[25px] rounded-xl pt-3 pb-2 px-2 font-rancho secondary-h1 text-shadow-lg hover:bg-[#D2B48C] flex items-center gap-x-2 mb-16"><FaArrowLeft /> Back to home</button>
                </div>
                <div className="bg-[#F4F3F0] w-[1100px] px-[112px] flex flex-col justify-center rounded-md py-16">
                    <div className="w-[750px] mx-auto pb-8">
                        <h1 className="text-center pb-4 text-[45px] font-rancho secondary-h1 text-shadow-lg">Add New Coffee</h1>
                        <p className="text-center text-[18px] font-raleway primary-p">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here.</p>
                    </div>
                    <form onSubmit={handleAddCoffee}>
                        <div className="flex justify-center gap-6 mb-6">
                            <div className="w-full">
                                <span className="font-raleway">
                                    <p className="font-semibold text-[20px] pb-2">Name</p>
                                    <input type="text" name='name' className="w-full h-10 ps-3 rounded-md" placeholder="Enter coffee name" required/>
                                </span>
                                <span className="font-raleway">
                                    <p className="font-semibold pt-4 text-[20px] pb-2">Supplier</p>
                                    <input type="text" name='supplier' className="w-full h-10 ps-3 rounded-md" placeholder="Enter supplier name" required/>
                                </span>
                                <span className="font-raleway">
                                    <p className="font-semibold pt-4 text-[20px] pb-2">Category</p>
                                    <input type="text" name='category' className="w-full h-10 ps-3 rounded-md" placeholder="Enter category name" required/>
                                </span>
                                <span className="font-raleway">
                                    <p className="font-semibold pt-4 text-[20px] pb-2">Photo</p>
                                    <input type="file" name="photo" accept="image/*" className="w-full h-10 bg-[#FFF] pt-1.5 ps-3 rounded-md" placeholder="Enter photo file" required/>
                                </span>
                            </div>
                            <div className="w-full">
                                <span className="font-raleway">
                                    <p className="font-semibold text-[20px] pb-2">Base Price</p>
                                    <input type="text" name="basePrice" className="w-full h-10 ps-3 rounded-md" placeholder="Enter price" required/>
                                </span>
                                <span className="font-raleway">
                                    <p className="font-semibold text-[20px] pt-4 pb-2">Sells Price</p>
                                    <input type="text" name="sellsPrice" className="w-full h-10 ps-3 rounded-md" placeholder="Enter price" required/>
                                </span>
                                <span className="font-raleway">
                                    <p className="font-semibold pt-4 text-[20px] pb-2">Available Quantity</p>
                                    <input type="text" name="quantity" className="w-full h-10 ps-3 rounded-md" placeholder="Enter quantity" required/>
                                </span>
                                <span className="font-raleway">
                                    <p className="font-semibold pt-4 text-[20px] pb-2">Taste</p>
                                    <input type="text" name="taste" className="w-full h-10 ps-3 rounded-md" placeholder="Enter coffee taste" required/>
                                </span>
                                <span className="font-raleway">
                                    <p className="font-semibold pt-4 text-[20px] pb-2">Details</p>
                                    <input type="text" name="details" className="w-full h-10 ps-3 rounded-md" placeholder="Enter details" required/>
                                </span>
                            </div>
                        </div>
                        <input type="submit" value="Add Coffee" className="btn w-full bg-[#D2B48C] outline outline-black hover:bg-[#D2B48C] text-[24px] font-rancho secondary-h1 text-shadow-lg" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCoffee;
