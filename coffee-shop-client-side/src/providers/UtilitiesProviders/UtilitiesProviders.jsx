import { createContext, useState, useEffect, } from "react";
import PropTypes from 'prop-types';
import UseAxiosSecure from "../../custom_hook/UseAxiosSecure/UseAxiosSecure";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import auth from "../../Firebase/firebase.config";
import { onAuthStateChanged } from "firebase/auth";

export const UtilitiesContext = createContext(null);

// Initialize a query client
const queryClient = new QueryClient();
auth
const UtilitiesProviders = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showSearchForm, setShowSearchForm] = useState(true)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const axiosSecure = UseAxiosSecure();
    const [user1, setUser] = useState();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                setUser(currentUser);
            }
        });
        return () => {
            return unsubscribe();
        }
    }, [])

  
    const toggleSearchForm = () => {
      setShowSearchForm(!showSearchForm);
    };
    const toggleSidebar = (event) => {
        setIsSidebarOpen(!isSidebarOpen);
        if (event) event.stopPropagation();
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    const handleClickOutside = (event) => {
        if (!event.target.closest('.sidebar')) {
            setIsSidebarOpen(false);
        }
    };

    useEffect(() => {
        if (windowWidth < 768) {
            setIsSidebarOpen(false);
        }

        window.addEventListener('resize', handleResize);
        document.body.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.body.removeEventListener('click', handleClickOutside);
        };
    }, [windowWidth]);

    // Use useQuery hook to fetch unread messages count
    const { data: unreadMessage, refetch: unreadMessageNumberReload } = useQuery({
        queryKey: ['unreadMessageCount'],
        queryFn: async () => {
            const response = await axiosSecure.get('/messages/unread-count');
            return response.data.unreadCount;
        }
    });
    unreadMessageNumberReload();



    const { data: pendingOrder = 0, refetch: pendingOrderReload } = useQuery({
        queryKey: ['pendingOrder'],
        queryFn: async () => {
            const response = await axiosSecure.get('/orders/count/pending');
            return response.data.count;
        }
    });
    pendingOrderReload()

    const { data: cartLength = 0, refetch: cartsLengthReload } = useQuery({
        queryKey: ['cartLength', user1?.email],
        queryFn: async () => {
            if (user1.email) {
                const response = await axiosSecure.get(`/cart/length/${user1.email}`);
                return response.data.length;
            }
        }
    });
    cartsLengthReload();

    const { data: unreadUserNotification = 0, refetch: reloadUnreadUserNotification } = useQuery({
        queryKey: ['unreadUserNotification', user1?.email],
        queryFn: async () => {
            if (user1?.email) {
                const response = await axiosSecure.get(`/unreadUserNotification/unread/${user1.email}`);
                return response.data;
            }
            return 0;
        },
        enabled: !!user1?.email, // Enable the query only if the user email exists
    });
    reloadUnreadUserNotification();

    const { data: unreadEmployeeNotification = 0, refetch: reloadUnreadEmployeeNotification } = useQuery({
        queryKey: ['unreadEmployeeNotification', user1?.email],
        queryFn: async () => {
            if (user1?.email) {
                const res = await axiosSecure.get('/employeeByEmail', { params: { email: user1.email } })
                const response = await axiosSecure.get(`/unreadEmployeeNotification/unread/${res.data.employee_id}`);
                return response.data;
            }
            return 0;
        },
        enabled: !!user1?.email, // Enable the query only if the user email exists
    });
    reloadUnreadEmployeeNotification();




    const utilities = {
        isDarkMode,
        setIsSidebarOpen,
        toggleDarkMode,
        toggleSidebar,
        isSidebarOpen,
        unreadMessage,
        unreadMessageNumberReload,
        cartLength,
        cartsLengthReload,
        pendingOrder,
        pendingOrderReload,
        unreadUserNotification,
        reloadUnreadUserNotification,
        unreadEmployeeNotification,
        reloadUnreadEmployeeNotification,
        toggleSearchForm,
        showSearchForm,setShowSearchForm
    };

    return (
        <QueryClientProvider client={queryClient}>
            <UtilitiesContext.Provider value={utilities}>
                {children}
            </UtilitiesContext.Provider>
        </QueryClientProvider>
    );
};

UtilitiesProviders.propTypes = {
    children: PropTypes.node.isRequired
};

export default UtilitiesProviders;
