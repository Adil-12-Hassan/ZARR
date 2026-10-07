import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/pages/checkoutPage.css";
import useCartStore from "../store/cartStore";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { orderAPI } from "../api/api";

const paymentMethods = [
  { name: "Visa", logo: "https://cdn.simpleicons.org/visa" },
  { name: "Mastercard", logo: "https://cdn.simpleicons.org/mastercard" },
  { name: "PayPal", logo: "https://cdn.simpleicons.org/paypal" },
  { name: "Google Pay", logo: "https://cdn.simpleicons.org/googlepay" },
  { name: "Apple Pay", logo: "https://cdn.simpleicons.org/applepay" },
  { name: "JazzCash", logo: "https://cdn.simpleicons.org/jazzcash" },
];

function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [currentStep, setCurrentStep] = useState(1);
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const [formData, setFormData] = useState({
    email: user?.user?.email || "",
    fullName: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Pakistan",
    saveInformation: true,
    emailOffers: false,
  });

  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const shipping = 500;

  const subtotal = useMemo(
    () =>
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  );

  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const tax = Math.round((subtotal - discount) * 0.135);
  const total = subtotal - discount + shipping + tax;

  const formatPrice = (price) => new Intl.NumberFormat("en-PK").format(price);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCoupon = () => {
    if (!coupon.trim()) return;
    if (coupon.toUpperCase() === "ZARR10") {
      setCouponApplied(true);
    } else {
      setCouponApplied(false);
      alert("Invalid coupon code.");
    }
  };

  // - Place Order --
  const handlePlaceOrder = async () => {
    setPlacing(true);
    setOrderError("");
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          product: item._id || item.id,
          name: item.name,
          image: item.image || "",
          variant: item.variant || "",
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        subtotal,
        discount,
        shipping,
        tax,
        total,
        couponCode: couponApplied ? "ZARR10" : "",
        paymentMethod,
      };
      const createdOrder = await orderAPI.place(orderData);
      addOrder(createdOrder);
      clearCart();
      navigate("/dashboard/orders");
    } catch (err) {
      setOrderError(err.message || "Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep((step) => step + 1);
      return;
    }
    handlePlaceOrder();
  };

  return (
    <>
      <Navbar />
      <main className="checkout-page">
        <div className="checkout-container">
          <section className="checkout-heading">
            <div>
              <span className="checkout-kicker">SECURE CHECKOUT</span>
              <h1>Checkout</h1>
              <p>
                Complete your order securely and enjoy your ZARR experience.
              </p>
            </div>
          </section>       <section className="checkout-progress">
            <CheckoutStep
              number="1"
              title="Information"
              active={currentStep >= 1}
              current={currentStep === 1}
            />
            <div className="progress-line" />
            <CheckoutStep
              number="2"
              title="Shipping"
              active={currentStep >= 2}
              current={currentStep === 2}
            />
            <div className="progress-line" />
            <CheckoutStep
              number="3"
              title="Payment"
              active={currentStep >= 3}
              current={currentStep === 3}
            />
            <div className="progress-line" />
            <CheckoutStep
              number="4"
              title="Review"
              active={currentStep >= 4}
              current={currentStep === 4}
            />
          </section>       <div className="checkout-layout">
            {/* LEFT SIDE */}
            <section className="checkout-main">
              {/* Contact Information */}
              <div className="checkout-card">
                <div className="section-heading">
                  <span className="section-number">01</span>
                  <div>
                    <h2>Contact Information</h2>
                    <p>Where should we send your order confirmation?</p>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                  />
                </div>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    name="emailOffers"
                    checked={formData.emailOffers}
                    onChange={handleChange}
                  />
                  <span>
                    Email me with news, exclusive offers and new arrivals
                  </span>
                </label>
              </div>           {/* Shipping Address */}
              <div className="checkout-card">
                <div className="section-heading">
                  <span className="section-number">02</span>
                  <div>
                    <h2>Shipping Address</h2>
                    <p>Where would you like your order delivered?</p>
                  </div>
                </div>
                <div className="form-grid two-columns">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92 300 0000000"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street address"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="apartment">
                    Apartment, Suite, etc.{" "}
                    <span className="optional">Optional</span>
                  </label>
                  <input
                    id="apartment"
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    placeholder="Apartment, suite, unit, etc."
                  />
                </div>
                <div className="form-grid three-columns">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Lahore"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="province">State / Province</label>
                    <select
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="Khyber Pakhtunkhwa">
                        Khyber Pakhtunkhwa
                      </option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="Islamabad">
                        Islamabad Capital Territory
                      </option>
                      <option value="Gilgit Baltistan">Gilgit-Baltistan</option>
                      <option value="Azad Kashmir">Azad Kashmir</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="postalCode">Postal Code</label>
                    <input
                      id="postalCode"
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="54000"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="Pakistan">Pakistan</option>
                    <option value="United Arab Emirates">
                      United Arab Emirates
                    </option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                  </select>
                </div>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    name="saveInformation"
                    checked={formData.saveInformation}
                    onChange={handleChange}
                  />
                  <span>Save this information for next time</span>
                </label>
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleContinue}
                >
                  {currentStep < 2
                    ? "Continue to Shipping"
                    : "Continue to Payment"}
                  <span>→</span>
                </button>
              </div>           {/* Payment */}
              {currentStep >= 3 && (
                <div className="checkout-card">
                  <div className="section-heading">
                    <span className="section-number">03</span>
                    <div>
                      <h2>Payment Method</h2>
                      <p>Select your preferred payment method.</p>
                    </div>
                  </div>
                  <div className="payment-options">
                    <label
                      className={`payment-option ${paymentMethod === "Cash on Delivery" ? "active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "Cash on Delivery"}
                        onChange={() => setPaymentMethod("Cash on Delivery")}
                      />
                      <div className="payment-content">
                        <div>
                          <strong>Cash on Delivery</strong>
                          <span>Pay when your order arrives.</span>
                        </div>
                        <span className="payment-badge">COD</span>
                      </div>
                    </label>
                    <label
                      className={`payment-option ${paymentMethod === "Card Payment" ? "active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "Card Payment"}
                        onChange={() => setPaymentMethod("Card Payment")}
                      />
                      <div className="payment-content">
                        <div>
                          <strong>Card Payment</strong>
                          <span>Visa, Mastercard and other cards.</span>
                        </div>
                        <div className="payment-mini-logos">
                          <img
                            src="https://cdn.simpleicons.org/visa"
                            alt="Visa"
                          />
                          <img
                            src="https://cdn.simpleicons.org/mastercard"
                            alt="Mastercard"
                          />
                        </div>
                      </div>
                    </label>
                    <label
                      className={`payment-option ${paymentMethod === "Digital Wallet" ? "active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "Digital Wallet"}
                        onChange={() => setPaymentMethod("Digital Wallet")}
                      />
                      <div className="payment-content">
                        <div>
                          <strong>Digital Wallet</strong>
                          <span>Pay using supported digital wallets.</span>
                        </div>
                        <div className="payment-mini-logos">
                          <img
                            src="https://cdn.simpleicons.org/jazzcash"
                            alt="JazzCash"
                          />
                          <img
                            src="https://cdn.simpleicons.org/paypal"
                            alt="PayPal"
                          />
                        </div>
                      </div>
                    </label>
                  </div>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={handleContinue}
                  >
                    Continue to Review<span>→</span>
                  </button>
                </div>
              )}           {/* Review */}
              {currentStep >= 4 && (
                <div className="checkout-card review-card">
                  <div className="section-heading">
                    <span className="section-number">04</span>
                    <div>
                      <h2>Review Your Order</h2>
                      <p>
                        Please review your details before placing the order.
                      </p>
                    </div>
                  </div>
                  <div className="review-box">
                    <span>Delivering to</span>
                    <strong>{formData.fullName || "Your Name"}</strong>
                    <p>
                      {formData.address || "Your address"}
                      {formData.city && `, ${formData.city}`}
                      {formData.province && `, ${formData.province}`}
                      {formData.postalCode && ` ${formData.postalCode}`}
                    </p>
                    <p>{formData.phone || "Phone number"}</p>
                    <p>
                      Payment: <strong>{paymentMethod}</strong>
                    </p>
                  </div>
                  {orderError && (
                    <p
                      style={{
                        color: "red",
                        margin: "0.5rem 0",
                        fontSize: "0.9rem",
                      }}
                    >
                      {orderError}
                    </p>
                  )}
                  <button
                    type="button"
                    className="primary-button place-order-button"
                    onClick={handleContinue}
                    disabled={placing}
                  >
                    {placing ? "Placing Order..." : "Place Order"}
                    <span>→</span>
                  </button>
                </div>
              )}
            </section>         {/* RIGHT SIDE  - Order Summary */}
            <aside className="order-sidebar">
              <div className="order-summary">
                <div className="summary-header">
                  <div>
                    <span>YOUR ORDER</span>
                    <h2>Order Summary</h2>
                  </div>
                  <span className="item-count">{cartItems.length} Items</span>
                </div>             <div className="summary-products">
                  {cartItems.length === 0 ? (
                    <p style={{ textAlign: "center", opacity: 0.6 }}>
                      Your cart is empty.
                    </p>
                  ) : (
                    cartItems.map((item) => (
                      <div
                        className="summary-product"
                        key={item.id || item._id}
                      >
                        <div className="product-image-wrapper">
                          <img
                            src={item.image}
                            alt={item.name}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          <span className="product-quantity">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="product-details">
                          <h3>{item.name}</h3>
                          <span>{item.variant}</span>
                          <small>Qty: {item.quantity}</small>
                        </div>
                        <strong>PKR {formatPrice(item.price)}</strong>
                      </div>
                    ))
                  )}
                </div>             {/* Coupon */}
                <div className="coupon-area">
                  <label htmlFor="coupon">Have a coupon code?</label>
                  <div className="coupon-input">
                    <input
                      id="coupon"
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Enter coupon code"
                    />
                    <button type="button" onClick={handleCoupon}>
                      Apply
                    </button>
                  </div>
                  {couponApplied && (
                    <span className="coupon-success">
                      ZARR10 applied  - 10% discount
                    </span>
                  )}
                </div>             {/* Price Breakdown */}
                <div className="price-breakdown">
                  <div>
                    <span>Subtotal</span>
                    <strong>PKR {formatPrice(subtotal)}</strong>
                  </div>
                  {discount > 0 && (
                    <div className="discount-row">
                      <span>Discount</span>
                      <strong>- PKR {formatPrice(discount)}</strong>
                    </div>
                  )}
                  <div>
                    <span>Shipping</span>
                    <strong>PKR {formatPrice(shipping)}</strong>
                  </div>
                  <div>
                    <span>Tax</span>
                    <strong>PKR {formatPrice(tax)}</strong>
                  </div>
                </div>
                <div className="total-row">
                  <span>Total</span>
                  <strong>PKR {formatPrice(total)}</strong>
                </div>             <div className="secure-checkout">
                  <div className="secure-icon">✓</div>
                  <div>
                    <strong>Secure Checkout</strong>
                    <span>Your information is encrypted and protected.</span>
                  </div>
                </div>             <div className="accepted-payment">
                  <span>WE ACCEPT</span>
                  <div className="payment-logos">
                    {paymentMethods.map((method) => (
                      <div
                        className="payment-logo"
                        key={method.name}
                        title={method.name}
                      >
                        <img src={method.logo} alt={method.name} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>       {/* Trust Benefits */}
          <section className="trust-benefits">
            <TrustItem
              icon="◇"
              title="Secure Payment"
              text="Your payment information is 100% protected."
            />
            <TrustItem
              icon="▱"
              title="Free Shipping"
              text="Complimentary shipping on qualifying orders."
            />
            <TrustItem
              icon="↻"
              title="Easy Returns"
              text="30-day hassle-free returns."
            />
            <TrustItem
              icon="♢"
              title="2 Years Warranty"
              text="International warranty on all watches."
            />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function CheckoutStep({ number, title, active, current }) {
  return (
    <div
      className={`checkout-step ${active ? "active" : ""} ${current ? "current" : ""}`}
    >
      <div className="step-number">{number}</div>
      <span>{title}</span>
    </div>
  );
}

function TrustItem({ icon, title, text }) {
  return (
    <div className="trust-item">
      <div className="trust-icon">{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default Checkout;
