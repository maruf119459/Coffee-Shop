
import { useContext } from "react";
import PropTypes from 'prop-types';
import { AuthContext } from "../../providers/AuthProviders/AuthProviders";
import { Navigate } from "react-router-dom";
import useEmployee from "../../custom_hook/useEmployee/useEmployee";

const EmployeeRoutes = ({children}) => {
    const [isemployee,isEmployeeLoading]  = useEmployee();
    const {user1,userLoading   } = useContext(AuthContext)
    if(isEmployeeLoading || userLoading){
        return <div className="mt-16 h-screen">
             <progress className="progress w-[100%]"></progress>
        </div>
    }
    if(isemployee && user1) {
        return children;
    }

    return <Navigate to="/forbiddenAccess4O3"  replace></Navigate>


};

export default EmployeeRoutes;
EmployeeRoutes.propTypes = {
    children: PropTypes.node.isRequired
};