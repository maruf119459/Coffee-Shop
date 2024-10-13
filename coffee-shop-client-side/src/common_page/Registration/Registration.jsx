import { Helmet } from "react-helmet";
import { TypeAnimation } from 'react-type-animation';
import './style.css'
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AiTwotoneEye } from "react-icons/ai";
import { IoMdEyeOff } from "react-icons/io";
import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProviders/AuthProviders";
import UseAxiosPublic from "../../custom_hook/UseAxiosPublic/UseAxiosPublic";
import Swal from "sweetalert2";

const Registration = () => {
    const [error, setError] = useState(null);
    const [duplicateMailError, setDuplicateMailError] = useState(null);
    const { createUser, googleSignIn, logOut,accountDelete } = useContext(AuthContext);
    const axiosPublic = UseAxiosPublic();
    const [show, setShow] = useState(false)
    const [confrimShow, setConfrimShow] = useState(false)
    const navigate = useNavigate();

    // https://react-type-animation.netlify.app/examples   npm i react-type-animation password_1
    const handleRegistration = async e => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const phone = e.target.phone.value;
        const password_1 = e.target.password_1.value;
        const password_2 = e.target.password_2.value;
        console.log(name, email, phone, password_1, password_2)

        Swal.fire({
            title: 'Waiting for Registration...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        setDuplicateMailError(null)
        if (password_1 === password_2) {
            setError(null)
            const isPassword = true;
            const isEmailVerified = false;
            const imageUrl = '';
            const lastLoginAt = '';

            const user = { name, email, phone, isPassword, isEmailVerified, imageUrl, lastLoginAt }

            try {
                const userResponse = await axiosPublic.post('/user', user, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if (userResponse.data.insertedId) {
                    e.target.reset();
                    createUser(email, password_1).then(async result => {
                        Swal.close();
                        console.log(result);
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: `Hi ${name}. Your registration complete.`,
                            showConfirmButton: false,
                            timer: 3000
                        });
                        logOut()
                        navigate('/login')
                    }).catch(async (error) => {
                        const errorMessage = error.message;
                        console.log(errorMessage)
                        if (errorMessage === 'Firebase: Error (auth/email-already-in-use).') {
                            setDuplicateMailError('This email already used');
                        }
                        else {
                            // database theke user ke delete korte hobe
                            const deleteResponse = await axiosPublic.delete(`/user/${userResponse.data.insertedId}`)
                            console.log(deleteResponse)
                            Swal.fire({
                                position: "center",
                                icon: "error",
                                title: `Faild to complete registration! Try again.`,
                                showConfirmButton: true
                            });
                        }
                    });
                }
                else {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: `Faild to complete registration! Try again.`,
                        showConfirmButton: true
                    });
                }
            }
            catch (error) {
                Swal.close();
                setDuplicateMailError('This email already used');
            }
        }
        else {
            Swal.close();
            setError('Password does not match')
        }
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
            try {
                const userCheckResponse = await axiosPublic.get('/userByEmail', { params: { email: email } });
                if (userCheckResponse.status === 200 && userCheckResponse.data.email === email) {
                    try {
                        const id = userCheckResponse.data._id;
                        const updateUser = { isPassword, imageUrl, lastLoginAt, isEmailVerified }
                        const userUpdateResponse = await axiosPublic.patch(`/user/${id}`, updateUser);
                        if (userUpdateResponse.data.result.acknowledged) {
                            navigate('/')
                            window.location.reload();                            
                        }
                    }
                    catch (error) {
                        logOut()
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: `Faild to login! Try again.`,
                            showConfirmButton: true
                        });
                    }
                }
            } catch (error) {
                try {
                    const userResponse = await axiosPublic.post('/user', user, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    if (userResponse.data.insertedId) {
                        navigate('/')
                        window.location.reload();
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: `Wellcome ${name}.`,
                            showConfirmButton: false,
                            timer: 6000
                        });
                        window.location.reload();
                    }

                }
                catch (error) {
                    await accountDelete();
                    logOut()
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: `Faild to login! Try again.`,
                        showConfirmButton: true
                    });
                }
            }
            console.log(user);
        }).catch(() => {
            Swal.fire({
                position: "center",
                icon: "error",
                title: `Faild to login! Try again.`,
                showConfirmButton: true
            });
        });
    };


  

    return (
        <div className="mt-20 mb-12">
            <Helmet>
                <title>Espresso | Registration</title>
            </Helmet>
            <div className="flex justify-center items-center gap-x-5 animition pt-10">
                <div className="w-[500px] font-rancho h-[100px] " style={{
                    background: ' linear-gradient(330deg, #e05252 0%, #99e052 25%, #52e0e0 50%, #9952e0 75%, #e05252 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    <TypeAnimation
                        sequence={[
                            // Same substring at the start will only be typed once, initially
                            'Espresso Emporium: We are always ready to be your friend.',
                            1000,
                            'Espresso Emporium: Come & Contact with us to share your memorable moments.',
                            1000,
                            'Espresso Emporium: And enjoy the beautiful moments and make them memorable.',
                            1000,
                        ]}
                        speed={50}
                        style={{ fontSize: '2em' }}
                        repeat={Infinity}
                    />
                </div>
                <div className="form-bg w-[550px] py-12 border border-2 rounded-2xl  ">
                    <div className="flex justify-center items-center ">
                        <form onSubmit={handleRegistration} className="w-[60%]">
                            <h1 className="text-center font-rancho text-[30px]">Registration </h1>
                            <span className="font-raleway">
                                <p className="font-semibold	pt-4 text-[20px] pb-2">Name</p>
                                <input type="text" className="w-full h-10 ps-3 rounded-md" placeholder="Enter name " name="name" required />
                            </span>
                            <span className="font-raleway">
                                <p className="font-semibold	pt-4 text-[20px] pb-2">Email</p>
                                <input type="email" className="w-full h-10 ps-3 rounded-md" placeholder="Enter email " name="email" required />
                                {
                                    duplicateMailError && <p className="text-red-600 font-bold	pt-4 text-[16px] pb-2">{duplicateMailError}</p>
                                }
                            </span>
                            <span className="font-raleway">
                                <p className="font-semibold	pt-4 text-[20px] pb-2">Phone</p>
                                <input type="text" className="w-full h-10 ps-3 rounded-md" placeholder="Enter phone number " name="phone" required />
                            </span>
                            <span className="font-raleway">
                                <p className="font-semibold	pt-4 text-[20px] pb-2">Enter Password</p>
                                <div className="flex items-center justify-end	">
                                    <input type={show ? "text" : "password"} className="w-full h-10 ps-3 rounded-md pe-1" placeholder="Enter password " name="password_1" required />
                                    {
                                        show ? <AiTwotoneEye className="absolute  me-[0.6px] bg-[#FFF] pe-1 w-[30px] h-[30px]" onClick={() => setShow(!show)} /> : <IoMdEyeOff className="absolute  me-[0.6px] bg-[#FFF] pe-1 w-[30px] h-[30px]" onClick={() => setShow(!show)} />
                                    }
                                </div>
                            </span>
                            <span className="font-raleway">
                                <p className="font-semibold	pt-4 text-[20px] pb-2">Confrim Password</p>
                                <div className="flex items-center justify-end	">
                                    <input type={confrimShow ? "text" : "password"} className="w-full h-10 ps-3 rounded-md pe-1" placeholder="Enter password " name="password_2" required />
                                    {
                                        confrimShow ? <AiTwotoneEye className="absolute  me-[0.6px] bg-[#FFF] pe-1 w-[30px] h-[30px]" onClick={() => setConfrimShow(!confrimShow)} /> : <IoMdEyeOff className="absolute  me-[0.6px] bg-[#FFF] pe-1 w-[30px] h-[30px]" onClick={() => setConfrimShow(!confrimShow)} />
                                    }
                                </div>
                                {
                                    error && <p className="text-red-600 font-bold	pt-4 text-[16px] pb-2">{error}</p>
                                }
                            </span>
                            <input type="Submit" value="Registration" className="mt-4 btn w-full bg-[#D2B48C] outline outline-black hover:bg-[#D2B48C] text-[24px]	font-rancho secondary-h1 text-shadow-lg" />

                        </form>
                    </div>
                    <div className=" space-y-0.5 mt-4">
                        <p className="text-center text-[18px] font-inter text-[#737373] font-medium	">Or Registration with</p>
                        <div className="flex justify-center gap-x-3">
                            <button onClick={handleGoogleSignIn} className="bg-[#F5F5F8] rounded-full h-[55px] w-[55px] flex items-center justify-center">
                                <FcGoogle className=" w-[31px] h-[31px] " />
                            </button>

                            <button data-tip="This button is not activate"  className="tooltip tooltip-bottom bg-[#F5F5F8] rounded-full h-[55px] w-[55px] flex items-center justify-center">
                                <FaFacebookF className="text-[#3B5998] w-[31px] h-[31px] " />
                            </button>
                        </div>
                        <p className="text-center text-[18px] font-inter text-[#737373] font-medium	">Already have an account? <Link to='/login'><span className="text-[#FF3811]">Login</span></Link></p>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;

