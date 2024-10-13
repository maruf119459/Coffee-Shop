import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import UseAxiosSecure from '../../custom_hook/UseAxiosSecure/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
const LineChartView = () => {
    const axiosSecure = UseAxiosSecure();

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthIndex = today.getMonth();
    const lastMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
    const currentMonthName = months[currentMonthIndex];
    const lastMonthName = currentMonthIndex === 0 ? months[11] : months[currentMonthIndex - 1];
    const lastMonthYear = currentMonthIndex === 0 ? currentYear - 1 : currentYear;
    const currentMonth = `${currentMonthName}-${currentYear}`;
    const lastMonth = `${lastMonthName}-${lastMonthYear}`;
    const dd = String(today.getDate()).padStart(2, '0');
    const date = `${currentYear}-${months[today.getMonth()]}-${dd}`;

    const { data: currentMonthData = [], refetch: reloadCurrentMonthData } = useQuery({
        queryKey: ['currentMonthData', currentMonth],
        queryFn: async () => {
            const currentMonthResponse = await axiosSecure.get(`/monthlySells/${currentMonth}`);
            return currentMonthResponse.data.dailySells.sort((a, b) => new Date(a.date) - new Date(b.date));
        }
    });
    const { data: lastMonthData = [], refetch: reloadLastMonthData } = useQuery({
        queryKey: ['lastMonthData', lastMonth],
        queryFn: async () => {
            const lastMonthResponse = await axiosSecure.get(`/monthlySells/${lastMonth}`);
            return lastMonthResponse.data.dailySells.sort((a, b) => new Date(a.date) - new Date(b.date));
        }
    });
   
    reloadCurrentMonthData()
    reloadLastMonthData()
    console.log(currentMonthData)
    console.log(lastMonthData)



    const data = [];


    if (days[currentMonthIndex] > days[lastMonthIndex]) {
        for (let i = 0; i < days[currentMonthIndex]; i++) {
            const date = parseInt(currentMonthData[i]?.date?.split('-')[2] || i+1)
            if (date === i + 1) {
                const current = date;
                const Current_Month = currentMonthData[i]?.totalSells || 0;
                const Last_Month = lastMonthData[i]?.totalSells || 0;
                const obj = { date: current, Current_Month, Last_Month }
                data.push(obj)
            } else {
                const current = i + 1;
                const Current_Month = 0;
                const Last_MonthDate = parseInt(lastMonthData?.date?.split('-')[2])
                let Last_Month = 0;
                if (Last_MonthDate === i + 1) {
                    Last_Month = lastMonthData?.totalSells;
                }
                const obj = { date: current, Current_Month, Last_Month }
                data.push(obj)
            }

        }
    }
    else {
        for (let i = 0; i < days[lastMonthIndex]; i++) {
            const date = parseInt(lastMonthData[i]?.date?.split('-')[2] || i+1) 
            if (date === i + 1) {
                const Current_Month = currentMonthData[i]?.totalSells || 0;
                const Last_Month = lastMonthData[i]?.totalSells || 0;
                const obj = { date, Current_Month, Last_Month }
                data.push(obj)
            } else {
                const Current_Month = currentMonthData[i]?.totalSells || 0;
                const Last_Month = 0;
                const obj = { date, Current_Month, Last_Month }
                data.push(obj)
            }

        }
    }
    return (
        <div className='flex flex-col items-center justify-center gap-y-3'>
            <div>
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title ">Sells Compare: Last Month Vs Current Month </div>
                        <div className="stat-title text-[#8884d8]">Last Month: {lastMonth}. Total Days: {days[lastMonthIndex]}</div>
                        <div className="stat-title text-[#82ca9d]">Current Month: {currentMonth}. Total Days: {days[currentMonthIndex]}</div>
                        <div className="stat-value">Today: {date}</div>
                    </div>

                </div>
            </div>
            <div>
                <div className='w-[600px] h-[300px]'>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
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
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Current_Month" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="Last_Month" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div>
                <div className=" px-3 py-4 card bg-green-300 font-raleway rounded-box place-items-center">x axis date & y axis money</div>
            </div>
        </div>
    );
};

export default LineChartView;