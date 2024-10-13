import { useContext } from "react";
import PropTypes from 'prop-types';
import { AuthContext } from "../../providers/AuthProviders/AuthProviders";
import { Navigate } from "react-router-dom";
import useEmployee from "../../custom_hook/useEmployee/useEmployee";
import useChef from "../../custom_hook/useChef/useChef";
import useAdmin from "../../custom_hook/useAdmin/useAdmin";

const NotChefRoutes = ({children}) => {
    const [isemployee,isEmployeeLoading]  = useEmployee();
    const [isChef, isChefLoading] = useChef();
    const [isadmin, isAdminLoading] = useAdmin();

    const {user1,userLoading   } = useContext(AuthContext)
    if(isEmployeeLoading || userLoading ||isChefLoading || isAdminLoading){
        return <div className="mt-16 h-screen">
             <progress className="progress w-[100%]"></progress>
        </div>
    }
    if((isadmin || isemployee) && user1 && !isChef) {
        return children
    }

    return <Navigate to="/forbiddenAccess4O3"  replace></Navigate>


};

export default NotChefRoutes;
NotChefRoutes.propTypes = {
    children: PropTypes.node.isRequired
};