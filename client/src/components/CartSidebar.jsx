import { useEffect } from "react";
import useCartStore from "../store/cartStore";
import "../styles/components/cartSidebar.css";

const CartSidebar = ({ isOpen, onClose }) => {
    const {
        items,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
    } = useCartStore(); const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    ); useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";     return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]); return (
        <>
            {isOpen && (
                <div
                    className="cart-overlay"
                    onClick={onClose}
                />
            )}         <aside
                className={`cart-sidebar ${isOpen ? "cart-sidebar-open" : ""
                    }`}
            >
                <div className="cart-sidebar-header">
                    <h2>Shopping Cart</h2>                 <button
                        type="button"
                        onClick={onClose}
                        className="cart-close"
                    >
                        ×
                    </button>
                </div>             <div className="cart-sidebar-body">
                    {items.length === 0 ? (
                        <div className="empty-cart">
                            <h3>Your cart is empty</h3>
                            <p>Add some products to your cart.</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                className="cart-item"
                                key={item.id}
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="cart-item-image"
                                />                             <div className="cart-item-content">
                                    <h3>{item.name}</h3>                                 <p className="cart-item-price">
                                        ${item.price}
                                    </p>                                 <div className="cart-item-actions">
                                        <div className="quantity-controls">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    decreaseQuantity(item.id)
                                                }
                                            >
                                                −
                                            </button>                                         <span>{item.quantity}</span>                                         <button
                                                type="button"
                                                onClick={() =>
                                                    increaseQuantity(item.id)
                                                }
                                            >
                                                +
                                            </button>
                                        </div>                                     <button
                                            type="button"
                                            onClick={() =>
                                                removeFromCart(item.id)
                                            }
                                            className="remove-item"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>             {items.length > 0 && (
                    <div className="cart-sidebar-footer">
                        <div className="cart-total">
                            <span>Total</span>                         <strong>
                                ${total.toFixed(2)}
                            </strong>
                        </div>                     <button
                            type="button"
                            className="clear-cart"
                            onClick={clearCart}
                        >
                            Clear Cart
                        </button>                     <button
                            type="button"
                            className="checkout-button"
                        >
                            Checkout
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
};

export default CartSidebar;