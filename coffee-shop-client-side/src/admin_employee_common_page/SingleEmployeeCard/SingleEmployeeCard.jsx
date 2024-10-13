import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProviders/AuthProviders';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../../custom_hook/UseAxiosSecure/UseAxiosSecure';

const SingleEmployeeCard = ({ employee, handleCheckboxChange, selectedEmployeeIds, refetch, payButtonStatus }) => {
    const { user1, isAdmin } = useContext(AuthContext)
    const admin = isAdmin && user1;
    const axiosSecure = UseAxiosSecure();

    const handleEmployeeDeleteBtn = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/employee/${id}`);
                    Swal.fire({
                        title: "Deleted!",
                        text: "Empoyee has been deleted.",
                        icon: "success"
                    });
                    refetch();
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Failed to delete employee!",
                    });
                }
            }
        });
    };
    const [, setIsChecked] = useState(false)

    const handleCheckBox = e => {
        let checked = e.target.checked;
        setIsChecked(checked)
        handleCheckboxChange(employee._id, checked);
    }

    const handlePaySalary = async () => {
        // console.log('present paySalaryDate ', employee.paySalaryDate)
        Swal.fire({
            title: 'Pay salary...',
            text: 'Please wait.....',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const today = new Date();
        const notificationDay = String(today.getDate()).padStart(2, '0');
        const notificationMonth = String(today.getMonth() + 1).padStart(2, '0');
        const notificationYear = today.getFullYear();
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let hours = today.getHours();
        const minutes = String(today.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const employeeNotificationTitle = `Salary ${months[today.getMonth()]}`;
        const employeeNotificationDateTime = `${hours}:${minutes} ${ampm} ${notificationDay}-${notificationMonth}-${notificationYear}`;
        const employeeNotificationDetais = `Dear staf, your salary in your account. Please check you back account. Salary amount: ${employee.salary}. Date: ${employeeNotificationDateTime}`;
        const employeeId = parseInt(employee.employee_id);

        const employeeNotification = { employeeId, notificationStatus: 'unread', employeeNotificationTitle, employeeNotificationDateTime, employeeNotificationDetais, }
        //employeeNotification post in employeeNotificationCollection 
        const employeeNotificationresponse = await axiosSecure.post('/employeeNotification', employeeNotification);

        if (employeeNotificationresponse.data.message) {
            //
            const currentYear = today.getFullYear();
            const currentMonth = today.getMonth();

            // Get the first date of the next month
            const nextMonthFirst = new Date(currentYear, currentMonth + 1, 1);

            const year = nextMonthFirst.getFullYear();
            const month = String(nextMonthFirst.getMonth() + 1).padStart(2, '0');
            const day = String(nextMonthFirst.getDate()).padStart(2, '0');
            const paySalaryDate = `${year}-${month}-${day}`;
            console.log('next salary date',paySalaryDate)

            const updatedEmployee = { paySalaryDate };
            const response = await axiosSecure.put(`/employee/${employee._id}`, updatedEmployee);
            if (response.data.acknowledged) {
                Swal.close();
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `Successfully salary pay.`,
                    showConfirmButton: false,
                    timer: 3000
                });
            } else {
                Swal.close();
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: `Failed to pay salary! Try again.`,
                    showConfirmButton: true
                });
            }
        } else {

            Swal.close();
            Swal.fire({
                position: "center",
                icon: "error",
                title: `Failed to pay salary! Try again.`,
                showConfirmButton: true
            });
        }

        refetch();


    }

    return (
        <div className='bg-[#ECEAE3]	my-4 rounded-md items-center	'>
            <div className='p-2 flex justify-between items-center px-6 font-poppins text-[#331A15]'>
                {
                    admin && <div>
                        <input onChange={handleCheckBox} name="checked" type="checkbox" className="checkbox mt-7 bg-[#fff]" />
                    </div>
                }
                <div className='w-[80px] h-[80px]'>
                    <img src={employee.imageUrl} alt="" className='w-[80px] h-[80px] rounded-md' />
                </div>
                <div className='w-[350px]'>
                    <p className='font-semibold text-[20px] py-1'>Name: {employee.name}</p>
                    <p className='font-semibold text-[20px]'>Designation: {employee.designation}</p>
                </div>
                <div>
                    <p className='font-semibold text-[20px] py-1'>ID: {employee.employee_id}</p>
                    <p className='font-semibold text-[20px]'>Age: {employee.age}</p>
                </div>
                <div className='text-[#FFF]'>
                    {admin && <button onClick={handlePaySalary} disabled={payButtonStatus} className={selectedEmployeeIds.length > 0 ? 'btn btn-success  mt-[15px] me-4 btn  btn-disabled' : 'btn-success   mt-[15px] me-4 btn'}>Pay Salary</button>}
                    {admin && <Link to={`/viewEmployeeDetails/${employee._id}`}><button className={selectedEmployeeIds.length > 0 ? 'bg-[#D2B48C]  mt-[15px] me-4 btn  btn-disabled' : 'bg-[#D2B48C]  mt-[15px] me-4 btn'}>View</button></Link>}
                    {admin && <Link to={`/updateEmployee/${employee._id}`}><button className={selectedEmployeeIds.length > 0 ? 'btn me-4 bg-[#3C393B] text-[#FFF] btn-disabled' : 'btn me-4 bg-[#3C393B] text-[#FFF]'}>Update</button></Link>}
                    {
                        selectedEmployeeIds.length > 0 ? '' : admin && <button className='btn bg-[#EA4744]' onClick={() => handleEmployeeDeleteBtn(employee._id)} >Delete</button>
                    }
                </div>
            </div>
        </div>
    );
};

export default SingleEmployeeCard;

SingleEmployeeCard.propTypes = {
    employee: PropTypes.any.isRequired,
    payButtonStatus: PropTypes.any.isRequired,
    handleCheckboxChange: PropTypes.func,
    refetch: PropTypes.func,
    selectedEmployeeIds: PropTypes.array
};