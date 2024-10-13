import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Rectangle } from 'recharts';
import UseAxiosSecure from '../../custom_hook/UseAxiosSecure/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const BarChartView = () => {
    const axiosSecure = UseAxiosSecure();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const today = new Date();
    const currentYear = today.getFullYear();
    const lastYear = parseInt(currentYear) - 1;
    const { data: currentYearData = [], isLoading, refetch: reloadCurrentYearData } = useQuery({
        queryKey: ['currentYearData', currentYear],
        queryFn: async () => {
            const currentYearResponse = await axiosSecure.get(`/yearlySells/${currentYear}`);
            // sort the data by asending order accroding monthCode
            return currentYearResponse.data.sort((a, b) => a.monthCode - b.monthCode);
        }
    });
    const { data: lastYearData = [], isLoading: isPending, refetch: reloadLastYearData } = useQuery({
        queryKey: ['lastYearData', lastYear],
        queryFn: async () => {
            const lastYearResponse = await axiosSecure.get(`/yearlySells/${lastYear}`);
            // sort the data by asending order accroding monthCode
            return lastYearResponse.data.sort((a, b) => a.monthCode - b.monthCode);
        }
    });
    if (isLoading || isPending) {
        return <div>Loading...</div>;
    }
    reloadCurrentYearData();
    reloadLastYearData();

    const data = [];
    for(let i = 0 ; i<12; i++){
        const lastYearMonthCode = lastYearData[i]?.monthCode
        const currentYearMonthCde = currentYearData[i]?.monthCode
        if(lastYearMonthCode=== i+1 || currentYearMonthCde === i + 1){
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const Month = months[i];
            const currentYearSells = currentYearData[i]?.dailySells?.reduce((total, dailySell) => total + dailySell.totalSells, 0) || 0
            const lastYearSells = lastYearData[i]?.dailySells?.reduce((total, dailySell) => total + dailySell.totalSells, 0) || 0
            const obj = {Month,currentYearSells, lastYearSells}
            data.push(obj)
        }
        else{
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const Month = months[i];
            const currentYearSells = 0;
            const lastYearSells = 0
            const obj = {Month,currentYearSells, lastYearSells}
            data.push(obj)

        }
    }

    // console.log(data)
    

    return (
        <div className='flex flex-col items-center justify-center gap-y-3'>
            <div>
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title ">Sells Compare: Last Year Vs Current Year </div>
                        <div className="stat-title text-[#8884d8]">Last Year: {lastYear}</div>
                        <div className="stat-title text-[#82ca9d]">Current Year: {currentYear}</div>
                        <div className="stat-value">Current Month: {months[today.getMonth()]}</div>
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
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="currentYearSells" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                            <Bar dataKey="lastYearSells" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div>
                <div className=" px-3 py-4 card bg-teal-300	font-raleway rounded-box place-items-center">x axis Month & y axis money</div>
            </div>
        </div>
    );
};

export default BarChartView;