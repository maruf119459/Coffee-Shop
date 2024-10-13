import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "../../custom_hook/UseAxiosSecure/UseAxiosSecure";
import { FaUsers } from "react-icons/fa";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";

const SellsBar = () => {
    const axiosSecure = UseAxiosSecure();

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthIndex = today.getMonth();
    const lastMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
    const prevMonthIndex = currentMonthIndex <= 1 ? 11 : currentMonthIndex - 2;

    const lastMonth = months[lastMonthIndex];
    const prevMonth = months[prevMonthIndex];

    const lastMonthYear = lastMonthIndex === 11 ? currentYear - 1 : currentYear;
    const prevMonthYear = prevMonthIndex === 11 ? currentYear - 1 : currentYear;

    const lastMonthName = `${lastMonth}-${lastMonthYear}`;
    const prevMonthName = `${prevMonth}-${prevMonthYear}`;

    const { data: lastMonthSellsData = [] } = useQuery({
        queryKey: ['lastMonthSellsData', lastMonthName],
        queryFn: async () => {
            const lastMonthResponse = await axiosSecure.get(`/monthlySells/${lastMonthName}`);
            return lastMonthResponse.data.dailySells;
        }
    });

    const { data: prevMonthSellsData = [] } = useQuery({
        queryKey: ['prevMonthSellsData', prevMonthName],
        queryFn: async () => {
            const prevMonthResponse = await axiosSecure.get(`/monthlySells/${prevMonthName}`);
            return prevMonthResponse.data.dailySells;
        }
    });

    const { data: userCount = {} } = useQuery({
        queryKey: ['userCount'],
        queryFn: async () => {
            const userCountResponse = await axiosSecure.get(`/users/count`);
            return userCountResponse.data;
        }
    });

    let prevMonthTotalSells = 0;
    let prevMonthTotalRevenue = 0;

    prevMonthSellsData?.forEach(day => {
        prevMonthTotalSells += day.totalSells;
        prevMonthTotalRevenue += day.totalRevenue;
    });

    let lastMonthTotalSells = 0;
    let lastMonthTotalRevenue = 0;

    lastMonthSellsData?.forEach(day => {
        lastMonthTotalSells += day.totalSells;
        lastMonthTotalRevenue += day.totalRevenue;
    });

    const sellsDifference = lastMonthTotalSells - prevMonthTotalSells;
    const sellsPercentageChange = ((sellsDifference / prevMonthTotalSells) * 100).toFixed(2);

    const revenueDifference = lastMonthTotalRevenue - prevMonthTotalRevenue;
    const revenuePercentageChange = ((revenueDifference / prevMonthTotalRevenue) * 100).toFixed(2);

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num;
    };

    return (
        <div className="flex justify-center">
            <div className="stats shadow bg-slate-200">
                <div className="stat flex items-center">
                    <div>
                        <div className="stat-title text-[18px]">Total Sells <span className="label-text-alt">in last month</span></div>
                        <div className="stat-value text-primary">{formatNumber(lastMonthTotalSells)}</div>
                        <div className="stat-desc">{sellsPercentageChange}% sells {sellsDifference >= 0 ? 'increase' : 'decrease'} compared to previous month</div>
                    </div>
                    <div>
                        <MdOutlineAttachMoney className="text-[40px]" />
                    </div>
                </div>

                <div className="stat flex items-center">
                    <div>
                        <div className="stat-title text-[18px]">Total Revenue <span className="label-text-alt">in last month</span></div>
                        <div className="stat-value text-secondary">{formatNumber(lastMonthTotalRevenue)}</div>
                        <div className="stat-desc">{revenuePercentageChange}% revenue {revenueDifference >= 0 ? 'increase' : 'decrease'} compared to previous month</div>
                    </div>
                    <div>
                        <FaRegMoneyBillAlt className="text-[40px]" />
                    </div>
                </div>

                <div className="stat flex items-center">
                    <div>
                        <div className="stat-title">Total User</div>
                        <div className="stat-value text-secondary">{formatNumber(userCount.count)}</div>
                    </div>
                    <div className="">
                        <FaUsers className="text-[40px]"></FaUsers>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellsBar;
