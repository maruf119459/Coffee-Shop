import { Helmet } from "react-helmet";
import { useLoaderData, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../custom_hook/UseAxiosSecure/UseAxiosSecure";
const img_hosting_key = 'f4bad12b7d481fe4bafabe514b16b077';
const img_hosting_api = `https://api.imgbb.com/1/upload?key=${img_hosting_key}`;
const UpdateEmployee = () => {
    const [employee] = useLoaderData();
    console.log(employee)

    const axiosSecure = UseAxiosSecure();

    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1)
    }


    const handleUpdateEmployeeForm = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Updating Employee...',
            text: 'Please wait while the employee is being updated.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const photo = e.target.photo.files[0];

        const updateEmployee = async (imageUrl,photo_delete_url) => {
            const name = e.target.name.value;
            const age = parseInt(e.target.age.value);
            const nid = e.target.nid.value;
            const salary = parseInt(e.target.salary.value);
            const designation = e.target.designation.value;
            const address = e.target.address.value;
            let userType = '';
            if (designation === 'Manager') {
                userType = 'admin';
            } else {
                userType = 'employee';
            }
            const updatedEmployee = { name, age, nid, salary, designation, address, imageUrl,photo_delete_url, userType };
            try {
                const response = await axiosSecure.put(`/employee/${employee._id}`, updatedEmployee);
                Swal.close();
                console.log(response)
                if (response.data.acknowledged) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: `Successfully updated employee.`,
                        showConfirmButton: false,
                        timer: 3000
                    });
                } else {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: `Failed to update employee! Try again.`,
                        showConfirmButton: true
                    });
                }
            } catch (error) {
                Swal.close();
                console.log(error)
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
                
                console.log('photo', res)
                if (res.data.success) {
                    /*

                     const deleteResponse = await axiosSecure.delete(employee.photo_delete_url)

                    */
                    const photo_delete_url= res.data.data.delete_url;
                    const display_url = res.data.data.display_url;
                    updateEmployee(display_url, photo_delete_url);
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
            updateEmployee(employee.imageUrl, employee.photo_delete_url);
        }
    };

    return (
        <div className="ms-28 mt-28">
            <Helmet>
                <title>Espresso Emporium | Update Employee</title>
            </Helmet>
            <div className="flex flex-col justify-center items-center mb-[120px] ">
                <div className="me-[950px]">
                    <button onClick={goBack} className=" text-[25px] rounded-xl pt-3 pb-2 px-2 font-rancho secondary-h1 text-shadow-lg hover:bg-[#D2B48C] flex items-center gap-x-2 mb-16"><FaArrowLeft />Go Back</button>
                </div>
                <div className="bg-[#F4F3F0] w-[1100px] px-[112px]  flex flex-col justify-center rounded-md	 py-16">
                    <div className="w-[750px] mx-auto pb-8">
                        <h1 className="text-center pb-4 text-[45px] font-rancho secondary-h1 text-shadow-lg">{`Update ${employee.name}'s Information`}</h1>
                        <p className="text-center text-[18px] font-raleway primary-p">Fill up the below form with correct information.</p>
                    </div>
                    <form onSubmit={handleUpdateEmployeeForm} >
                        <div className="flex justify-center gap-6 mb-6">
                            <div className="w-full">
                                <span className="font-raleway ">
                                    <p className="font-semibold	 text-[20px] pb-2">Name</p>
                                    <input type="text" className="w-full h-10 ps-3 rounded-md" placeholder="Enter employee name" name="name" defaultValue={employee.name} required />
                                </span>
                                <span className="font-raleway ">
                                    <p className="font-semibold	pt-4 text-[20px] pb-2">Age</p>
                                    <input type="text" className="w-full h-10 ps-3 rounded-md" placeholder="Enter employee age" name="age" defaultValue={employee.age} required/>
                                </span>
                                <span className="font-raleway ">
                                    <p className="font-semibold	pt-4 text-[20px] pb-2">NID Number</p>
                                    <input type="text" className="w-full h-10 ps-3 rounded-md" placeholder="Enter employee NID number" name="nid" defaultValue={employee.nid} required/>
                                </span>
                                <span className="font-raleway ">
                                    <p className="font-semibold	pt-4 text-[20px] pb-2">Photo</p>
                                    <input type="file" accept="image/*" className="w-full h-10 bg-[#FFF] pt-1.5 ps-3 rounded-md" placeholder="Enter photo file" name="photo" />
                                </span>
                            </div>
                            <div className="w-full">
                                <span className="font-raleway ">
                                    <p className="font-semibold	 text-[20px] pb-2">Salary</p>
                                    <input type="text" className="w-full h-10 ps-3 rounded-md" placeholder="Enter employee Salary " name="salary" defaultValue={employee.salary} required/>
                                </span>

                                <span className="font-raleway">
                                    <p className="font-semibold	pt-4 text-[20px] pb-2">Designation</p>
                                    <select className="w-full h-10 ps-3 rounded-md" name="designation" >
                                        <option disabled selected>{employee.designation}</option>
                                        <option>Chef</option>
                                        <option>Servant</option>
                                        <option>Delivery Man</option>
                                        <option>Manager</option>
                                    </select>
                                </span>
                                <span className="font-raleway">
                                    <p className="font-semibold	pt-4 text-[20px] pb-2">Address</p>
                                    <input type="text" className="w-full h-10 ps-3 rounded-md" placeholder="Enter employee address" name="address" defaultValue={employee.address} required/>
                                </span>
                            </div>
                        </div>
                        <input type="Submit" value="Update Employee" className="btn w-full bg-[#D2B48C] outline outline-black hover:bg-[#D2B48C] text-[24px]	font-rancho secondary-h1 text-shadow-lg" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateEmployee;

//matchedCount