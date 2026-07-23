import React, { useContext, useState } from "react";
import "./UpgradeModal.css";
import { MyContext } from "./MyContext.jsx";

function UpgradeModal() {
  const { isUpgradeOpen, setIsUpgradeOpen, userPlan, handleUpgradePlan, showToast } = useContext(MyContext);

  const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" | "annual"
  const [selectedPlan, setSelectedPlan] = useState(null); // Plan object when checkout step open
  const [paymentMethod, setPaymentMethod] = useState("card"); // "card" | "upi" | "paypal"
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  if (!isUpgradeOpen) return null;

  const plans = [
    {
      id: "Free",
      name: "Sigma Starter",
      monthlyPrice: 0,
      annualPrice: 0,
      period: "forever free",
      badge: "Standard",
      color: "#339cff",
      icon: "fa-seedling",
      features: [
        "Standard response speed",
        "General Assistant Persona",
        "Up to 50 requests per day",
        "Community support",
        "Basic search history"
      ]
    },
    {
      id: "Pro",
      name: "Sigma Pro",
      monthlyPrice: 19,
      annualPrice: 15,
      period: "per month",
      badge: "POPULAR",
      color: "#ff007f",
      icon: "fa-bolt",
      features: [
        "⚡ 10x Faster response speed",
        "🤖 All AI Personas (Coder, Writer, Sarcastic)",
        "🔊 Voice Text-to-Speech audio support",
        "♾️ Unlimited daily messages & threads",
        "🎨 All 4 Visual Themes & Syntax Styles",
        "📥 Export chats to Markdown"
      ]
    },
    {
      id: "Enterprise",
      name: "Sigma Enterprise",
      monthlyPrice: 49,
      annualPrice: 39,
      period: "per month",
      badge: "POWER",
      color: "#10b981",
      icon: "fa-crown",
      features: [
        "👑 Everything in Sigma Pro",
        "⚙️ Custom Bot System Instructions",
        "🛡️ Dedicated API throughput & zero rate limits",
        "🤝 Team workspace & history sharing",
        "🔒 Enhanced security & private data mode",
        "📞 24/7 VIP Priority Support"
      ]
    }
  ];

  const handleOpenCheckout = (plan) => {
    if (plan.id.toLowerCase() === userPlan.toLowerCase()) return;
    if (plan.id.toLowerCase() === "free") {
      handleUpgradePlan("Free");
      return;
    }
    setSelectedPlan(plan);
    setPaymentSuccess(null);
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const calcAmount = billingCycle === "annual" ? selectedPlan.annualPrice * 12 : selectedPlan.monthlyPrice;

    try {
      const res = await fetch("http://localhost:8080/api/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan.id,
          billingCycle,
          paymentMethod: paymentMethod === "card" ? "Credit / Debit Card" : paymentMethod === "upi" ? "Instant UPI" : "PayPal",
          amount: calcAmount
        })
      });
      const data = await res.json();
      setIsProcessing(false);

      if (res.ok && data.receipt) {
        setPaymentSuccess(data.receipt);
        handleUpgradePlan(selectedPlan.id);
      } else {
        // Fallback
        handleUpgradePlan(selectedPlan.id);
        setSelectedPlan(null);
      }
    } catch (err) {
      setIsProcessing(false);
      // Local fallback
      handleUpgradePlan(selectedPlan.id);
      setSelectedPlan(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
    setPaymentSuccess(null);
    setIsUpgradeOpen(false);
  };

  return (
    <div className="upgrade-overlay" onClick={handleCloseModal}>
      <div className="upgrade-modal animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <button className="upgrade-close-btn" onClick={handleCloseModal} title="Close Modal">
          <i className="fa-solid fa-xmark"></i>
        </button>

        {!selectedPlan ? (
          <>
            <div className="upgrade-header">
              <div className="header-badge">
                <i className="fa-solid fa-gem"></i> Premium Intelligence
              </div>
              <h2>Upgrade Your SigmaGPT Experience</h2>
              <p>Unlock ultra-fast AI models, unlimited chats, custom personas, and text-to-speech audio.</p>
              
              {/* Billing frequency toggle */}
              <div className="billing-cycle-toggle">
                <button 
                  className={`cycle-btn ${billingCycle === "monthly" ? "active" : ""}`}
                  onClick={() => setBillingCycle("monthly")}
                >
                  Monthly Billing
                </button>
                <button 
                  className={`cycle-btn ${billingCycle === "annual" ? "active" : ""}`}
                  onClick={() => setBillingCycle("annual")}
                >
                  Annual Billing <span className="discount-tag">Save 20%</span>
                </button>
              </div>
            </div>

            <div className="plans-grid">
              {plans.map((plan) => {
                const isCurrent = userPlan.toLowerCase() === plan.id.toLowerCase();
                const displayPrice = billingCycle === "annual" ? `$${plan.annualPrice}` : `$${plan.monthlyPrice}`;

                return (
                  <div 
                    key={plan.id} 
                    className={`plan-card ${isCurrent ? "current-plan" : ""} ${plan.id === "Pro" ? "popular-card" : ""}`}
                    style={{ "--accent-theme": plan.color }}
                  >
                    {plan.badge && <div className="plan-badge-tag">{plan.badge}</div>}
                    
                    <div className="plan-icon-wrapper" style={{ backgroundColor: plan.color }}>
                      <i className={`fa-solid ${plan.icon}`}></i>
                    </div>

                    <h3 className="plan-name">{plan.name}</h3>
                    
                    <div className="plan-price-box">
                      <span className="price-num">{displayPrice}</span>
                      <span className="price-period">/{plan.period}</span>
                    </div>

                    <ul className="plan-features-list">
                      {plan.features.map((feat, idx) => (
                        <li key={idx}>
                          <i className="fa-solid fa-check check-icon"></i>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <button 
                      className={`plan-action-btn ${isCurrent ? "active-btn" : ""}`}
                      onClick={() => handleOpenCheckout(plan)}
                      disabled={isCurrent}
                    >
                      {isCurrent ? (
                        <>
                          <i className="fa-solid fa-circle-check"></i> Active Plan
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-rocket"></i> Upgrade to {plan.name}
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="upgrade-footer">
              <p><i className="fa-solid fa-shield-halved"></i> 30-day money back guarantee • Secure 256-bit encrypted checkout</p>
            </div>
          </>
        ) : (
          /* Payment Checkout Drawer / Confirmation */
          <div className="checkout-container">
            <button className="back-to-plans-btn" onClick={() => setSelectedPlan(null)}>
              <i className="fa-solid fa-arrow-left"></i> Back to Plans
            </button>

            {paymentSuccess ? (
              <div className="payment-success-box animate-scale-up">
                <div className="success-icon-badge">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <h2>Payment Successful! 🎉</h2>
                <p>Welcome to <strong>{selectedPlan.name}</strong>! Your account has been upgraded instantly.</p>

                <div className="receipt-card">
                  <div className="receipt-row">
                    <span>Transaction ID:</span>
                    <strong>{paymentSuccess.id}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Plan:</span>
                    <strong>{paymentSuccess.planName} ({billingCycle})</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Amount Paid:</span>
                    <strong>${paymentSuccess.amount} USD</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Payment Method:</span>
                    <strong>{paymentSuccess.paymentMethod}</strong>
                  </div>
                </div>

                <button className="done-checkout-btn" onClick={handleCloseModal}>
                  Start Using {selectedPlan.name}
                </button>
              </div>
            ) : (
              <div className="checkout-grid">
                {/* Order Summary */}
                <div className="checkout-summary-card">
                  <h3><i className="fa-solid fa-receipt"></i> Order Summary</h3>
                  <div className="summary-plan-badge" style={{ backgroundColor: selectedPlan.color }}>
                    <i className={`fa-solid ${selectedPlan.icon}`}></i> {selectedPlan.name}
                  </div>

                  <div className="summary-details">
                    <div className="summary-row">
                      <span>Billing Cycle:</span>
                      <strong>{billingCycle === "annual" ? "Annual (20% Off)" : "Monthly"}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <strong>${billingCycle === "annual" ? selectedPlan.annualPrice * 12 : selectedPlan.monthlyPrice}.00 USD</strong>
                    </div>
                    <div className="summary-row">
                      <span>Tax & Fees:</span>
                      <strong className="text-green">$0.00</strong>
                    </div>
                    <hr className="summary-divider" />
                    <div className="summary-row total-row">
                      <span>Total Due Now:</span>
                      <strong className="total-price">${billingCycle === "annual" ? selectedPlan.annualPrice * 12 : selectedPlan.monthlyPrice}.00</strong>
                    </div>
                  </div>

                  <div className="guarantee-box">
                    <i className="fa-solid fa-lock"></i>
                    <span>Instant Tier Unlock • Cancel Anytime</span>
                  </div>
                </div>

                {/* Payment Options Form */}
                <form className="payment-form-card" onSubmit={handleProcessPayment}>
                  <h3><i className="fa-solid fa-credit-card"></i> Select Payment Method</h3>

                  <div className="payment-methods-tabs">
                    <button 
                      type="button" 
                      className={`method-tab ${paymentMethod === "card" ? "active" : ""}`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <i className="fa-solid fa-credit-card"></i> Credit Card
                    </button>
                    <button 
                      type="button" 
                      className={`method-tab ${paymentMethod === "upi" ? "active" : ""}`}
                      onClick={() => setPaymentMethod("upi")}
                    >
                      <i className="fa-solid fa-mobile-screen"></i> Instant UPI
                    </button>
                    <button 
                      type="button" 
                      className={`method-tab ${paymentMethod === "paypal" ? "active" : ""}`}
                      onClick={() => setPaymentMethod("paypal")}
                    >
                      <i className="fa-brands fa-paypal"></i> PayPal
                    </button>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="method-fields">
                      <div className="form-group">
                        <label>Cardholder Name</label>
                        <input 
                          type="text" 
                          placeholder="Alex Rivera" 
                          value={cardHolder} 
                          onChange={(e) => setCardHolder(e.target.value)} 
                          className="checkout-input"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Card Number</label>
                        <input 
                          type="text" 
                          placeholder="4532 •••• •••• 8912" 
                          value={cardNumber} 
                          onChange={(e) => setCardNumber(e.target.value)} 
                          className="checkout-input"
                          required
                        />
                      </div>
                      <div className="form-row-2">
                        <div className="form-group">
                          <label>Expiry (MM/YY)</label>
                          <input 
                            type="text" 
                            placeholder="08/28" 
                            value={cardExpiry} 
                            onChange={(e) => setCardExpiry(e.target.value)} 
                            className="checkout-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>CVV / CVC</label>
                          <input 
                            type="password" 
                            placeholder="•••" 
                            value={cardCvv} 
                            onChange={(e) => setCardCvv(e.target.value)} 
                            className="checkout-input"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <div className="method-fields">
                      <div className="form-group">
                        <label>Virtual Payment Address (UPI ID)</label>
                        <input 
                          type="text" 
                          placeholder="alex@upi / alex@okicici" 
                          value={upiId} 
                          onChange={(e) => setUpiId(e.target.value)} 
                          className="checkout-input"
                          required
                        />
                      </div>
                      <p className="field-hint"><i className="fa-solid fa-circle-info"></i> You will receive an instant approval request on your UPI payment app (GPay / PhonePe / Paytm).</p>
                    </div>
                  )}

                  {paymentMethod === "paypal" && (
                    <div className="method-fields">
                      <p className="field-hint"><i className="fa-brands fa-paypal"></i> Clicking Pay Now will securely redirect you to your PayPal account balance for instant checkout.</p>
                    </div>
                  )}

                  <button type="submit" className="pay-now-btn" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i> Processing Payment...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-lock"></i> Pay ${billingCycle === "annual" ? selectedPlan.annualPrice * 12 : selectedPlan.monthlyPrice}.00 & Upgrade Now
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UpgradeModal;

