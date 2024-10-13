import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const HistoryCard = ({history}) => {
    return (
        <div>
            <Link to={`/historyDetails/${history._id}`}>
                <div className= 'w-[800px] mx-auto font-raleway bg-[#ECEAE3] p-3 rounded-lg mb-4'>
                    <div className='flex itms-center justify-around mb-1'>
                        <p>Order Id: <span className='font-poppins'>{history._id}</span></p>
                        <p>Total Price: <span className='font-poppins'>{history.totalPrice}</span> Tk</p>
                        <p>Date: <span className='font-poppins'>{history.date}</span></p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default HistoryCard;
HistoryCard.propTypes = {
    history: PropTypes.object
};