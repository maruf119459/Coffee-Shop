
import BarChartView from '../BarChart/BarChartView';
import CoffeeSellsChart from '../CoffeeSellsChart/CoffeeSellsChart';
import LineChartView from '../LineChart/LineChartView';
import PieChartView from '../PieChart/PieChartView';
import RatingViewChart from '../RatingViewChart/RatingViewChart';
import TopSellsCoffeeLastThirtyDays from '../TopSellsCoffeeLastThirtyDays/TopSellsCoffeeLastThirtyDays';


const Chart = () => {



    return (
        <div>
            <div className="divider divider-accent mx-10 me-20 my-12"></div>
            <div className='flex flex-col justify-center items-center my-12'>
                <div className='flex justify-center items-center'>
                    <LineChartView />
                    <BarChartView />
                </div>
                <div className="divider divider-accent mx-10 me-20 my-12"></div>
            </div>
            <div className='flex flex-col justify-center items-center my-12'>
                <div className='flex justify-center items-center'>
                    <PieChartView />
                    <CoffeeSellsChart />
                </div>
                <div className="divider divider-accent mx-10 me-20 my-12"></div>
            </div>
            <div className='flex flex-col justify-center items-center my-12'>
                <div className='flex justify-center items-center'>
                    <RatingViewChart />
                    <TopSellsCoffeeLastThirtyDays />
                </div>
            </div>

        </div>
    );
};

export default Chart;


