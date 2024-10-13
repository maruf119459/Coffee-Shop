import {  useRef } from 'react';
import aroma from '../../assets/image/icons/1.png'
import quality from '../../assets/image/icons/2.png'
import pure from '../../assets/image/icons/3.png'
import roasting from '../../assets/image/icons/4.png'
const HomeBanner = () => {
    const section2Ref = useRef(null);

    const scrollToSection2 = () => {
        window.scrollBy({ top: 760, behavior: 'smooth' });
    };
    return (
        <div>
            <div className='homePageBanner w-full h-[800px] flex flex-col justify-center ps-[42%]' id="section1">
                <h1 className='text-[55px] text-[#fff] font-rancho'>Would you like a Cup of Delicious Coffee?</h1>
                <p className='font-raleway w-[690px] text-[#fff] pt-4 pb-5 text-[16px]' style={{ lineHeight: '30px' }}>
                    {`It's coffee time - Sip & Savor - Relaxation in every sip! Get the nostalgia back!! Your companion of every moment!!! Enjoy the beautiful moments and make them memorable.`}
                </p>
                <button className='bg-[#E3B577] w-[130px] h-[48px] px-5  text-[24px] font-rancho font-semibold hover:bg-transparent	hover:text-[#FFF] hover:border-2 hover:border-white' onClick={scrollToSection2}>
                    Learn More
                </button>
            </div>
            <div className='bg-[#ECEAE3] h-[300px] w-full mx-auto' id="section2" ref={section2Ref} >
                <div className='flex justify-center gap-x-6 items-center ms-12 pt-[56px]'>
                    <div className=''>
                        <img src={aroma} alt="" />
                        <h1 className='font-rancho text-[#331A15] text-[35px]'>Awesome Aroma</h1>
                        <p className='text-[16px] font-raleway w-[280px]' style={{ lineHeight: '30px' }}>You will definitely be a fan of the design & aroma of your coffee</p>
                    </div>
                    <div className=''>
                        <img src={quality} alt="" />
                        <h1 className='font-rancho text-[#331A15] text-[35px]'>High Quality</h1>
                        <p className='text-[16px] font-raleway w-[280px]' style={{ lineHeight: '30px' }}>We served the coffee to you maintaining the best quality</p>
                    </div>
                    <div className=''>
                        <img src={pure} alt="" />
                        <h1 className='font-rancho text-[#331A15] text-[35px]'>Pure Grades</h1>
                        <p className='text-[16px] font-raleway w-[280px]' style={{ lineHeight: '30px' }}>The coffee is made of the green coffee beans which you will love</p>
                    </div>
                    <div className=''>
                        <img src={roasting} alt="" />
                        <h1 className='font-rancho text-[#331A15] text-[35px]'>Proper Roasting</h1>
                        <p className='text-[16px] font-raleway w-[280px]' style={{ lineHeight: '30px' }}>Your coffee is brewed by first roasting the green coffee beans</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeBanner;