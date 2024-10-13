import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { AuthContext } from "../../providers/AuthProviders/AuthProviders";
import useEmployee from "../../custom_hook/useEmployee/useEmployee";
import useAdmin from "../../custom_hook/useAdmin/useAdmin";
import UseAxiosSecure from "../../custom_hook/UseAxiosSecure/UseAxiosSecure";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const img_hosting_key = 'f4bad12b7d481fe4bafabe514b16b077';
const img_hosting_api = `https://api.imgbb.com/1/upload?key=${img_hosting_key}`;
const UpdateProfile = () => {
    const { user1, signIn, passwordUpdate } = useContext(AuthContext)
    const [isemployee, isEmployeeLoading] = useEmployee();
    const [isadmin, isAdminLoading] = useAdmin();
    const [DBuser, setDBuser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const axiosSecure = UseAxiosSecure()
    const navigate = useNavigate();

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

    const handleCustomerUpdate = async e => {
        e.preventDefault();
        Swal.fire({
            title: 'Updating Profile...',
            text: 'Please wait......',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        const photo = e.target.file.files[0];
        const name = e.target.name.value;
        const phone = e.target.phone.value;
        const email = e.target.email.value;
        const address = e.target.address.value;
        if (photo === undefined) {

            const updateUser = { name, phone, email, address }
            const updateUserResponse = await axiosSecure.patch(`/user/${DBuser._id}`, updateUser);
            if (updateUserResponse.data.result.acknowledged) {
                Swal.close();
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `successfully update profile`,
                    showConfirmButton: false,
                    timer: 3000
                });
                window.location.reload();
            }
            else {
                Swal.close();
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: `Faild to  update profile! Try again.`,
                    showConfirmButton: true
                });
            }
        }

        if (photo !== undefined) {
            const formData = new FormData();
            formData.append('image', photo);
            try {
                const res = await axiosSecure.post(img_hosting_api, formData, {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                });
                if (res.data.success) {
                    const imageUrl = res.data.data.display_url;
                    const updateUser = { imageUrl, name, phone, email, address }
                    const updateUserResponse = await axiosSecure.patch(`/user/${DBuser._id}`, updateUser);
                    if (updateUserResponse.data.result.acknowledged) {
                        Swal.close();
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: `successfully update profile`,
                            showConfirmButton: false,
                            timer: 3000
                        });
                        window.location.reload();
                    }
                    else {
                        Swal.close();
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: `Faild to  update profile! Try again.`,
                            showConfirmButton: true
                        });
                    }

                }
            }
            catch (error) {
                Swal.close();
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: `Faild to  update profile! Try again.`,
                    showConfirmButton: true
                });
            }
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
        <div className="ms-20 mt-28 mb-12">
            <Helmet>
                <title>Espresso | Update Profile</title>
            </Helmet>
            <div>
                {
                    isLoading || isEmployeeLoading || isAdminLoading ? <div>
                        <div className="flex flex-col items-center justify-center ">
                            <div>
                                <div className="skeleton w-[200px] h-[200px] shrink-0 rounded-full  mt-12 mb-3"></div>

                            </div>
                            <div className="w-[500px] bg-[#FFF] h-[400px] mb-4 flex flex-col items-center justify-center">
                                <div className="skeleton h-10 w-full mt-2 rounded-md"></div>
                                <div className="skeleton h-10 w-full mt-2 rounded-md"></div>
                                <div className="skeleton h-10 w-full mt-2 rounded-md"></div>
                                <div className="skeleton h-10 w-full mt-2 rounded-md"></div>
                                <div className="skeleton h-10 w-full mt-2 rounded-md"></div>
                                <div className="skeleton h-10 w-full mt-2 rounded-md"></div>
                                <div className="skeleton h-10 w-[50%] mt-2 rounded-md"></div>
                               
                            </div>
                    
                        </div>
                        <div className="skeleton w-full h-[2px] mt-28 mb-16 font-inter "> </div>
                        <div className="flex items-center justify-center">
                        <div className="skeleton h-[200px] w-[400px]"></div>
                        </div>

                    </div> : <div>{
                        (!isemployee && !isadmin && user1) &&
                        <div>
                            <h1 className="text-center mt-12 font-rancho text-[30px] mb-6">Hi, {DBuser?.name}. Update Your Profile.</h1>
                            <div className="flex flex-col justify-center items-center space-y-6">
                                <div className="">
                                    {
                                        DBuser.imageUrl === '' ? <img src="https://i.ibb.co/7nW6YY8/avatar.png" alt="" className="w-[200px] h-[200px]  rounded-full " /> : <img src={DBuser?.imageUrl} alt="" className="w-[200px] h-[200px]  rounded-full " />
                                    }
                                </div>
                                <form className="w-[500px] bg-[#ECEAE3] py-6 px-8 rounded-2xl" onSubmit={handleCustomerUpdate}>
                                    <span className="font-raleway flex items-center  mt-2">
                                        <p className="font-semibold	text-[20px] me-3 w-[230px]">Profile Image:</p>
                                        <input type="file" name='file' className="w-full h-10 ps-3 pt-1 rounded-md bg-[#FFF]" />
                                    </span>
                                    <span className="font-raleway flex items-center  mt-2">
                                        <p className="font-semibold	 text-[20px] me-3">Name: </p>
                                        <input type="text" className="w-full h-10 ps-3 rounded-md" name="name" defaultValue={DBuser?.name} required />
                                    </span>
                                    <span className="font-raleway flex items-center  mt-2">
                                        <p className="font-semibold text-[20px] me-3 w-[260px]">Phone Number:</p>
                                        <input type="text" className="w-full font-poppins h-10 ps-3 rounded-md" name="phone" defaultValue={DBuser?.phone} required />
                                    </span>
                                    <span className="font-raleway flex items-center  mt-2">
                                        <p className="font-semibold text-[20px] me-3 ">Email:</p>
                                        <input type="email" disabled className="w-full h-10 ps-3 rounded-md" name="email" defaultValue={DBuser?.email} required />
                                    </span>
                                    <span className="font-raleway flex items-center  mt-2">
                                        <p className="font-semibold	text-[20px] me-3 ">Address:</p>
                                        <input type="text" className="w-full h-10 ps-3 rounded-md" name="address" defaultValue={DBuser?.address} required />
                                    </span>
                                    <input type="Submit" value="Update" className="mt-4 btn w-full bg-[#D2B48C] outline outline-black hover:bg-[#D2B48C] text-[24px]	font-rancho secondary-h1 text-shadow-lg" />
                                </form>
                            </div>
                            <div>
                                {
                                    DBuser?.isPassword ? (
                                        <>
                                            <div className="divider divider-warning mt-32 mb-16">Warning</div>
                                            <div className="flex justify-center items-center">
                                                <div className="bg-yellow-300 p-24 w-[400px] flex justify-center items-center rounded-md">
                                                    <button onClick={updatePassword} className="btn">Update Password</button>
                                                </div>
                                            </div>
                                        </>
                                    ) : null
                                }
                            </div>

                        </div>
                    }
                    </div>
                }
            </div>

        </div>
    );
};

export default UpdateProfile;