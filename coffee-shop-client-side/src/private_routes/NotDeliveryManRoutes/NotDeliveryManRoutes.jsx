import { useContext } from "react";
import PropTypes from 'prop-types';
import { AuthContext } from "../../providers/AuthProviders/AuthProviders";
import { Navigate } from "react-router-dom";
import useEmployee from "../../custom_hook/useEmployee/useEmployee";
import useAdmin from "../../custom_hook/useAdmin/useAdmin";
import useDeliveryMan from "../../custom_hook/useDeliveryMan/useDeliveryMan";


const NotDeliveryManRoutes = ({children}) => {
    const [isemployee,isEmployeeLoading]  = useEmployee();
    const [isadmin, isAdminLoading] = useAdmin();
    const [isDeliveryMan, isDeliveryManLoading] = useDeliveryMan()

    const {user1,userLoading   } = useContext(AuthContext)
    if(isEmployeeLoading || userLoading ||isDeliveryManLoading || isAdminLoading){
        return <div className="mt-16 h-screen">
             <progress className="progress w-[100%]"></progress>
        </div>
    }
    if((isadmin || isemployee) && user1 && !isDeliveryMan) {
        return children
    }

    return <Navigate to="/forbiddenAccess4O3"  replace></Navigate>


};

export default NotDeliveryManRoutes;
NotDeliveryManRoutes.propTypes = {
    children: PropTypes.node.isRequired
};