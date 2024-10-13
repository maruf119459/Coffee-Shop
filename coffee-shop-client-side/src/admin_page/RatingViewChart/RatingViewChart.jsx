import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import UseAxiosSecure from '../../custom_hook/UseAxiosSecure/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const RatingViewChart = () => {
    const axiosSecure = UseAxiosSecure();
    const { data: topRatingCoffee = [], isLoading } = useQuery({
        queryKey: ['topRatingCoffee'],
        queryFn: async () => {
            const topRatingCoffeeResponse = await axiosSecure.get(`/topTenCoffee`);
            return topRatingCoffeeResponse.data;
        }
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const data = topRatingCoffee.map(coffee => ({
        name: coffee.name,
        rating:  parseFloat(coffee.rating.toFixed(1))
    }));
   
    return (
        <div className='flex flex-col items-center justify-center gap-y-3'>
            <div>
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">Top Rating Coffee Chart</div>
                    </div>
                </div>
            </div>
            <div>
                <div className='w-[600px] h-[300px]'>
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            width={800}
                            height={400}
                            data={data}
                            margin={{
                                top: 20,
                                right: 20,
                                bottom: 20,
                                left: 20,
                            }}
                        >
                            <CartesianGrid stroke="#f5f5f5" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="rating" barSize={20} fill="#413ea0" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div>
                <div className="px-3 py-4 card bg-teal-300 font-raleway rounded-box place-items-center">
                    x axis coffee Name & y axis rating
                </div>
            </div>
        </div>
    );
};

export default RatingViewChart;
