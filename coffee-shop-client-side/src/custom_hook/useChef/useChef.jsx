import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../providers/AuthProviders/AuthProviders';
import { useContext } from 'react';
import UseAxiosPublic from '../UseAxiosPublic/UseAxiosPublic';

const useChef = () => {
    const {  user1 } = useContext(AuthContext)
    const axiosPublic = UseAxiosPublic();

    const { data: isChef = false, isPending:isChefLoading } = useQuery({
        queryKey: ['Chef',user1],
        queryFn: async () => {
            const response =  await axiosPublic.get('/employeeByEmail', { params: { email: user1.email } });
            const user =  response.data
            return user.designation === 'Chef';
        }
    });
    return [isChef,isChefLoading];
};

export default useChef;