import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProviders/AuthProviders";
import { Helmet } from "react-helmet";
import useEmployee from "../../custom_hook/useEmployee/useEmployee";
import useAdmin from "../../custom_hook/useAdmin/useAdmin";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import UseAxiosSecure from "../../custom_hook/UseAxiosSecure/UseAxiosSecure";

const ViewProfile = () => {
    const { user1, userLoading, signIn, accountDelete, createUser, googleSignIn } = useContext(AuthContext);
    const [isemployee, ] = useEmployee();
    const [isadmin, ] = useAdmin();
    const axiosSecure = UseAxiosSecure()
    const [DBuser, setDBuser] = useState(null);
    console.log(DBuser)
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [histories, setHistories] = useState([]);



    useEffect(() => {
        const fetchUserData = async () => {
            if ((!isemployee && !isadmin) && user1) {
                try {
                    const response = await axiosSecure.get('/userByEmail', { params: { email: user1.email } });
                    setDBuser(response.data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
                setIsLoading(false);
            }
        };


        fetchUserData();

    }, [user1, isemployee, isadmin, axiosSecure]);

 
    useEffect(()=>{
     const loadHistoriesData =async () =>{
         try {
             const response = await axiosSecure.get(`/orders/${user1.email}/delivered`);
             setHistories(response.data);
         } catch (error) {
             console.error(`Error fetching  histories data:`, error);
         }
     }
     loadHistoriesData();
    },[user1.email,axiosSecure])

    // console.log(DBuser.isPassword)

    const formatDateTime = (milliseconds) => {
        const time = parseInt(milliseconds)
        const date = new Date(time);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${hours}:${minutes}; ${day}-${month}-${year}`;
    };

    const handleDeleteAccountByPassword = async () => {
        const { value: accept } = await Swal.fire({
            title: "Terms and conditions",
            html: `
                <div style="display: flex;flex-direction: column;justify-content: center; align-items: center;">
                    <ul style="text-align: start;">
                        <li>1. We remove your cart product.</li>
                        <li>2. We remove your payment history.</li>
                        <li>3. We remove all your other data.</li>
                    </ul>
                </div>
             `,
            input: "checkbox",
            inputValue: 1,
            inputPlaceholder: `
              I agree with the terms and conditions
            `,
            confirmButtonText: `
              Continue&nbsp;<i class="fa fa-arrow-right"></i>
            `,
            inputValidator: (result) => {
                return !result && "You need to agree with T&C";
            }
        });
        if (accept) {
            Swal.fire({
                title: "Please give your password",
                input: "password",
                inputAttributes: {
                    autocapitalize: "off"
                },
                showCancelButton: true,
                confirmButtonText: "Delete Account",
                showLoaderOnConfirm: true,
                preConfirm: async (password) => {
                    signIn(DBuser.email, password).then(async (result) => {
                        accountDelete(result.user).then(async () => {
                            try {
                                const deleteResponse = await axiosSecure.delete(`/user/${DBuser._id}`)
                                if (deleteResponse.status === 200) {
                                    Swal.fire({
                                        position: "center",
                                        icon: "success",
                                        title: "Your account has been deleted.",
                                        showConfirmButton: false,
                                        timer: 3000
                                    });
                                } else {
                                    throw new Error("Failed to delete account.");
                                }
                            }
                            catch (error) {
                                createUser(DBuser.email, password).then(async () => {
                                    Swal.fire({
                                        position: "center",
                                        icon: "error",
                                        title: "Failed to delete your account.",
                                        showConfirmButton: true
                                    });
                                })

                            }
                            navigate('/login')
                        })
                            .catch(() => {
                                Swal.fire({
                                    position: "center",
                                    icon: "error",
                                    title: `Faild to delete your account.`,
                                    showConfirmButton: true
                                });
                            })

                    })
                        .catch(() => {
                            Swal.fire({
                                position: "center",
                                icon: "error",
                                title: `Faild to delete your account.`,
                                showConfirmButton: true
                            });
                        })

                },
            }
            )
        }

    }

    const handleDeleteAccountByText = async () => {
        const { value: accept } = await Swal.fire({
            title: "Terms and conditions",
            html: `
                <div style="display: flex;flex-direction: column;justify-content: center; align-items: center;">
                    <ul style="text-align: start;">
                        <li>1. We remove your cart product.</li>
                        <li>2. We remove your payment history.</li>
                        <li>3. We remove all your other data.</li>
                    </ul>
                </div>
             `,
            input: "checkbox",
            inputValue: 1,
            inputPlaceholder: `
              I agree with the terms and conditions
            `,
            confirmButtonText: `
              Continue&nbsp;<i class="fa fa-arrow-right"></i>
            `,
            inputValidator: (result) => {
                return !result && "You need to agree with T&C";
            }
        });
        if (accept) {
            Swal.fire({
                title: "Please write 'Delete' word in the box ",
                input: "text",
                inputAttributes: {
                    autocapitalize: "off"
                },
                showCancelButton: true,
                confirmButtonText: "Delete Account",
                showLoaderOnConfirm: true,
                preConfirm: async (text) => {
                    console.log(typeof (text))
                    if (text == 'Delete') {
                        googleSignIn().then((result) => {
                            accountDelete(result.user).then(async () => {
                                try {
                                    const deleteResponse = await axiosSecure.delete(`/user/${DBuser._id}`)
                                    if (deleteResponse.status === 200) {
                                        Swal.fire({
                                            position: "center",
                                            icon: "success",
                                            title: "Your account has been deleted.",
                                            showConfirmButton: false,
                                            timer: 3000
                                        });
                                    } else {
                                        throw new Error("Failed to delete account.");
                                    }
                                }
                                catch (error) {
                                    googleSignIn().then(async () => {
                                        Swal.fire({
                                            position: "center",
                                            icon: "error",
                                            title: "Failed to delete your account.",
                                            showConfirmButton: true
                                        });
                                    })

                                }
                                navigate('/login')
                            })
                                .catch(() => {
                                    Swal.fire({
                                        position: "center",
                                        icon: "error",
                                        title: `Faild to delete your account.`,
                                        showConfirmButton: true
                                    });
                                })
                        })
                            .catch(() => {
                                Swal.fire({
                                    position: "center",
                                    icon: "error",
                                    title: `Faild to delete your account.`,
                                    showConfirmButton: true
                                });
                            })
                    }
                    else {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: `Faild to delete your account.`,
                            showConfirmButton: true
                        });
                    }


                }
            }
            )
        }
    }

    return (
        <div className="mt-28 ms-20 mb-20">
            <Helmet>
                <title>Espresso | Profile</title>
            </Helmet>
            {
                (isLoading || userLoading ) ?
                    <div className="flex flex-col justify-center items-center">
                        <div className="skeleton w-[200px] h-[200px] shrink-0 rounded-full  mt-12 mb-3"></div>

                        <div className="flex font-inter text-[18px] gap-x-10 ">
                            <div className="flex flex-col gap-4">
                                <div className="skeleton h-4 w-56 mt-2"></div>
                                <div className="skeleton h-4 w-56 mt-2"></div>
                                <div className="skeleton h-4 w-56 mt-2"></div>
                                <div className="skeleton h-4 w-56 mt-2"></div>
                                <div className="skeleton h-4 w-56 mt-2"></div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="skeleton h-4 w-56 mt-2"></div>
                                <div className="skeleton h-4 w-56 mt-2"></div>
                                <div className="skeleton h-4 w-56 mt-2"></div>
                                <div className="skeleton h-4 w-56 mt-2"></div>
                                <div className="skeleton h-4 w-56 mt-2"></div>
                            </div>
                        </div>
                        <div className="skeleton w-full h-[2px] mt-32 mb-16 font-inter "> </div>
                        <div className="skeleton h-[200px] w-[400px]"></div>

                    </div>
                    :
                    <>
                        {
                            (!isemployee && !isadmin) && DBuser && (
                                <div className="flex flex-col justify-center items-center">
                                    <h1 className="text-center mt-12 font-rancho text-[30px] mb-6">Hi, {DBuser.name}</h1>
                                    <div className="flex flex-col justify-center items-center">
                                        <div className="">
                                            {
                                                DBuser.imageUrl === '' ? <img src="https://i.ibb.co/7nW6YY8/avatar.png" alt="" className="w-[200px] h-[200px]  rounded-full " /> : <img src={DBuser.imageUrl} alt="" className="w-[200px] h-[200px]  rounded-full " />
                                            }
                                        </div>
                                        <div className="flex font-inter text-[18px] gap-x-10 ms-32">
                                            <div className="space-y-2">
                                                <p className="border-b-2 border-teal-300 pb-1 ">Name: {DBuser?.name}</p>
                                                <p className="border-b-2 border-teal-300 pb-1 ">Phone Number: {DBuser?.phone}</p>
                                                <p className="border-b-2 border-teal-300 pb-1 ">Last Login: {formatDateTime(DBuser.lastLoginAt || 0)}</p>
                                            </div>
                                            <div className="space-y-2 ms-32">
                                                <p className="border-b-2 border-teal-300 pb-1 ">Email: {DBuser?.email}</p>
                                                <p className="border-b-2 border-teal-300 pb-1 ">Address: {DBuser?.address}</p>
                                                <p className="border-b-2 border-teal-300 pb-1 ">Total Purchase: {histories?.length || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        <div className="divider divider-error mt-32 mb-16 font-inter ">Danger Zone </div>
                        <div className="flex justify-center items-center">
                            {
                                DBuser?.isPassword ? <div className=" bg-red-400 p-24 w-[400px] flex justify-center items-center rounded-md">
                                    <button onClick={handleDeleteAccountByPassword} className="btn">Delete Account</button>
                                </div> : <div className=" bg-red-400 p-24 w-[400px] flex justify-center items-center rounded-md">
                                    <button onClick={handleDeleteAccountByText} className="btn">Delete Account</button>
                                </div>
                            }
                        </div>
                    </>
            }
        </div>
    );
};

export default ViewProfile;

