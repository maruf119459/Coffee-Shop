import './Footer.css'
import logo from '../../assets/image/logo.png'
import { FaFacebook } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { BsInstagram } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { MdMail } from "react-icons/md";
import { FaMapMarked } from "react-icons/fa";
import { useContext,   } from 'react';
import { AuthContext } from '../../providers/AuthProviders/AuthProviders';
import UseAxiosPublic from '../../custom_hook/UseAxiosPublic/UseAxiosPublic';
import Swal from 'sweetalert2';
import { UtilitiesContext } from '../../providers/UtilitiesProviders/UtilitiesProviders';

const Footer = () => {
    const { isEmployee, isAdmin, user1 } = useContext(AuthContext)
    const axiosPublic = UseAxiosPublic()
    const employee = (isEmployee || isAdmin) && user1;
   const {setShowSearchForm } = useContext(UtilitiesContext)    
    const sendMessage = async e => {
        e.preventDefault();
        Swal.fire({
            title: 'Sent message...',
            text: 'Please wait while the message is being sent.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        let name = ''
        let email = ''
        const messageBody = e.target.message.value
        const status = 'unread'
        let imageUrl = ''
        if (user1) {
            const response = await axiosPublic.get('/userByEmail', { params: { email: user1.email } });
            imageUrl = response.data.imageUrl
            name = response.data.name
            email = user1.email;
        }
        else {
            name = e.target.name.value
            email = e.target.email.value
        }

        const message = { name, email, messageBody, status, imageUrl }
        console.log(name, email, messageBody, message)
        const messageResponse = await axiosPublic.post('/message', message, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        Swal.close();
        if (messageResponse.data.insertedId) {
            e.target.reset();
            Swal.fire({
                position: "center",
                icon: "success",
                title: `We rechive your message. We contact With you by email. Please follow your email.`,
                showConfirmButton: true,
            });
        } else {
            Swal.fire({
                position: "center",
                icon: "error",
                title: `Failed to rechive message! Try again.`,
                showConfirmButton: true,
            });
        }
    }



    return (
        <div onClick={()=>setShowSearchForm(true)} className="h-[825px] w-full">
            <div className="h-[775px] w-full footer-bg flex items-center justify-center  gap-x-[60px] ">
                <div className='ps-24'>
                    <img src={logo} alt="" className='w-[75px] h-[90px]' />
                    <h1 className='text-[40px] font-rancho text-primary-h1 pt-[20px] pb-[25px] text-shadow-lg' >Espresso Emporium</h1>
                    <p className='w-[600px] text-[20px] font-raleway pb-[25px]'>Always ready to be your friend. Come & Contact with us to share your memorable moments, to share with your best companion.</p>
                    <div className='flex items-center gap-x-5 text-[40px] pb-[25px]'>
                        <FaFacebook className='text-primary-h1' />
                        <RiTwitterXFill className='text-primary-h1' />
                        <BsInstagram className='text-primary-h1' />
                        <FaYoutube className='text-primary-h1' />
                    </div>
                    <h2 className='text-[40px] font-rancho text-primary-h1 pb-[25px] text-shadow-lg'>Get in Touch</h2>
                    <div className='flex items-center gap-x-5 pb-[15px] font-raleway'>
                        <FaPhone className='text-[20px] text-primary-h1' />
                        <p>+88 01533 333 333</p>
                    </div>
                    <div className='flex items-center gap-x-5 pb-[15px] font-raleway'>
                        <MdMail className='text-[20px] text-primary-h1' />
                        <p>info@gmail.com</p>
                    </div>
                    <div className='flex items-center gap-x-5 pb-[15px] font-raleway'>
                        <FaMapMarked className='text-[20px] text-primary-h1' />
                        <p>72, Wall street, King Road, Dhaka</p>
                    </div>
                </div>
                {/* pe-[245px] */}
                <div className='ps-10  w-[500px]'>
                    <h1 className='text-[40px] font-rancho text-primary-h1 pb-[25px] py-[15px] ps-[12px] text-shadow-lg'>Connect with Us</h1>
                    <form onSubmit={sendMessage} className=''>
                        {
                            user1 ? <></> : <>
                                <input name='name' type="text" placeholder='Name' className='block mb-[15px] py-[15px] ps-[12px] w-full rounded-md' required />
                                <input name='email' type="text" placeholder='Email' className='block mb-[15px] py-[15px] ps-[12px] w-full rounded-md' required />
                            </>
                        }
                        <textarea name="message" placeholder='Message' className='block mb-[18px] pt-[10px] h-[105px] ps-[12px] w-full overflow-y-auto rounded-md' required></textarea>
                        {
                            employee ? <div className="tooltip tooltip-bottom" data-tip="Button Disable for Admin and all Employees">
                                <button disabled={true} className='text-[24px] font-rancho text-primary-h1  bg-[#fff] py-[5px] px-[21px] rounded-full border-[3px] border-[#331A15]'>Send Message</button>
                            </div> : <button className='text-[24px] font-rancho text-primary-h1  bg-[#fff] py-[5px] px-[21px] rounded-full border-[3px] border-[#331A15]'>Send Message</button>
                        }
                    </form>
                </div>
            </div>

            <div className="h-[50px] w-full bg-[#331A15] ">
                <h1 className='text-[#fff] text-[20px] font-rancho text-center pt-2'>Copyright Espresso Emporium ! All Rights Reserved</h1>
            </div>
        </div>
    );
};

export default Footer;

