import PropTypes from 'prop-types';
const YourPaymentRowProduct = ({ product, pathName, quantity }) => {

    return (
        <tr >
            <td>
                <div className="flex items-center gap-3">
                    <div className=" w-12 h-12">
                        {
                            (pathName === '/' || pathName === '/viewCoffeeList' || pathName === '/viewCoffeDetails' || pathName === '/loadDatabyCategory') ? <img className=" w-12 h-12" src={product.imageUrl} alt={product.name} /> : <img className=" w-12 h-12" src={product.coffeeImageUrl} alt={product.coffeeName} />
                        }

                    </div>
                </div>
            </td>
            <td>
                {
                    (pathName === '/' || pathName === '/viewCoffeeList' || pathName === '/viewCoffeDetails' || pathName === '/loadDatabyCategory') ? <p>{product.name}</p> : <p>{product.coffeeName} </p>
                }
            </td>
            <td>
                {
                    (pathName === '/' || pathName === '/viewCoffeeList' || pathName === '/viewCoffeDetails' || pathName === '/loadDatabyCategory') ? <p>{product._id}</p> : <p>{product.coffeeId} </p>
                }
            </td>
            <td>
                {
                    (pathName === '/' || pathName === '/viewCoffeeList' || pathName === '/viewCoffeDetails' || pathName === '/loadDatabyCategory') ? <p>{product.sellsPrice}</p> : <p>{product.coffeeSellPrice}</p>
                }
            </td>
            <td>
                {
                    (pathName === '/' || pathName === '/viewCoffeeList' || pathName === '/viewCoffeDetails' || pathName === '/loadDatabyCategory') ? <p>{quantity}</p> : <p>{product.quantity}</p>
                }
            </td>
            <td>
                {
                    (pathName === '/' || pathName === '/viewCoffeeList' || pathName === '/viewCoffeDetails' || pathName === '/loadDatabyCategory') ? <p>{quantity} x {product.sellsPrice} = {quantity * product.sellsPrice}</p> : <p>{product.quantity} x {product.coffeeSellPrice} = {product.quantity * product.coffeeSellPrice}</p>
                }
            </td>

        </tr>
    );
};

export default YourPaymentRowProduct;

YourPaymentRowProduct.propTypes = {
    product: PropTypes.object,
    quantity: PropTypes.number,
    pathName: PropTypes.string
}