import { IoSunny } from "react-icons/io5";
import { BsFillMoonFill } from "react-icons/bs";
import { IoMenu } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { MdAddBusiness } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import { CgUserList } from "react-icons/cg";
import { IoIosPersonAdd } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { MdOutlineManageAccounts } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import logo from '../../assets/image/logo.png'
import { useContext, useEffect, useState } from 'react';
import './NavBar.css'
import { Link, NavLink, useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { UtilitiesContext } from "../../providers/UtilitiesProviders/UtilitiesProviders";
import { AuthContext } from "../../providers/AuthProviders/AuthProviders";
import { CiLogin } from "react-icons/ci";
import { MdMail } from "react-icons/md";
import { FcSalesPerformance } from "react-icons/fc";
import { MdNotifications } from "react-icons/md";
import { BsBoxSeamFill } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { MdAppRegistration } from "react-icons/md";
import { FaMagnifyingGlass } from "react-icons/fa6";

import Swal from "sweetalert2";
import UseAxiosPublic from "../../custom_hook/UseAxiosPublic/UseAxiosPublic";
import useEmployee from "../../custom_hook/useEmployee/useEmployee";
import useAdmin from "../../custom_hook/useAdmin/useAdmin";
import useChef from "../../custom_hook/useChef/useChef";
import useDeliveryMan from "../../custom_hook/useDeliveryMan/useDeliveryMan";
// import UseAxiosSecure from "../../custom_hook/UseAxiosSecure/UseAxiosSecure";
// import { useQuery } from "@tanstack/react-query";

//isDarkMode,setIsSidebarOpen
const NavBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { isDarkMode, toggleSidebar, toggleDarkMode, isSidebarOpen, unreadMessage, unreadMessageNumberReload, cartLength, cartsLengthReload, pendingOrder, pendingOrderReload, unreadUserNotification, reloadUnreadUserNotification, unreadEmployeeNotification, reloadUnreadEmployeeNotification,showSearchForm,setShowSearchForm } = useContext(UtilitiesContext)
  const { user1, userLoading, logOut, isAdmin, isEmployee } = useContext(AuthContext);
  const [, isEmployeeLoading] = useEmployee();
  const [, isAdminLoading] = useAdmin();
  const [isChef, isChefLoading] = useChef();
  const [isDeliveryMan, isDeliveryManLoading] = useDeliveryMan();
  
  // const [showSearch, setShowSearch] = useState(true);
  

  const navigate = useNavigate();
  const axiosPublic = UseAxiosPublic();
  // const axiosSecure = UseAxiosSecure()
  const [DBuser, setDBuser] = useState()
  unreadMessageNumberReload();
  cartsLengthReload();
  pendingOrderReload();
  reloadUnreadUserNotification();
  reloadUnreadEmployeeNotification();
  // console.log(cartsLength)
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isEmployee && !isAdmin) {
        const response = await axiosPublic.get('/userByEmail', { params: { email: user1?.email } });
        setDBuser(response.data);
      }

      if (isEmployee || isAdmin) {
        const response = await axiosPublic.get('/employeeByEmail', { params: { email: user1?.email } });
        setDBuser(response.data);

      }
    };


    fetchUserData();

  }, [user1, isEmployee, isAdmin, axiosPublic]);

  const handleLogOut = () => {
    Swal.fire({
      title: "Are you sure for Logout?",
      text: "You are want to logout!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!"
    }).then((result) => {
      if (result.isConfirmed) {
        logOut();
        navigate('/login')
        Swal.fire({
          title: "Logout!",
          text: "You are logout",
          icon: "success"
        });
      }
    });

  }
  const employee = (isEmployee || isAdmin) && user1;
  const onlyUser = (!isAdmin && !isEmployee) && user1;


  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchTerm}`);
  };


  return (
    <div className={isDarkMode ? 'dark' : ''}>
      {/* Navbar */}
      <nav  className="navbar">
        <div onClick={()=>setShowSearchForm(true)} className="logo_item swap swap-rotate ">
          {
            userLoading ? <div>
              <div className="skeleton h-[4px] w-[22px] mb-[2px]"></div>
              <div className="skeleton h-[4px] w-[22px] mb-[2px]"></div>
              <div className="skeleton h-[4px] w-[22px] "></div>
            </div> : <span>
              {
                isSidebarOpen ? <RxCross2 style={{ color: "#f9fafa", }} onClick={toggleSidebar} /> : <IoMenu style={{ color: "#f9fafa", }} onClick={toggleSidebar} />
              }
            </span>
          }
        </div>
        <div>
          {
            userLoading ? <div className="flex gap-x-2 items-center ">
              <div className="skeleton h-[28px] w-[28px] rounded-full"></div>
              <div className="skeleton h-[38px] w-[200px] rounded-md"></div>
            </div> : <div className="flex items-center gap-x-2 block">
              <div className={showSearchForm?"flex items-center gap-x-2 block":"flex items-center gap-x-2 hidden"}>
                <img src={logo} alt="" className='w-full h-full' />
                <h1 className='text-[#fff] text-[30px] font-rancho'>Espresso Emporium</h1>
              </div>
              <div className="flex items-center  ">
              <form onSubmit={handleSearch} className={showSearchForm ? "flex items-center hidden" : "flex items-center block my-[5px]"}>
                  <input
                    className="border-2 rounded-s-md py-[4px] ps-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className="bg-[#FFF] py-[8px] px-2 border-2 rounded-e-md"><FaMagnifyingGlass /></button>
                </form>
                <button onClick={()=>setShowSearchForm(false)} className={showSearchForm?"block bg-[#FFF] py-[3.8px] px-2 border-2  rounded-md " :"hidden bg-[#FFF] py-[3.8px] px-2 border-2  rounded-md"}><FaMagnifyingGlass /></button>
              </div>
            </div>
          }
        </div>
{/* "border-2 rounded-s-md hidden" :  */}
        <div onClick={()=>setShowSearchForm(true)} className="navbar_content">
          {
            userLoading ? <div className="flex gap-x-2 items-center ">
              <div className="skeleton h-[18px] w-[18px] rounded-full"></div>
              <div className="skeleton h-[35px] w-[36px] rounded-full"></div>
            </div> : <div className="flex items-center gap-x-4">
              <button className={`bx ${isDarkMode ? 'bx-moon' : 'bx-sun'} text-[#FFF]`} id="darkLight" onClick={toggleDarkMode}>  {isDarkMode ? <IoSunny /> : <BsFillMoonFill />}</button>
              {
                user1 ? <span>{DBuser?.imageUrl === '' ? <img src="https://i.ibb.co/7nW6YY8/avatar.png" alt="" className="w-full h-full  rounded-full " /> : <img src={DBuser?.imageUrl}></img>}</span> : <div className="flex items-center gap-x-2">
                  <Link to='/login'><button className="text-[#fff] font-bold flex items-center text-[35px] gap-x-3 border rounded-full border-2 w-[35px] h-[35px] p-2 "><CiLogin></CiLogin> </button></Link>
                </div>
              }
            </div>
          }
        </div>
      </nav>
      {/*  || isEmployeeLoading || isAdminLoading || isChefLoading || isDeliveryManLoading */}
      {/* Sidebar */}
      <nav onClick={()=>setShowSearchForm(true)} className={`sidebar ${isSidebarOpen ? '' : 'close'}`}>
        {
          userLoading ? <div className="mt-6 ms-7">
            <span className="loading loading-bars loading-md"></span>
          </div> :
            <div className="menu_content">
              <ul className="menu_items flex flex-col items-start	">
                <div className="menu_title menu_dashboard"></div>
                <div>
                  <li className="item">
                    <NavLink to='/'>
                      <div className="nav_link submenu_item">
                        <span className="navlink_icon">
                          <FaHome ></FaHome>
                        </span>
                        <span className="navlink">Home</span>
                      </div>
                    </NavLink>
                  </li>
                  {
                    !isDeliveryMan && employee && <li className="item">
                      <NavLink to='/addCoffee'>
                        <div className="nav_link submenu_item">
                          <span className="navlink_icon">
                            <MdAddBusiness className="bx bx-grid-alt"></MdAddBusiness>
                          </span>
                          <span className="navlink">Add Coffee</span>
                        </div>
                      </NavLink>
                    </li>
                  }
                  <li className="item">
                    <NavLink to='/viewCoffeeList'>
                      <div className="nav_link submenu_item">
                        <span className="navlink_icon">
                          <FaClipboardList className="bx bx-grid-alt"></FaClipboardList>
                        </span>
                        <span className="navlink">Coffee List</span>
                      </div>
                    </NavLink>
                  </li>

                  {
                    onlyUser && <li className="item">
                      <NavLink to='/yourOrders'>
                        <div className="nav_link submenu_item">
                          <span className="navlink_icon">
                            <BsBoxSeamFill className="bx bx-grid-alt"></BsBoxSeamFill>
                          </span>
                          <span className="navlink">Your Orders</span>
                        </div>
                      </NavLink>
                    </li>
                  }
                  {
                    (isAdmin && user1) && <li className="item">
                      <NavLink to='/addEmployee'>
                        <div className="nav_link submenu_item">
                          <span className="navlink_icon">
                            <IoIosPersonAdd className="bx bx-grid-alt"></IoIosPersonAdd>
                          </span>
                          <span className="navlink">Add Employee</span>
                        </div>
                      </NavLink>
                    </li>
                  }
                  {
                    employee && <li className="item">
                      <NavLink to='/viewEmployeeList'>
                        <div className="nav_link submenu_item">
                          <span className="navlink_icon">
                            <CgUserList className="bx bx-grid-alt"></CgUserList>
                          </span>
                          <span className="navlink">Employee List</span>
                        </div>
                      </NavLink>
                    </li>
                  }
                  {
                    !isDeliveryMan && !isChef && employee && <li className="item">
                      <NavLink to='/orders'>
                        <div className="nav_link submenu_item ">
                          <span className="navlink_indicator_icon ">
                            {
                              pendingOrder === 0 ? <BsBoxSeamFill className="bx bx-grid-alt"></BsBoxSeamFill> : <div className="indicator">
                                <BsBoxSeamFill className="bx bx-grid-alt"></BsBoxSeamFill>
                                <span className="badge badge-xs badge-warning	 indicator-item p-1 ">{pendingOrder}</span>
                              </div>
                            }

                          </span>
                          <span className="navlink nav_link_order_text">Orders</span>
                        </div>
                      </NavLink>
                    </li>
                  }
                  {
                    (isAdmin && user1) && <li className="item">
                      <NavLink to='/messages'>
                        <div className="nav_link submenu_item">
                          <span className="navlink_indicator_icon">
                            {
                              unreadMessage === 0 ? <MdMail className="bx bx-grid-alt"></MdMail> : <div className="indicator">
                                <MdMail className="bx bx-grid-alt"></MdMail>
                                <span className="badge badge-xs badge-warning	 indicator-item  ">{unreadMessage}</span>
                              </div>
                            }
                          </span>
                          <span className="navlink">Messages</span>
                        </div>
                      </NavLink>
                    </li>
                  }
                  {
                    employee && <li className="item">
                      <NavLink to='/employeeNotification'>
                        <div className="nav_link submenu_item">
                          <span className="navlink_indicator_icon">
                            {
                              unreadEmployeeNotification === 0 ? <MdNotifications className="bx bx-grid-alt"></MdNotifications> : <div className="indicator">
                                <MdNotifications className="bx bx-grid-alt"></MdNotifications>
                                <span className="badge badge-xs badge-warning	 indicator-item  ">{unreadEmployeeNotification}</span>
                              </div>
                            }
                          </span>
                          <span className="navlink">Notification</span>
                        </div>
                      </NavLink>
                    </li>
                  }
                  {
                    onlyUser && <li className="item">
                      <NavLink to='/notification'>
                        <div className="nav_link submenu_item">
                          <span className="navlink_indicator_icon">
                            {
                              unreadUserNotification === 0 ? <MdNotifications className="bx bx-grid-alt"></MdNotifications> : <div className="indicator">
                                <MdNotifications className="bx bx-grid-alt"></MdNotifications>
                                <span className="badge badge-xs badge-warning	 indicator-item  ">{unreadUserNotification}</span>
                              </div>
                            }
                          </span>
                          <span className="navlink">Notification</span>
                        </div>
                      </NavLink>
                    </li>
                  }
                  {
                    (isAdmin && user1) && <li className="item">
                      <NavLink to='/sales'>
                        <div className="nav_link submenu_item">
                          <span className="navlink_icon">
                            <FcSalesPerformance className="bx bx-grid-alt"></FcSalesPerformance>
                          </span>
                          <span className="navlink">Sales</span>
                        </div>
                      </NavLink>
                    </li>
                  }
                  {
                    onlyUser && <li className="item">
                      <NavLink to='/cart'>
                        <div className="nav_link submenu_item">
                          <span className="navlink_indicator_icon">
                            {
                              cartLength === 0 ? <FaShoppingCart className="bx bx-grid-alt"></FaShoppingCart> : <div className="indicator">
                                <FaShoppingCart className="bx bx-grid-alt"></FaShoppingCart>
                                <span className="badge badge-xs badge-warning	 indicator-item  ">{cartLength}</span>
                              </div>
                            }
                          </span>
                          <span className="navlink">Cart</span>
                        </div>
                      </NavLink>
                    </li>
                  }
                  {
                    onlyUser && <li className="item">
                      <NavLink to='/history'>
                        <div className="nav_link submenu_item">
                          <span className="navlink_icon">
                            <FaHistory className="bx bx-grid-alt"></FaHistory>
                          </span>
                          <span className="navlink">History</span>
                        </div>
                      </NavLink>
                    </li>
                  }

                </div>
              </ul>

              <div>
                {
                  !user1 && <ul className="menu_items">
                    <div className="menu_title menu_setting"></div>

                    <li className="item">
                      <NavLink to='/registration'>
                        <div className="nav_link submenu_item">
                          <span className="navlink_icon">
                            <MdAppRegistration className="bx bx-grid-alt"></MdAppRegistration>
                          </span>
                          <span className="navlink">Registration</span>
                        </div>
                      </NavLink>
                    </li>
                    <li className="item">
                      <NavLink to='/login'>
                        <div className="nav_link submenu_item">
                          <span className="navlink_icon">
                            <CiLogin className="bx bx-grid-alt"></CiLogin>
                          </span>
                          <span className="navlink">Login</span>
                        </div>
                      </NavLink>
                    </li>
                  </ul>
                }
              </div>

              <div>

                {
                  user1 && <ul className="menu_items">
                    <div className="menu_title menu_setting"></div>
                    {!employee && <li className="item">
                      <NavLink to='/profile'>
                        <div className="nav_link">
                          <span className="navlink_icon">
                            <CgProfile className="bx bx-flag"></CgProfile>
                          </span>
                          <span className="navlink">View Profile</span>
                        </div>
                      </NavLink>
                    </li>}
                    {
                      employee && <li className="item">
                        <NavLink to='/viewProfile'>
                          <div className="nav_link">
                            <span className="navlink_icon">
                              <CgProfile className="bx bx-flag"></CgProfile>
                            </span>
                            <span className="navlink">View Profile</span>
                          </div>
                        </NavLink>
                      </li>
                    }
                    {
                      !employee && <li className="item">
                        <NavLink to='/updateProfile'>
                          <div className="nav_link">
                            <span className="navlink_icon">
                              <MdOutlineManageAccounts className="bx bx-cog"></MdOutlineManageAccounts>
                            </span>
                            <span className="navlink">Update Profile</span>
                          </div>
                        </NavLink>
                      </li>
                    }
                    <li className="item">
                      <button onClick={handleLogOut} className="nav_link">
                        <span className="navlink_icon">
                          <CiLogout className="bx bx-cog"></CiLogout>
                        </span>
                        <span className="navlink">Log Out</span>
                      </button>
                    </li>
                  </ul>
                }
              </div>
            </div>
        }
      </nav>

    </div>
  );
};

export default NavBar;






