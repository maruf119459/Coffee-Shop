import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import UseAxiosSecure from "../../custom_hook/UseAxiosSecure/UseAxiosSecure";
import Swal from "sweetalert2";

const img_hosting_key = 'f4bad12b7d481fe4bafabe514b16b077';
const img_hosting_api = `https://api.imgbb.com/1/upload?key=${img_hosting_key}`;

const AddEmployee = () => {
    const navigate = useNavigate();
    const axiosSecure = UseAxiosSecure();
    const goBackHome = () => {
        navigate('/');
    }

    const handleAddEmployee = async (e) => {
        e.preventDefault();

        const photo = e.target.photo.files[0]; // Get the file from input
        const formData = new FormData();
        formData.append('image', photo);
        // console.log('from date',formData)
        // console.log('photo',e.target.photo.files[0])
        Swal.fire({
            title: 'Adding Employee...',
            text: 'Please wait while the employee is being added.',
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
            // console.log('photo insert info ',res.data);
            if (res.data.success) {
                const imageUrl = res.data.data.display_url;
                const photo_delete_url = res.data.data.delete_url;
                const name = e.target.name.value;
                const age = parseInt(e.target.age.value);
                const nid = e.target.nid.value;
                const joinDate = e.target.joinDate.value;


                const today = new Date();
                const currentYear = today.getFullYear();
                const currentMonth = today.getMonth();

                // Get the first date of the next month
                const nextMonthFirst = new Date(currentYear, currentMonth + 1, 1);

                // Calculate the difference in time (milliseconds)
               



             
                const yearx = nextMonthFirst.getFullYear();
                const monthx = String(nextMonthFirst.getMonth() + 1).padStart(2, '0');
                const day = String(nextMonthFirst.getDate()).padStart(2, '0');
                const paySalaryDate = `${yearx}-${monthx}-${day}`;

                const [year, month,] = joinDate.split('-');
                const lastTwoDigitsOfYear = year.slice(-2).toString();
                const twoDigitMonth = month.toString();
                const combinedString = lastTwoDigitsOfYear + twoDigitMonth;
                let employeeCount = await axiosSecure.get('/employeeCount');
                employeeCount = employeeCount.data + 1110;
                const employee_id = parseInt(combinedString + employeeCount);
                const salary = parseInt(e.target.salary.value);
                const designation = e.target.designation.value;
                const email = e.target.email.value;
                const phone = e.target.phone.value;
                const address = e.target.address.value;
                let userType = '';
                if (designation === 'Manager') {
                    userType = 'admin';
                }
                else {
                    userType = 'employee'
                }
                const employee = { name, age, nid, joinDate, salary, designation, email, phone, address, imageUrl, userType, employee_id, photo_delete_url, paySalaryDate }
                // console.log(name, age, nid, joinDate, salary, designation, email, address, imageUrl, userType);
                // console.log(employee)
                const employeeResponse = await axiosSecure.post('/employee', employee);
                // console.log('employee insert info ',employeeResponse.data)
                console.log(employeeResponse)

                Swal.close();

                if (employeeResponse.data.insertedId) {
                    // show success popup
                    e.target.reset();
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: `successfully add ${name}.`,
                        showConfirmButton: false,
                        timer: 3000
                    });
                }
                else {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: `Faild to add employee! Try again.`,
                        showConfirmButton: true
                    });
                }

            }


            // console.log(name, age, nid, joinDate, salary, designation, email, address, imageUrl);
            // Proceed with storing the employee data along with the image URL
        } catch (error) {
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
                <title>Espresso Emporium | Add Employee</title>
            </Helmet>
            <div className="flex flex-col justify-center items-center mb-[120px] ">
                <div className="me-[950px]">
                    <button onClick={goBackHome} className=" text-[25px] rounded-xl pt-3 pb-2 px-2 font-rancho secondary-h1 text-shadow-lg hover:bg-[#D2B48C] flex items-center gap-x-2 mb-16"><FaArrowLeft /> Back to home</button>
                </div>
                <div className="bg-[#F4F3F0] w-[1100px] px-[112px]  flex flex-col justify-center rounded-md py-16">
                    <div className="w-[750px] mx-auto pb-8">
                        <h1 className="text-center pb-4 text-[45px] font-rancho secondary-h1 text-shadow-lg">Add a New Employee</h1>
                        <p className="text-center text-[18px] font-raleway primary-p">Fill up the below form with correct information.</p>
                    </div>
                    <form onSubmit={handleAddEmployee}>
                        <div className="flex justify-center gap-6 mb-6">
                            <div className="w-full">
                                <span className="font-raleway ">
                                    <p className="font-semibold text-[20px] pb-2">Name</p>
                                    <input type="text" name="name" className="w-full h-10 ps-3 rounded-md" placeholder="Enter employee name" required />
                                </span>
                                <span className="font-raleway ">
                                    <p className="font-semibold pt-4 text-[20px] pb-2">Age</p>
                                    <input type="text" name="age" className="w-full h-10 ps-3 rounded-md" placeholder="Enter employee age" required />
                                </span>
                                <span className="font-raleway ">
                                    <p className="font-semibold pt-4 text-[20px] pb-2">NID Number</p>
                                    <input type="text" name="nid" className="w-full h-10 ps-3 rounded-md" placeholder="Enter employee NID number" required />
                                </span>
                                <span className="font-raleway ">
                                    <p className="font-semibold pt-4 text-[20px] pb-2">Join Date</p>
                                    <input type="date" name="joinDate" className="w-full h-10 bg-[#FFF] pt-1.5 ps-3 rounded-md" required />
                                </span>
                                <span className="font-raleway ">
                                    <p className="font-semibold pt-4 text-[20px] pb-2">Photo</p>
                                    <input type="file" name="photo" accept="image/*" className="w-full h-10 bg-[#FFF] pt-1.5 ps-3 rounded-md" placeholder="Enter photo file" required />
                                </span>
                            </div>
                            <div className="w-full">
                                <span className="font-raleway ">
                                    <p className="font-semibold text-[20px] pb-2">Salary</p>
                                    <input type="text" name="salary" className="w-full h-10 ps-3 rounded-md" placeholder="Enter employee salary " required />
                                </span>

                                <span className="font-raleway">
                                    <p className="font-semibold pt-4 text-[20px] pb-2">Designation</p>
                                    <select name="designation" className="w-full h-10 px-3 rounded-md" required>
                                        <option disabled selected>Select employee designation</option>
                                        <option>Chef</option>
                                        <option>Servant</option>
                                        <option>Delivery Man</option>
                                        <option>Manager</option>
                                    </select>
                                </span>
                                <span className="font-raleway">
                                    <p className="font-semibold pt-4 text-[20px] pb-2">Email</p>
                                    <input type="text" name="email" className="w-full h-10 ps-3 rounded-md" placeholder="Enter employee email" required />
                                </span>
                                <span className="font-raleway">
                                    <p className="font-semibold pt-4 text-[20px] pb-2">Phone Number</p>
                                    <input type="text" name="phone" className="w-full h-10 ps-3 rounded-md" placeholder="Enter employee phone number" required />
                                </span>
                                <span className="font-raleway">
                                    <p className="font-semibold pt-4 text-[20px] pb-2">Address</p>
                                    <input type="text" name="address" className="w-full h-10 ps-3 rounded-md" placeholder="Enter employee address" required />
                                </span>
                            </div>
                        </div>
                        <input type="submit" value="Add Employee" className="btn w-full bg-[#D2B48C] outline outline-black hover:bg-[#D2B48C] text-[24px] font-rancho secondary-h1 text-shadow-lg" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddEmployee;
