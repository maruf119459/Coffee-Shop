
import {  ResponsiveContainer,PieChart, Cell, Pie } from 'recharts';
import UseAxiosSecure from '../../custom_hook/UseAxiosSecure/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const PieChartView = () => {
    
    const axiosSecure = UseAxiosSecure();
    const { data: coffeeCategory = [], isLoading } = useQuery({
        queryKey: ['coffeeCategory'],
        queryFn: async () => {
            const coffeeCategoryResponse = await axiosSecure.get(`/categoryBySells`);
            return coffeeCategoryResponse.data;
        }
    });
console.log(coffeeCategory)
    if (isLoading) {
        return <div>Loading...</div>;
    }
    const data = coffeeCategory.map(category => ({
        name: category.name,
        value: category.quantity
    }));
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };
    return (
        <div>
            <div className='flex flex-col justify-center items-center '>
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title ">Compare among category items sales  </div>
                        <div className="stat-title text-[#8884d8] flex items-center justify-center gap-x-5 mt-2">
                            <div className='flex flex-col items-center'>
                                <div className='w-4 h-4 bg-[#0088FE]'></div>
                                <dir><p>Platinum</p></dir>
                            </div>
                            <div className='flex flex-col items-center'>
                                <div className='w-4 h-4 bg-[#00C49F]'></div>
                                <dir><p>Gold</p></dir>
                            </div>
                            <div className='flex flex-col items-center'>
                                <div className='w-4 h-4 bg-[#FFBB28]'></div>
                                <dir><p>Sliver</p></dir>
                            </div>
                        </div>

                    </div>

                </div>

                <div className='w-[400px] h-[300px]'>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart width={400} height={400}>
                            <Pie

                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>

                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default PieChartView;