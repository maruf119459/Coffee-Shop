import { Helmet } from "react-helmet";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../custom_hook/UseAxiosSecure/UseAxiosSecure";

const img_hosting_key = 'f4bad12b7d481fe4bafabe514b16b077';
const img_hosting_api = `https://api.imgbb.com/1/upload?key=${img_hosting_key}`;

const UpdateCoffee = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const coffee = useLoaderData();
    console.log(coffee)

    const axiosSecure = UseAxiosSecure();

    const goBack = () => {
        navigate(location.state);
    };

    const handleUpdateCoffee = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Updating coffee...',
            text: 'Please wait while the coffee is being updated.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const photo = e.target.photo.files[0];
        const updatecoffee = async (imageUrl, photo_delete_url) => {
            const name = e.target.name.value;
            const supplier = e.target.supplier.value;
            const category = e.target.category.value;
            const basePrice = parseFloat(e.target.basePrice.value);
            const sellsPrice = parseFloat(e.target.sellsPrice.value);
            const taste = e.target.taste.value;
            const details = e.target.details.value;
            const availableQuantity = parseInt(e.target.availableQuantity.value);
            const updatedcoffee = { name, supplier, category, imageUrl, basePrice, sellsPrice, taste, details, availableQuantity, photo_delete_url };
            try {
                const response = await axiosSecure.put(`/coffee/${coffee._id}`, updatedcoffee);
                Swal.close();
                console.log(response)
                if (response.data.result.acknowledged) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: `Successfully updated coffee.`,
                        showConfirmButton: false,
                        timer: 3000
                    });
                } else {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: `Failed to update coffee! Try again.`,
                        showConfirmButton: true
                    });
                }
            } catch (error) {
                Swal.close();
                if (error.response && error.response.data && error.response.data.error) {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: `Failed to update coffee! ${error.response.data.error}`,
                        showConfirmButton: true
                    });
                } else {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: `Failed to update coffee! Try again.`,
                        showConfirmButton: true
                    });
                }
            }
        };

        if (photo) {
            const formData = new FormData();
            formData.append('image', photo);
            try {
                const res = await axiosSecure.post(img_hosting_api, formData, {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                });

                if (res.data.success) {
                    /*

                         const deleteResponse = await axiosSecure.delete(employee.photo_delete_url)

                    */
                    const photo_delete_url = res.data.data.delete_url;
                    const display_url = res.data.data.display_url;
                    updatecoffee(display_url, photo_delete_url);
                }
            } catch (error) {
                Swal.close();
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: `Failed to upload image! Try again.`,
                    showConfirmButton: true
                });
            }
        } else {
            updatecoffee(coffee.imageUrl, coffee.photo_delete_url);
        }
    };

    return (
        <div className="ms-28 mt-28">
            <Helmet>
                <title>Espresso Emporium | Update Coffee</title>
            </Helmet>
            <div className="flex flex-col justify-center items-center mb-[120px]">
                <div className="me-[950px]">
                    <button onClick={goBack} className="text-[25px] rounded-xl pt-3 pb-2 px-2 font-rancho secondary-h1 text-shadow-lg hover:bg-[#D2B48C] flex items-center gap-x-2 mb-16">
                        <FaArrowLeft />{location.state === '/' ? 'Back to Home' : 'Go Back'}
                    </button>
                </div>
                <div className="bg-[#F4F3F0] w-[1100px] px-[112px] flex flex-col justify-center rounded-md py-16">
                    <div className="w-[750px] mx-auto pb-8">
                        <h1 className="text-center pb-4 text-[45px] font-rancho secondary-h1 text-shadow-lg">Update Existing Coffee Details</h1>
                        <p className="text-center text-[18px] font-raleway primary-p">
                            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here.
                        </p>
                    </div>
                    <form onSubmit={handleUpdateCoffee}>
                        <div className="flex justify-center gap-6 mb-6">
                            <div className="w-full">
                                <span className="font-raleway">
                                    <p className="font-semibold text-[20px] pb-2">Name</p>
                                    <input type="text" className="w-full h-10 ps-3 rounded-md" placeholder="Enter coffee name" name="name" defaultValue={coffee.name} required />
                                </span>
                                <span className="font-raleway">
                                    <p className="font-semibold pt-4 text-[20px] pb-2">Supplier</p>
                                    <input type="text" className="w-full h-10 ps-3 rounded-md" placeholder="Enter supplier name" name="supplier" defaultValue={coffee.supplier} required />
                                </span>
                                <span className="font-raleway">
                                    <p className="font-semibold pt-4 text-[20px] pb-2">Category</p>
                                    <input type="text" className="w-full h-10 ps-3 rounded-md" placeholder="Enter category name" name="category" defaultValue={coffee.category} required />
                                </span>
                                <span className="font-raleway">
                                    <p className="font-semibold pt-4 text-[20px] pb-2">Photo</p>
                                    <input type="file" accept="image/*" className="w-full h-10 bg-[#FFF] pt-1.5 ps-3 rounded-md" placeholder="Enter photo file" name="photo" />
                                </span>
                            </div>
                            <div className="w-full">
                                <span className="font-raleway">
                                    <p className="font-semibold text-[20px] pb-2">Base Price</p>
                                    <input type="text" className="w-full h-10 ps-3 rounded-md" placeholder="Enter price" name="basePrice" defaultValue={coffee.basePrice} required />
                                </span>
                                <span className="font-raleway">
                                    <p className="font-semibold text-[20px] pb-2">Sells Price</p>
                                    <input type="text" className="w-full h-10 ps-3 rounded-md" placeholder="Enter price" name="sellsPrice" defaultValue={coffee.sellsPrice} required />
                                </span>
                                <span className="font-raleway">
                                    <p className="font-semibold pt-4 text-[20px] pb-2">Available Quantity</p>
                                    <input type="text" className="w-full h-10 ps-3 rounded-md" placeholder="Enter quantity" name="availableQuantity" defaultValue={coffee.availableQuantity} required />
                                </span>
                                <span className="font-raleway">
                                    <p className="font-semibold pt-4 text-[20px] pb-2">Taste</p>
                                    <input type="text" className="w-full h-10 ps-3 rounded-md" placeholder="Enter coffee taste" name="taste" defaultValue={coffee.taste} required />
                                </span>
                                <span className="font-raleway">
                                    <p className="font-semibold pt-4 text-[20px] pb-2">Details</p>
                                    <input type="text" className="w-full h-10 ps-3 rounded-md" placeholder="Enter details" name="details" defaultValue={coffee.details} required />
                                </span>
                            </div>
                        </div>
                        <input type="Submit" value="Update Coffee" className="btn w-full bg-[#D2B48C] outline outline-black hover:bg-[#D2B48C] text-[24px] font-rancho secondary-h1 text-shadow-lg" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateCoffee;
