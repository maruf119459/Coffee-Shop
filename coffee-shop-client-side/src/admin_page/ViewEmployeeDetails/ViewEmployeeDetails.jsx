import { Helmet } from "react-helmet";
import { FaArrowLeft } from "react-icons/fa6";
import { useLoaderData, useNavigate } from "react-router-dom";


const ViewEmployeeDetails = () => {
    const [employee] = useLoaderData();
    console.log(employee)
    
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1)
    }
    return (
        <div className="ms-28 mt-28">
        <Helmet>
            <title>Update Employee | {employee.name} </title>
        </Helmet>
        <div className="flex flex-col justify-center items-center mb-[120px] ">
            <div className="me-[950px]">
                <button onClick={goBack} className=" text-[25px] rounded-xl pt-3 pb-2 px-2 font-rancho secondary-h1 text-shadow-lg hover:bg-[#D2B48C] flex items-center gap-x-2 mb-16"><FaArrowLeft />Go Back</button>
            </div>
            <div className="bg-[#F4F3F0] w-[1100px] px-[112px]  flex flex-col justify-center rounded-md	 py-16">
                <p className="text-center pb-7 text-[45px] font-rancho secondary-h1 text-shadow-lg">{`Mr.${employee.name}'s Profile`}</p>
                <div className="flex justify-center items-center justify-around	">
                    <div>
                        <img src={employee.imageUrl} alt="" className="w-[300px] h-[200px]" />
                    </div>
                    <div className="text-5 text-[#5C5B5B] font-raleway space-y-2.5">
                        <p><span className="font-semibold pe-2">Name:</span>{employee.name}</p>
                        <p><span className="font-semibold pe-2">Eamil:</span>{employee?.email}</p>
                        <p><span className="font-semibold pe-2">ID:</span><span className="font-poppins">{employee?.employee_id}</span></p>
                        <p><span className="font-semibold pe-2">Designation:</span>{employee?.designation}</p>
                        <p><span className="font-semibold pe-2">NID:</span><span className="font-poppins">{employee?.nid}</span></p>
                        <p><span className="font-semibold pe-2">Age:</span> <span className="font-poppins">{`${employee?.age} years old`}</span></p>
                        <p><span className="font-semibold pe-2">Salary:</span><span className="font-poppins">{`${employee?.salary} Tk`}</span></p>
                        <p><span className="font-semibold pe-2">Address:</span>{employee?.address}</p>
                        <p><span className="font-semibold pe-2">Join Date:</span>{employee?.joinDate} {`( yy-mm-dd )`}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default ViewEmployeeDetails;

