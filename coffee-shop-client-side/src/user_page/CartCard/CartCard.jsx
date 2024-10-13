import { useContext, useState } from "react";
import PropTypes from 'prop-types';
import { FaMinus, FaPlus } from "react-icons/fa";
import UseAxiosSecure from "../../custom_hook/UseAxiosSecure/UseAxiosSecure";
import { Link } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProviders/AuthProviders";
import { useQuery } from '@tanstack/react-query';
import UseAxiosPublic from "../../custom_hook/UseAxiosPublic/UseAxiosPublic";
import Swal from "sweetalert2";

const CartCard = ({ cart, handleSelectProduct, refetch }) => {
    const { user1 } = useContext(AuthContext);
    const [, setIsChecked] = useState(false);
    const [quantity, setQuantity] = useState(cart.quantity);
    const axiosSecure = UseAxiosSecure();
    const axiosPublic = UseAxiosPublic();

    const { data: availableQuantity = 0, refetch: reloadAvailableQuantity } = useQuery({
        queryKey: ['availableQuantity', cart.coffeeId],
        queryFn: async () => {
            const response = await axiosPublic.get(`/coffee/${cart.coffeeId}`);
            return response.data.availableQuantity;
        }
    });
    reloadAvailableQuantity();
    const handleCheckBox = e => {
        let checked = e.target.checked;
        setIsChecked(checked);
        handleSelectProduct(cart.coffeeId, checked);
    };

    const handleIncrement = async () => {
        if (quantity < availableQuantity) {
            const updatedQuantity = quantity + 1;
            setQuantity(updatedQuantity);
            const email = user1?.email;
            const productId = cart.coffeeId;
            const response = await axiosSecure.patch(`/cart/${email}/${productId}`, { quantity: updatedQuantity });
            console.log(response)
            if (response.data.message !== 'Cart item updated successfully') {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Failed to update product quantity",
                    showConfirmButton: false,
                    timer: 3000
                });
            }
            refetch();
        }
    };

    const handleDecrement = async () => {
        if (quantity > 1) {
            const updatedQuantity = quantity - 1;
            setQuantity(updatedQuantity);
            const email = user1?.email;
            const productId = cart.coffeeId;
            const response = await axiosSecure.patch(`/cart/${email}/${productId}`, { quantity: updatedQuantity });
            console.log(response)

            if (response.data.message !== 'Cart item updated faild') {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Failed to update product quantity",
                    showConfirmButton: false,
                    timer: 3000
                });
            }
            refetch();
        }
    };

    return (
        <div>
            <div className="card w-96 bg-base-100 shadow-xl rounded-t-2xl font-poppins">
                <div className="relative bg-orange-200 rounded-t-2xl">
                    {availableQuantity > 0 ? (
                        <input
                            onChange={handleCheckBox}
                            name="checked"
                            type="checkbox"
                            className="checkbox mt-7 h-[20px] w-[20px] bg-[#fff] rounded-full absolute ms-4 mt-3"
                        />
                    ) : null}
                    <figure>
                        <Link to={`/viewCoffeDetails/${cart.coffeeId}`}>
                            <img src={cart.coffeeImageUrl} className="rounded-t-2xl h-[200px]" alt="coffee" />
                        </Link>
                    </figure>
                </div>
                <div className="card-body">
                    <Link to={`/viewCoffeDetails/${cart.coffeeId}`}>
                        <h2 className="card-title">{cart.coffeeName}</h2>
                    </Link>
                    <p>Price: {cart.coffeeSellPrice}</p>
                    <div className="flex items-center gap-x-3">
                        <span>Quantity: </span>
                        <button onClick={handleDecrement}><FaMinus /></button>
                        <span>{quantity}</span>
                        <button onClick={handleIncrement}><FaPlus /></button>
                    </div>
                    <p>Total Price: {quantity} x {cart.coffeeSellPrice} = {quantity * cart.coffeeSellPrice}</p>
                </div>
                <p className="pb-4 text-center">Available Quantity in our shop: {availableQuantity}</p>
            </div>
        </div>
    );
};

CartCard.propTypes = {
    cart: PropTypes.object.isRequired,
    handleSelectProduct: PropTypes.func.isRequired,
    refetch: PropTypes.func.isRequired,
};

export default CartCard;
