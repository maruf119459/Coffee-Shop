import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const HistoryRowProduct = ({ product }) => {



    return (
        <tr>
            <td>
                <Link to={`/viewCoffeDetails/${product.coffeeId}`}>
                    <div className="flex items-center gap-3">
                        <div className=" w-12 h-12">
                            <img src={product.coffeeImageUrl} alt={product.coffeeName} className='w-12 h-12' />
                        </div>
                    </div>
                </Link>
            </td>
            <td>
                <Link to={`/viewCoffeDetails/${product.coffeeId}`}>
                    <p>{product.coffeeName}</p>
                </Link>
            </td>
            <td>
                <Link to={`/viewCoffeDetails/${product.coffeeId}`}>
                    <p>{product.coffeeId}</p>
                </Link>
            </td>
            <td>
                <Link to={`/viewCoffeDetails/${product.coffeeId}`}>
                    <p>{product.coffeeSellPrice}</p>
                </Link>
            </td>
            <td>
                <Link to={`/viewCoffeDetails/${product.coffeeId}`}>
                    <p>{product.quantity}</p>
                </Link>
            </td>
            <td>
                <Link to={`/viewCoffeDetails/${product.coffeeId}`}>
                    <p>{product.quantity} x {product.coffeeSellPrice} = {product.quantity * product.coffeeSellPrice}</p>
                </Link>
            </td>

        </tr>
    );
};

export default HistoryRowProduct;

HistoryRowProduct.propTypes = {
    product: PropTypes.object,
}