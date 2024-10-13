import { createContext, useEffect, useState, } from "react";
import PropTypes from 'prop-types';
import UseAxiosPublic from "../../custom_hook/UseAxiosPublic/UseAxiosPublic";
import auth from "../../Firebase/firebase.config";
import { GoogleAuthProvider, createUserWithEmailAndPassword, deleteUser, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile,updatePassword } from "firebase/auth";

export const AuthContext = createContext(null);

const AuthProviders = ({ children }) => {
    const [user1, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false)
    const [isAdminLoading, setIsAdminLoading] = useState(true)
    const [isEmployee, setIsEmployee] = useState(false)
    const [isEmployeeLoading, setIsEmployeeLoading] = useState(true)

    const googleProvider = new GoogleAuthProvider();
    const axiosPublic = UseAxiosPublic();

    const createUser = (email, password) => {
        setUserLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signIn = (email, password) => {
        // setUserLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const googleSignIn = () => {
        // setUserLoading(true);
        return signInWithPopup(auth, googleProvider);
    }

    const logOut = () => {
        setUserLoading(true);
        return signOut(auth);
    }

    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name, imageUrl: photo
        });
    }

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email)
    }

    const accountDelete = () =>{
        return deleteUser(user1);
    }

    const passwordUpdate = (newPassword) =>{
        return updatePassword(user1,newPassword);
    }

    console.log(user1?.email)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            console.log('current user: ', currentUser)
            if (currentUser) {
                setUser(currentUser);
                setUserLoading(false);
                const response = await axiosPublic.get('/employeeByEmail', { params: { email: currentUser.email } });
                const user = response.data
                if (user.userType === 'admin') {
                    setIsAdmin(true)
                    setIsAdminLoading(false)
                }
                if (user.userType === 'employee') {
                    setIsEmployee(true)
                    setIsEmployeeLoading(false)
                }
                // get token and store client
                // const userInfo = { email: currentUser.email };
                // axiosPublic.post('/jwt', userInfo)
                //     .then(res => {
                //         if (res.data.token) {
                //             localStorage.setItem('access-token', res.data.token);
                //             setUserLoading(false);
                //         }
                //     })
            }
            else {
                // TODO: remove token (if token stored in the client side: Local storage, caching, in memory)
                // localStorage.removeItem('access-token');
                setUserLoading(false);
                
            }

        });
        return () => {
            return unsubscribe();
        }
    }, [axiosPublic])



    // const user = null
    const user = {
        userType: 'admin'
    }
    const authInfo = {
        user,
        isAdmin,
        isAdminLoading,
        isEmployee,
        isEmployeeLoading,
        user1,
        userLoading,
        createUser,
        signIn,
        googleSignIn,
        logOut,
        updateUserProfile,
        resetPassword,
        accountDelete,
        passwordUpdate
    }






    /*
     const user = {
        userType: 'user'
    } 
    const user = {
        userType: 'admin'
    }

     const user = {
        userType: 'employee'
    }

    const user = {
        userType: 'user'
    }

    const user1 = {
        userType: ''
    }
    */

    return (
        <AuthContext.Provider value={authInfo}>
            {
                children
            }
        </AuthContext.Provider>
    );
};

export default AuthProviders;
AuthProviders.propTypes = {
    children: PropTypes.node.isRequired
};
