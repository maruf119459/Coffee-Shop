import { Helmet } from "react-helmet";

import Chart from "../Chart/Chart";

import ReadDailyReport from "../ReadDailyReport/ReadDailyReport";
import ReadMonthlyReport from "../ReadMonthlyReport/ReadMonthlyReport";
import { Link } from "react-router-dom";
import ReadYearlyReport from "../ReadYearlyReport/ReadYearlyReport";
import SellsBar from "../SellsBar/SellsBar";

const Sales = () => {

    return (
        <div className="mt-28 ms-28 ">
            <Helmet>
                <title>Espresso Emporium | Sales</title>
            </Helmet>
            <div>
                <SellsBar />
            </div>
            <div className="flex justify-center gap-x-3 mt-8">
                <Link to='/todaySells'><button className="btn btn-wide btn-accent">Today Sells</button></Link>
                <Link to='/monthSells'><button className="btn btn-wide btn-info"> This Month Sells</button></Link>
            </div>
            <div className="">
                <Chart></Chart>
            </div>
            <div>
                <ReadDailyReport />
            </div>
            <div>
                <ReadMonthlyReport />
            </div>
            <div>
                <ReadYearlyReport />
            </div>
        </div>
    );
};

export default Sales;