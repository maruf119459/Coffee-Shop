import { Helmet } from "react-helmet";
import CartCard from "../CartCard/CartCard";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from "../../providers/AuthProviders/AuthProviders";
import UseAxiosSecure from '../../custom_hook/UseAxiosSecure/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from "sweetalert2";
import { UtilitiesContext } from "../../providers/UtilitiesProviders/UtilitiesProviders";

const Cart = () => {
    const { user1 } = useContext(AuthContext);
    const { cartLength, cartsLengthReload } = useContext(UtilitiesContext);
    const [selectedProducts, setSelectedProduct] = useState([]);
    const axiosSecure = UseAxiosSecure();
    const navigate = useNavigate();
    const location = useLocation();

    const { data: carts = [], refetch } = useQuery({
        queryKey: ['cartItems', user1.email],
        queryFn: async () => {
            const response = await axiosSecure.get(`/cart/${user1.email}`);
            return response.data;
        }
    });

    const handleSelectProduct = (productId, isChecked) => {
        if (isChecked) {
            setSelectedProduct(prevIds => [...prevIds, productId]);
        } else {
            setSelectedProduct(prevIds => prevIds.filter(id => id !== productId));
        }
    };

    const checkOut = () => {
        if (selectedProducts.length === 0) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Please select product to check-out",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }
        const pathName = location.pathname;
        navigate('/payment', { state: { selectedProducts, pathName } });
    };

    const deleteCartProduct = async () => {
        if (selectedProducts.length === 0) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Please select product to delete",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        try {
            const response = await axiosSecure.delete(`/cart/${user1.email}`, {
                data: { productIds: selectedProducts }
            });
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${response.data.deletedCount} products deleted successfully`,
                showConfirmButton: false,
                timer: 1500
            });
            cartsLengthReload();
            refetch();
            setSelectedProduct([]);
        } catch (error) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Failed to delete products",
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    const findTotalPrice = () => {
        return selectedProducts.reduce((total, productId) => {
            const cartItem = carts.find(cart => cart.coffeeId === productId);
            return total + (cartItem ? cartItem.coffeeSellPrice * cartItem.quantity : 0);
        }, 0);
    };

    const totalSelectedProductQuantity = () => {
        return selectedProducts.reduce((total, productId) => {
            const cartItem = carts.find(cart => cart.coffeeId === productId);
            return total + (cartItem ? cartItem.quantity : 0);
        }, 0);
    };

    return (
        <div className="mt-[74px] ms-20 mb-12">
            <Helmet>
                <title>{`Espresso | Cart ${cartLength}`}</title>
            </Helmet>
            <div>
                <div className="bg-rose-400 p-3 flex items-center justify-around font-poppins text-[18px] mb-6">
                    <button className="btn btn-error" onClick={deleteCartProduct}>Delete</button>
                    <p>Total Selected Product: {selectedProducts.length}</p>
                    <p>Total Product Quantity: {totalSelectedProductQuantity()}</p>
                    <p>Total Price: {findTotalPrice()}</p>
                    <button className="btn btn-warning" onClick={checkOut}>Check Out</button>
                </div>
                <div className="ms-8">
                    <h1 className="text-center pb-4 text-[45px] font-rancho secondary-h1 text-shadow-lg mb-6">Total Product: {cartLength}</h1>
                    <div className="grid grid-cols-3 gap-4">
                        {carts.map(cart => (
                            <CartCard
                                key={cart.coffeeId}
                                cart={cart}
                                handleSelectProduct={handleSelectProduct}
                                refetch={refetch}
                                user={user1}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
