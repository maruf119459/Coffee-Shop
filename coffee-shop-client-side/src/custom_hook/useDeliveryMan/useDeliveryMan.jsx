import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../providers/AuthProviders/AuthProviders';
import { useContext } from 'react';
import UseAxiosPublic from '../UseAxiosPublic/UseAxiosPublic';

const useDeliveryMan = () => {
    const {  user1 } = useContext(AuthContext)
    const axiosPublic = UseAxiosPublic();

    const { data: isDeliveryMan = false, isPending:isDeliveryManLoading } = useQuery({
        queryKey: ['DeliveryMan',user1],
        queryFn: async () => {
            const response =  await axiosPublic.get('/employeeByEmail', { params: { email: user1.email } });
            const user =  response.data
            return user.designation === 'Delivery Man';
        }
    });
    return [isDeliveryMan,isDeliveryManLoading];
};

export default useDeliveryMan;