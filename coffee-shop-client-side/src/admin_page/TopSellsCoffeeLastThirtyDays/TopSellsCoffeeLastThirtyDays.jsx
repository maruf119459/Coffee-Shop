import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import UseAxiosSecure from "../../custom_hook/UseAxiosSecure/UseAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const TopSellsCoffeeLastThirtyDays = () => {
    // 
    //     
    // return response.data;

    const axiosSecure = UseAxiosSecure();

    const today = new Date();
    const endDate = today.toISOString().split('T')[0]; // Today's date

    // Calculate the date 30 days ago
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 30);

    // Format the date as yyyy-mm-dd
    const startDate = pastDate.toISOString().split('T')[0];

    const { data: topSellsCoffeeLastThirtyDays = [], isLoading } = useQuery({
        queryKey: ['topSellsCoffeeLastThirtyDays', startDate, endDate],
        queryFn: async () => {
            const response = await axiosSecure.get('/getDataBetweenDates', { params: { startDate, endDate } });
            return response.data;
        }
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }
    console.log('topSellsCoffeeLastThirtyDays',topSellsCoffeeLastThirtyDays)


    // Iterate over each day's sales data
    const calculateTotalSells = (data) => {
        const coffeeTotals = {};
    
        data.forEach(entry => {
            entry.sellsCoffees.forEach(coffee => {
                const { coffeeName, sellsQuantity } = coffee;
                if (!coffeeTotals[coffeeName]) {
                    coffeeTotals[coffeeName] = 0;
                }
                coffeeTotals[coffeeName] += sellsQuantity;
            });
        });
    
        return Object.keys(coffeeTotals).map(coffeeName => ({
            name: coffeeName,
            quantity: coffeeTotals[coffeeName]
        }));
    };
    
    const data = calculateTotalSells(topSellsCoffeeLastThirtyDays);
    return (
        <div className='flex flex-col items-center justify-center gap-y-3'>
            <div>
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title ">Last 30 days Top Sells and Trending Coffee Chart</div>
                    </div>

                </div>
            </div>
            <div>
                <div className='w-[600px] h-[300px]'>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart
                            width={800}
                            height={400}
                            data={data}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line connectNulls type="monotone" dataKey="quantity" stroke="#8884d8" fill="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div>
                <div className=" px-3 py-4 card bg-teal-300	font-raleway rounded-box place-items-center">x axis coffee Name & y axis sells</div>
            </div>
        </div>
    );
};

export default TopSellsCoffeeLastThirtyDays;


