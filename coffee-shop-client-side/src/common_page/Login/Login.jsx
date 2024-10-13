import { Helmet } from "react-helmet";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import imgLogin from '../../assets/image/loginImg.jpg'
import { AiTwotoneEye } from "react-icons/ai";
import { useContext, useState } from "react";
import { IoMdEyeOff } from "react-icons/io";
import { AuthContext } from "../../providers/AuthProviders/AuthProviders";
import Swal from "sweetalert2";
import UseAxiosPublic from "../../custom_hook/UseAxiosPublic/UseAxiosPublic";

const Login = () => {
    const { signIn, logOut, resetPassword, googleSignIn, accountDelete } = useContext(AuthContext)
    const axiosPublic = UseAxiosPublic();
    const navigate = useNavigate();
    const handleLogin = e => {
        e.preventDefault()
        const email = e.target.email.value;
        const password = e.target.password.value;

        Swal.fire({
            title: 'Waiting for login...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        signIn(email, password).then(async (result) => {
            const lastLoginAt = result.user.reloadUserInfo.lastLoginAt;
            try {
                //
                const userCheckResponse = await axiosPublic.get('/userByEmail', { params: { email: email } });
                if (userCheckResponse.status === 200 && userCheckResponse.data.email === email) {
                    try {
                        const id = userCheckResponse.data._id;
                        const updateUser = { lastLoginAt }
                        const userUpdateResponse = await axiosPublic.patch(`/user/${id}`, updateUser);
                        if (userUpdateResponse.data.result.acknowledged) {
                            Swal.close();
                            navigate('/')
                            window.location.reload();

                        }
                    }
                    catch (error) {
                        logOut()
                        Swal.close();
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: `Invalid password or email.`,
                            showConfirmButton: true
                        });
                    }
                }
            }
            catch (error) {
                logOut()
                Swal.close();
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: `User Not Found!`,
                    showConfirmButton: true
                });
            }
        })
            .catch(() => {
                Swal.close();
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: `Invalid password or email.`,
                    showConfirmButton: false,
                    timer: 3000
                });
            })

    }

    const handleGoogleSignIn = () => {
        googleSignIn().then(async (result) => {
            const name = result.user.reloadUserInfo.displayName;
            const email = result.user.reloadUserInfo.email;
            const isPassword = false;
            const isEmailVerified = result.user.reloadUserInfo.emailVerified;
            const imageUrl = result.user.reloadUserInfo.photoUrl;
            const lastLoginAt = result.user.reloadUserInfo.lastLoginAt;
            const phone = '';
            const user = { name, email, phone, isPassword, isEmailVerified, imageUrl, lastLoginAt };
            console.log(user);

            try {
                const userCheckResponse = await fetch(`http://localhost:5000/userByEmail?email=${email}`);
                const userCheckData = await userCheckResponse.json();
                console.log('user check response', userCheckData);

                if (userCheckResponse.status === 200 && userCheckData.email === email) {
                    const id = userCheckData._id;
                    const updateUser = { isPassword, imageUrl, lastLoginAt, isEmailVerified };
                    const userUpdateResponse = await fetch(`http://localhost:5000/user/${id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updateUser)
                    });
                    const userUpdateData = await userUpdateResponse.json();
                    console.log('user update response', userUpdateData);

                    if (userUpdateData.result.acknowledged) {
                        navigate('/')
                        window.location.reload();
                    } else {
                        logOut();
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: `Failed to login! Try again.`,
                            showConfirmButton: true
                        });
                    }
                    return;
                }

            } catch (error) {
                console.log('user check response error', error)
            }

            try {
                const userResponse = await fetch('http://localhost:5000/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
                });
                console.log('userResponse', userResponse)
                const userResponseData = await userResponse.json();
                console.log('user insert response', userResponseData);

                if (userResponseData.insertedId) {
                    navigate('/')
                    window.location.reload();
                } else {
                    await accountDelete();
                    logOut();
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: `Failed to login! Try again.`,
                        showConfirmButton: true
                    });
                }
            }
            catch (error) {
                console.log('user post error', error)
            }

        }).catch(() => {
            Swal.fire({
                position: "center",
                icon: "error",
                title: `Failed to login! Try again.`,
                showConfirmButton: true
            });
        });
    };


    const handleForgetPassword = () => {
        Swal.fire({
            title: "Submit your  email",
            input: "email",
            inputAttributes: {
                autocapitalize: "off"
            },
            showCancelButton: true,
            confirmButtonText: "Reset Password",
            showLoaderOnConfirm: true,
            preConfirm: async (email) => {
                try {
                    const userCheckResponse = await axiosPublic.get('/userByEmail', { params: { email: email } });
                    if (userCheckResponse.status === 200 && userCheckResponse.data.email === email) {
                        resetPassword(email).then(() => {
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                html: `
                                <div class = "text-center font-raleway font-semibolt text-[20px]">
                                    <p class="pb-2">Password resent mail send.</p>
                                    <p>Please check you mail.</p>
                                </div>
                              `,
                                showConfirmButton: true,
                            });
                        })
                            .catch(() => {
                                Swal.fire({
                                    position: "center",
                                    icon: "error",
                                    title: `Invalid ! Please try again.`,
                                    showConfirmButton: false,
                                    timer: 3000
                                });
                            })

                    }
                }
                catch (error) {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        html: `
                        <div class = "text-center font-raleway font-semibolt text-[20px]">
                            <p class="pb-2">We not found your account!</p>
                            <p>Please create a account.</p>
                        </div>
                      `,
                        showConfirmButton: false,
                        timer: 3000
                    });
                }

            },
        })
    }

    const [show, setShow] = useState(false)
    return (
        <div className="mt-28 ms-28">
            <Helmet>
                <title>Espresso | Login</title>
            </Helmet>
            <div className="flex justify-center items-center me-20">
                <div>
                    <img src={imgLogin} alt="" className="w-[680px] h-[680px]" />
                </div>
                <div className=" w-[550px] py-12 border border-2 rounded-2xl  bg-[#ECEAE3]">
                    <div className="flex justify-center items-center ">
                        <form onSubmit={handleLogin} className="w-[60%]">
                            <h1 className="text-center font-rancho text-[30px]">Log in </h1>

                            <span className="font-raleway">
                                <p className="font-semibold	pt-4 text-[20px] pb-2">Email</p>
                                <input type="email" className="w-full h-10 ps-3 rounded-md" name="email" placeholder="Enter email " required />
                            </span>

                            <span className="font-raleway">
                                <p className="font-semibold	pt-4 text-[20px] pb-2">Enter Password</p>
                                <div className="flex items-center justify-end	">
                                    <input type={show ? "text" : "password"} className="w-full h-10 ps-3 rounded-md pe-1" name="password" placeholder="Enter password " required />
                                    {
                                        show ? <AiTwotoneEye className="absolute  me-[0.6px] bg-[#FFF] pe-1 w-[30px] h-[30px]" onClick={() => setShow(!show)} /> : <IoMdEyeOff className="absolute  me-[0.6px] bg-[#FFF] pe-1 w-[30px] h-[30px]" onClick={() => setShow(!show)} />
                                    }
                                </div>
                                <label className="label">
                                    <button onClick={handleForgetPassword} className="font-bold label-text-alt link link-hover">Forgot password?</button>
                                </label>
                            </span>

                            <input type="Submit" value="Login" className="mt-4 btn w-full bg-[#D2B48C] outline outline-black hover:bg-[#D2B48C] text-[24px]	font-rancho secondary-h1 text-shadow-lg" />

                        </form>
                    </div>
                    <div className=" space-y-0.5 mt-4">
                        <p className="text-center text-[18px] font-inter text-[#737373] font-medium	">Or Login with</p>
                        <div className="flex justify-center gap-x-3">
                            <button onClick={handleGoogleSignIn} className="bg-[#F5F5F8] rounded-full h-[55px] w-[55px] flex items-center justify-center">
                                <FcGoogle className=" w-[31px] h-[31px] " />
                            </button>

                            <button data-tip="This button is not activate" className="tooltip tooltip-bottom bg-[#F5F5F8] rounded-full h-[55px] w-[55px] flex items-center justify-center">
                                <FaFacebookF className="text-[#3B5998] w-[31px] h-[31px] " />
                            </button>
                        </div>
                        <p className="text-center text-[18px] font-inter text-[#737373] font-medium	">Are you new? <Link to='/registration'><span className="text-[#FF3811]">Create Account</span></Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;