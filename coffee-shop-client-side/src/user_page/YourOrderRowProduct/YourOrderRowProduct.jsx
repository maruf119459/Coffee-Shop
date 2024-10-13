import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import UseAxiosPublic from '../../custom_hook/UseAxiosPublic/UseAxiosPublic';
import UseAxiosSecure from '../../custom_hook/UseAxiosSecure/UseAxiosSecure';

const YourOrderRowProduct = ({ product, orderStatus, orderId, reloadRatingValue }) => {
    const [ratingValue, setRatingValue] = useState(product.ratingValue || null);
    const axiosPublic = UseAxiosPublic();
    const axiosSecure = UseAxiosSecure();

    const { data, refetch } = useQuery({
        queryKey: ['coffeeRating', product.coffeeId],
        queryFn: async () => {
            const response = await axiosPublic.get(`/coffee/${product.coffeeId}`);
            return response.data;
        },
        enabled: !!product.coffeeId,
    });

    console.log(data)

    useEffect(() => {
        if (product.ratingValue) {
            setRatingValue(product.ratingValue);
        }
    }, [product]);

    const handleRatingSubmit = async (newRatingValue) => {
        const ratingCount = data?.ratingCount + 1;
        const totalRating = data?.totalRating + newRatingValue;
        const rating = totalRating / ratingCount;
        const updatedCoffee = { rating, ratingCount, totalRating };

        await axiosSecure.patch(`/coffee/${product.coffeeId}`, updatedCoffee);
        await axiosSecure.patch(`/order/${orderId}/product/${product.coffeeId}/ratingValue`, { ratingValue: newRatingValue });

        setRatingValue(newRatingValue);
        refetch();
        reloadRatingValue();
    };

    const showRatingDialog = () => {
        Swal.fire({
            title: 'Give Rating within 5',
            input: 'number',
            inputAttributes: {
                min: 0,
                max: 5,
                step: 0.1,
                placeholder: 'Enter Rating'
            },
            showCancelButton: true,
            confirmButtonText: 'Submit',
            preConfirm: (value) => {
                const newRatingValue = parseFloat(value);
                if (!newRatingValue || newRatingValue < 0 || newRatingValue > 5) {
                    Swal.showValidationMessage('Please enter a valid rating between 0 and 5');
                }
                return newRatingValue;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                handleRatingSubmit(result.value);
                Swal.fire('Submitted!', 'Your rating has been submitted.', 'success');
            }
        });
    };

    return (
        <tr>
            <td>
                <Link to={`/viewCoffeDetails/${product.coffeeId}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12">
                            <img src={product.coffeeImageUrl} alt={product.coffeeName} className="w-12 h-12" />
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
                <p>{product.coffeeSellPrice}</p>
            </td>
            <td>
                <p>{product.quantity}</p>
            </td>
            <td>
                <p>{product.quantity} x {product.coffeeSellPrice} = {product.quantity * product.coffeeSellPrice}</p>
            </td>
            {orderStatus === 'delivered' && (
                <td>
                    {product.ratingValue === undefined ? (
                        <button className="btn btn-sm btn-accent" onClick={showRatingDialog}>
                            Rating
                        </button>
                    ) : (
                        <p>{ratingValue}</p>
                    )}
                </td>
            )}
        </tr>
    );
};

export default YourOrderRowProduct;

YourOrderRowProduct.propTypes = {
    product: PropTypes.object.isRequired,
    orderStatus: PropTypes.string.isRequired,
    orderId: PropTypes.any.isRequired,
    reloadRatingValue: PropTypes.func.isRequired,
};
