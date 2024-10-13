import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProviders/AuthProviders";
import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';
import useAdmin from "../../custom_hook/useAdmin/useAdmin";
import useEmployee from "../../custom_hook/useEmployee/useEmployee";

const PrivateRoutes = ({children}) => {
    const {user1,userLoading  } = useContext(AuthContext)
    const [isemployee]  = useEmployee();
    const [isadmin] = useAdmin();

    
    if(userLoading ){
        return <div className="mt-16 h-screen">
            <progress className="progress w-[100%]"></progress>
        </div>
    }
    if((!isemployee & !isadmin)&& user1) {
        return children;
    }

    return <Navigate to="/forbiddenAccess4O3"  replace></Navigate>
};

export default PrivateRoutes;
PrivateRoutes.propTypes = {
    children: PropTypes.node.isRequired
};