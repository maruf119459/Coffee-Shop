import { useContext, useState } from "react";
import PropTypes from 'prop-types';
import { AuthContext } from "../../providers/AuthProviders/AuthProviders";

const OrderRowProduct = ({ product }) => {
    const [isChecked, setIsChecked] = useState(false)
    const { isAdmin, isEmployee } = useContext(AuthContext);
    const employee = isAdmin || isEmployee;

    const handleCheckBox = e => {
        let checked = e.target.checked;
        setIsChecked(checked)
    }


    return (
        <tr className={isChecked ? 'bg-green-300' : ''}>
            {
                employee && <th>
                    <label>
                        <input onChange={handleCheckBox} name="checked" type="checkbox" className="checkbox" />
                    </label>
                </th>
            }
            <td>
                <div className="flex items-center gap-3">
                    <div className=" w-12 h-12">
                        <img src={product.coffeeImageUrl} alt={product.coffeeName} className='w-12 h-12' />
                    </div>
                </div>
            </td>
            <td>
                <p>{product.coffeeName}</p>
            </td>
            <td>
                <p>{product.coffeeId}</p>
            </td>
            <td>
                <p>{product.coffeeSellPrice}</p>

            </td>
            <td>
                <p>{product.quantity}</p>

            </td>
            <td>
                <p>{product.quantity} x {product.coffeeSellPrice} = {product.quantity * product.coffeeSellPrice}</p>
            </td>

        </tr>
    );
};

export default OrderRowProduct;

OrderRowProduct.propTypes = {
    product: PropTypes.object,
}