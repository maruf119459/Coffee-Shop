import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import UseAxiosSecure from '../../custom_hook/UseAxiosSecure/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const CoffeeSellsChart = () => {
    const axiosSecure = UseAxiosSecure();
    const { data: topSellsCoffee = [], isLoading } = useQuery({
        queryKey: ['topSellsCoffee'],
        queryFn: async () => {
            const topSellsCoffeeResponse = await axiosSecure.get(`/topTenSellsCoffee`);
            return topSellsCoffeeResponse.data;
        }
    });
//TopSellsCoffeeLastThirtyDays
    if (isLoading) {
        return <div>Loading...</div>;
    }

    const data = topSellsCoffee.map(coffee => ({
        name: coffee.name,
        sellsAmount: coffee.sellsAmount
    }));

    return (
        <div className='flex flex-col items-center justify-center gap-y-3'>
            <div>
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">Top Sells Coffee Chart</div>
                    </div>
                </div>
            </div>
            <div>
                <div className='w-[600px] h-[300px]'>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                            barSize={20}
                        >
                            <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Bar dataKey="sellsAmount" fill="#8884d8" background={{ fill: '#eee' }} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div>
                <div className="px-3 py-4 card bg-teal-300 font-raleway rounded-box place-items-center">
                    x axis coffee Name & y axis sells
                </div>
            </div>
        </div>
    );
};

export default CoffeeSellsChart;
