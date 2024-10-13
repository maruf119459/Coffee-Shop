import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../providers/AuthProviders/AuthProviders';
import { useContext } from 'react';
import UseAxiosPublic from '../UseAxiosPublic/UseAxiosPublic';

const useAdmin = () => {
    const {  user1 } = useContext(AuthContext)
    const axiosPublic = UseAxiosPublic();

    const { data: isadmin = false, isPending:isAdminLoading } = useQuery({
        queryKey: ['admin',user1],
        queryFn: async () => {
            const response =  await axiosPublic.get('/employeeByEmail', { params: { email: user1.email } });
            const user =  response.data
            return user.userType === 'admin';
        }
    });
    return [isadmin,isAdminLoading];
};

export default useAdmin;