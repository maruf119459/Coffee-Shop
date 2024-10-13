import {
  createBrowserRouter,
} from "react-router-dom";
import ExampleComponent from "../ExampleComponent";
import Root from "../common_page/Root/Root";
import Home from "../common_page/Home/Home";
import ViewProfile from "../common_page/ViewProfile/ViewProfile";
import ViewCoffeeList from "../common_page/ViewCoffeeList/ViewCoffeeList";
import AddCoffee from "../admin_employee_common_page/AddCoffee/AddCoffee";
import ViewCoffeeDetails from "../common_page/ViewCoffeeDetails/ViewCoffeeDetails";
import UpdateCoffee from "../admin_employee_common_page/UpdateCoffee/UpdateCoffee";
import AddEmployee from "../admin_page/AddEmployee/AddEmployee";
import ViewEmployeeList from "../admin_employee_common_page/ViewEmployeeList/ViewEmployeeList";
import Orders from "../admin_employee_common_page/Orders/Orders";
import Messages from "../admin_page/Messages/Messages";
import Sales from "../admin_page/Sales/Sales";
import UpdateProfile from "../common_page/UpdateProfile/UpdateProfile";
import YourOrders from "../user_page/YourOrders/YourOrders";
import Cart from "../user_page/Cart/Cart";
import History from "../user_page/History/History";
import Registration from "../common_page/Registration/Registration";
import Login from "../common_page/Login/Login";
import ViewEmployeeDetails from "../admin_page/ViewEmployeeDetails/ViewEmployeeDetails";
import UpdateEmployee from "../admin_page/UpdateEmployee/UpdateEmployee";
import OrderDetails from "../admin_employee_common_page/OrderDetails/OrderDetails";
import MessagesDetails from "../admin_page/MessagesDetails/MessagesDetails";
import ReadDetailsDailyReport from "../admin_page/ReadDetailsDailyReport/ReadDetailsDailyReport";
import ReadDetailsMonthlyReport from "../admin_page/ReadDetailsMonthlyReport/ReadDetailsMonthlyReport";
import TodaySells from "../admin_page/TodaySells/TodaySells";
import MonthSells from "../admin_page/MonthSells/MonthSells";
import EmloyeeNotification from "../employee_page/EmloyeeNotification/EmloyeeNotification";
import UserNotification from "../user_page/UserNotification/UserNotification";
import EmloyeeNotificationDetails from "../employee_page/EmloyeeNotificationDetails/EmloyeeNotificationDetails";
import UserNotificationDetails from "../user_page/UserNotificationDetails/UserNotificationDetails";
import HistoryDetails from "../user_page/HistoryDetails/HistoryDetails";
import Payment from "../user_page/Payment/Payment";
import YourOrderDetails from "../user_page/YourOrderDetails/YourOrderDetails";
import ErrorPage from "../error_page/ErrorPage/ErrorPage";
import UseAxiosPublic from "../custom_hook/UseAxiosPublic/UseAxiosPublic";
import UseAxiosSecure from "../custom_hook/UseAxiosSecure/UseAxiosSecure";
import AdminEmployeeProfile from "../admin_employee_common_page/AdminEmployeeProfile/AdminEmployeeProfile";
import ForbiddenAccessError from "../error_page/ForbiddenAccessError/ForbiddenAccessError";
import AdminRoutes from "../private_routes/AdminRoutes/AdminRoutes";
import AminEmployeeRoutes from "../private_routes/AminEmployeeRoutes/AminEmployeeRoutes";
// import EmployeeRoutes from "../private_routes/EmployeeRoutes/EmployeeRoutes";
import PrivateRoutes from "../private_routes/PrivateRoutes/PrivateRoutes";
import NotChefRoutes from "../private_routes/NotChefRoutes/NotChefRoutes";
import NotDeliveryManRoutes from "../private_routes/NotDeliveryManRoutes/NotDeliveryManRoutes";
import ReadYearlyReportDetails from "../admin_page/ReadYearlyReportDetails/ReadYearlyReportDetails";
import SearchResults from "../common_components/SearchResults/SearchResults";
const axiosPublic = UseAxiosPublic()
const axiosSecure = UseAxiosSecure()

// const fetchCoffeeDetails = async (id) => {
//   try {
//     const response = await fetch(`http://localhost:5000/coffee/${id}`);
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Failed to fetch coffee details:', error);
//     throw error;
//   }
// };



export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/addCoffee',
        element: <AminEmployeeRoutes><NotDeliveryManRoutes><AddCoffee /></NotDeliveryManRoutes></AminEmployeeRoutes>
      },
      {
        path: '/viewCoffeeList',
        element: <ViewCoffeeList />
      },
      {
        path: '/addEmployee',
        element: <AdminRoutes><AddEmployee /></AdminRoutes>
      },
      {
        path: '/viewEmployeeList',
        element: <AminEmployeeRoutes> <ViewEmployeeList /></AminEmployeeRoutes>
      },
      {
        path: '/viewEmployeeDetails/:id',
        element: <AdminRoutes><ViewEmployeeDetails /></AdminRoutes>,
        loader: async ({ params }) => {
          const response = await axiosSecure.get(`/employee/${params.id}`);
          return response.data;
        }
      },

      {
        path: '/updateEmployee/:id',
        element: <AdminRoutes><UpdateEmployee /></AdminRoutes>,
        loader: async ({ params }) => {
          const response = await axiosSecure.get(`/employee/${params.id}`);
          console.log(response.data)
          return response.data;
        }
      },
      {
        path: '/orders',
        element: <AminEmployeeRoutes><NotChefRoutes><NotDeliveryManRoutes><Orders /></NotDeliveryManRoutes></NotChefRoutes></AminEmployeeRoutes>

      },

      {
        path: '/orderDetails/:id',
        element: <AminEmployeeRoutes><NotChefRoutes><NotDeliveryManRoutes><OrderDetails /></NotDeliveryManRoutes></NotChefRoutes></AminEmployeeRoutes>,
      },
      {
        path: '/messages',
        element: <AdminRoutes><Messages /></AdminRoutes>
      },
      {
        path: '/messagesDetails/:id',
        element: <AdminRoutes><MessagesDetails /></AdminRoutes>,
        loader: async ({ params }) => {
          const response = await axiosSecure.get(`/message/${params.id}`);
          return response.data;
        }
      },
      {
        path: '/sales',
        element: <AdminRoutes><Sales /></AdminRoutes>
      },
      {
        path: '/todaySells',
        element: <AdminRoutes> <TodaySells /></AdminRoutes>
      },
      {
        path: '/monthSells',
        element: <AdminRoutes><MonthSells /></AdminRoutes>
      },
      {
        path: '/dailyReport/:date',
        element: <AdminRoutes><ReadDetailsDailyReport /></AdminRoutes>
      },
      {
        path: '/monthlyReport/:month',
        element: <AdminRoutes><ReadDetailsMonthlyReport /></AdminRoutes>
      },
      {
        path: '/yearlyReport/:year',
        element: <AdminRoutes><ReadYearlyReportDetails /></AdminRoutes>
      },
      {
        path: '/employeeNotification',
        element: <AminEmployeeRoutes><EmloyeeNotification /></AminEmployeeRoutes>
      },
      {
        path: '/employeeNotificationDetais/:id',
        element: <AminEmployeeRoutes><EmloyeeNotificationDetails /></AminEmployeeRoutes>,
        //   loader: async ({ params }) => {
        //     const response = await axiosSecure.get(`/employeeNotificationGetById/${params.id}`);
        //     return response.data;
        // }
      },
      {
        path: '/notification',
        element: <PrivateRoutes><UserNotification /></PrivateRoutes>,

      },
      {
        path: '/notificationDetails/:id',
        element: <PrivateRoutes><UserNotificationDetails /></PrivateRoutes>,
        loader: async ({ params }) => {
          const response = await axiosSecure.get(`/userNotificationGetById/${params.id}`);
          return response.data;
        }
      },
      {
        path: '/yourOrders',
        element: <PrivateRoutes> <YourOrders /></PrivateRoutes>
      },
      {
        path: '/yourOrderDetails/:id',
        element: <PrivateRoutes><YourOrderDetails /></PrivateRoutes>,
        // loader: async ({ params }) => {
        //   const response = await axiosSecure.get(`/order/${params.id}`);
        //   return response.data;
        // }
      },

      {
        path: '/cart',
        element: <PrivateRoutes><Cart /></PrivateRoutes>
      },
      {
        path: '/history',
        element: <PrivateRoutes><History /></PrivateRoutes>
      },
      {
        path: '/payment',
        element: <PrivateRoutes><Payment /></PrivateRoutes>
      },
      {
        path: '/historyDetails/:id',
        element: <PrivateRoutes><HistoryDetails /></PrivateRoutes>,
        loader: async ({ params }) => {
          const response = await axiosSecure.get(`/order/${params.id}`);
          return response.data;
        }
      },
      {
        path: '/profile',
        element: <PrivateRoutes><ViewProfile /></PrivateRoutes>
      },
      {
        path: '/updateProfile',
        element: <PrivateRoutes><UpdateProfile /></PrivateRoutes>
      },

      {
        path: '/registration',
        element: <Registration />
      },
      {
        path: '/login',
        element: <Login />
      },











      { path: "search", 
        element: <SearchResults /> 
      },
      {
        path: '/viewProfile',
        element: <AminEmployeeRoutes><AdminEmployeeProfile /></AminEmployeeRoutes>,
      },

      {
        path: '/updateCoffee/:id',
        element: <AminEmployeeRoutes><NotDeliveryManRoutes> <UpdateCoffee /></NotDeliveryManRoutes></AminEmployeeRoutes>,
        loader: async ({ params }) => {
          const response = await axiosSecure.get(`/coffee/${params.id}`);
          return response.data;
        }
      },
      {
        path: '/viewCoffeDetails/:id',
        element: <ViewCoffeeDetails />,
        loader: async ({ params }) => {
          const response = await axiosPublic.get(`/coffee/${params.id}`);
          return response.data;
        }
      },
      {
        path: "/exampleComponent",
        element: <ExampleComponent />
      },
      {
        path: '/forbiddenAccess4O3',
        element: <ForbiddenAccessError />
      }
    ],
    errorElement: <ErrorPage />
  },
]);