

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProviders/AuthProviders";
import { Helmet } from "react-helmet";
import UseAxiosPublic from "../../custom_hook/UseAxiosPublic/UseAxiosPublic";
import useEmployee from "../../custom_hook/useEmployee/useEmployee";
import useAdmin from "../../custom_hook/useAdmin/useAdmin";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../custom_hook/UseAxiosSecure/UseAxiosSecure";
import { useNavigate } from "react-router-dom";

const AdminEmployeeProfile = () => {
    const { user1, userLoading, signIn, accountDelete, createUser, googleSignIn, passwordUpdate } = useContext(AuthContext);
    const [isemployee, isEmployeeLoading] = useEmployee();
    const [isadmin, isAdminLoading] = useAdmin();
    const axiosPublic = UseAxiosPublic();
    const axiosSecure = UseAxiosSecure();
    const [DBuser, setDBuser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchUserData = async () => {
            if (isemployee || isadmin) {
                try {
                    const response1 = await axiosPublic.get('/employeeByEmail', { params: { email: user1.email } });
                    const response2 = await axiosPublic.get('/userByEmail', { params: { email: user1.email } });
                    if (response1 && response2) {
                        const lastLoginAt = response2.data.lastLoginAt
                        const isPassword = response2.data.isPassword
                        const user = { ...response1.data, lastLoginAt, isPassword };
                        setDBuser(user);
                    }
                } catch (error) {
                    console.error('Error fetching employee or admin data:', error);
                }
                setIsLoading(false);
            }

        };


        fetchUserData();

    }, [user1, isemployee, isadmin, axiosPublic]);

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
                        <li>1. You lost your account</li>
                        <li>2. If you again try to login, must be create account.</li>
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
                        <li>1. You lost your account</li>
                        <li>2. If you again try to login, must be create account.</li>
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

    const updatePassword = () => {
        Swal.fire({
            title: "Please give your previous password",
            input: "password",
            inputAttributes: {
                autocapitalize: "off"
            },
            showCancelButton: true,
            confirmButtonText: "Submit",
            preConfirm: async (password) => {
                signIn(DBuser.email, password).then(async () => {
                    Swal.fire({
                        title: "Please new password",
                        input: "password",
                        inputAttributes: {
                            autocapitalize: "off"
                        },
                        showDenyButton: true,
                        denyButtonText: `Cancle`,
                        confirmButtonText: "Update Password",
                        preConfirm: async (password) => {
                            passwordUpdate(password).then(() => {
                                Swal.fire({
                                    position: "center",
                                    icon: "success",
                                    title: "Your password has been updated.",
                                    showConfirmButton: false,
                                    timer: 3000
                                });
                                navigate('/login')
                                window.location.reload();
                            }).catch(() => {
                                Swal.fire({
                                    position: "center",
                                    icon: "error",
                                    title: `Faild to update your password.`,
                                    showConfirmButton: true
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        window.location.reload();
                                    }
                                });
                            })
                        }
                    })
                        .then((result) => {
                            console.log(result)
                            if (result.isDenied) {
                                window.location.reload();
                            }
                            if (!result.isConfirmed) {
                                window.location.reload();
                            }
                        });
                })
                    .catch(() => {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: `Give right password.`,
                            showConfirmButton: true
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload();
                            }
                        });
                    })
            },
            footer: '<p style="text-align: center;"><span style="font-weight: 600;">Note:</span> After password update,  you automatically log out from this site. You must login with new password</p>'
        })

    }

    return (
        <div className="mt-28 ms-28 mb-12">
            <Helmet>
                <title>Espresso | Profile</title>
            </Helmet>
            {
                (isLoading || userLoading || isAdminLoading || isEmployeeLoading) ?
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
                        <div className="flex justify-center items-center gap-x-8">
                            <div className="skeleton h-[200px] w-[400px]"></div>
                            <div className="skeleton h-[200px] w-[400px]"></div>

                        </div>
                    </div>
                    :
                    <>
                        {
                            (isemployee || isadmin) && DBuser && (
                                <div>
                                    <h1 className="text-center mt-12 font-rancho text-[30px] mb-6">Hi, {DBuser.name}</h1>
                                    <div className="flex flex-col justify-center items-center">
                                        <div className="">
                                            {
                                                DBuser.imageUrl === '' ? <img src="https://i.ibb.co/7nW6YY8/avatar.png" alt="" className="w-[200px] h-[200px]  rounded-full " /> : <img src={DBuser.imageUrl} alt="" className="w-[200px] h-[200px]  rounded-full " />
                                            }
                                        </div>
                                        <div className="flex font-inter text-[18px] gap-x-10 ms-32">
                                            <div className="space-y-2">
                                                <p className="border-b-2 border-teal-300 pb-1 ">Name: {DBuser.name}</p>
                                                <p className="border-b-2 border-teal-300 pb-1 ">Phone Number: {DBuser?.phone}</p>
                                                <p className="border-b-2 border-teal-300 pb-1 ">Salary: {DBuser.salary}</p>
                                                <p className="border-b-2 border-teal-300 pb-1 ">Join Date: {DBuser.joinDate}</p>
                                                <p className="border-b-2 border-teal-300 pb-1 ">NID: {DBuser.nid}</p>
                                            </div>
                                            <div className="space-y-2 ms-32">
                                                <p className="border-b-2 border-teal-300 pb-1 ">Email: {DBuser.email}</p>
                                                <p className="border-b-2 border-teal-300 pb-1 ">Address: {DBuser.address}</p>
                                                <p className="border-b-2 border-teal-300 pb-1 ">Designation: {DBuser.designation}</p>
                                                <p className="border-b-2 border-teal-300 pb-1 ">Last Login: {formatDateTime(DBuser.lastLoginAt || 0)}</p>
                                                <p className="border-b-2 border-teal-300 pb-1 ">Employee ID: {DBuser.employee_id}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        <div className="divider divider-error mt-32 mb-16 font-inter ">Danger Zone </div>
                        <div className="flex justify-center items-center gap-x-8">
                            <div>
                                {
                                    DBuser?.isPassword ? <div className=" bg-red-400 p-24 w-[400px] flex justify-center items-center rounded-md">
                                        <button onClick={handleDeleteAccountByPassword} className="btn">Delete Account</button>
                                    </div> : <div className=" bg-red-400 p-24 w-[400px] flex justify-center items-center rounded-md">
                                        <button onClick={handleDeleteAccountByText} className="btn">Delete Account</button>
                                    </div>
                                }
                            </div>
                            <div>
                                {
                                    DBuser?.isPassword ?
                                        <>
                                            <div className="flex justify-center items-center">
                                                <div className="bg-yellow-300 p-24 w-[400px] flex justify-center items-center rounded-md">
                                                    <button onClick={updatePassword} className="btn">Update Password</button>
                                                </div>
                                            </div>
                                        </> : null
                                }
                            </div>
                        </div>
                    </>
            }
        </div>
    );
};

export default AdminEmployeeProfile;
