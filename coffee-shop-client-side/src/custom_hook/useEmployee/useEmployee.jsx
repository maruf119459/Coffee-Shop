import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../providers/AuthProviders/AuthProviders';
import { useContext } from 'react';
import UseAxiosPublic from '../UseAxiosPublic/UseAxiosPublic';
const useEmployee = () => {
    const {  user1 } = useContext(AuthContext)
    const axiosPublic = UseAxiosPublic();

    const { data: isemployee = false, isPending:isEmployeeLoading } = useQuery({
        queryKey: ['employee',user1],
        queryFn: async () => {
            const response =  await axiosPublic.get('/employeeByEmail', { params: { email: user1.email } });
            const user =  response.data
            return user.userType === 'employee';
        }
    });
    return [isemployee,isEmployeeLoading];
};

export default useEmployee;