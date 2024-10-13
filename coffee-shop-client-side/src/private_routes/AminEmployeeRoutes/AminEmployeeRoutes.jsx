
import { useContext } from "react";
import PropTypes from 'prop-types';
import useAdmin from "../../custom_hook/useAdmin/useAdmin";
import { AuthContext } from "../../providers/AuthProviders/AuthProviders";
import { Navigate } from "react-router-dom";
import useEmployee from "../../custom_hook/useEmployee/useEmployee";

const AminEmployeeRoutes = ({children}) => {
    const [isadmin,isAdminLoading] = useAdmin();
    const [isemployee,isEmployeeLoading]  = useEmployee();
    const {user1,userLoading   } = useContext(AuthContext)
    if(isAdminLoading || userLoading || isEmployeeLoading){
        return <div className="mt-16 h-screen">
            <progress className="progress w-[100%]"></progress>
        </div>
    }
    if((isadmin || isemployee) && user1) {
        return children;
    }

    return <Navigate to="/forbiddenAccess4O3"  replace></Navigate>


};

export default AminEmployeeRoutes;
AminEmployeeRoutes.propTypes = {
    children: PropTypes.node.isRequired
};