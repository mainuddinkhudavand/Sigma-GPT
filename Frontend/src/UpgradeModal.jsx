import React, { useContext } from "react";
import "./UpgradeModal.css";
import { MyContext } from "./MyContext.jsx";

function UpgradeModal() {
  const { isUpgradeOpen, setIsUpgradeOpen, userPlan, handleUpgradePlan } = useContext(MyContext);

  if (!isUpgradeOpen) return null;

  const plans = [
    {
      id: "Free",
      name: "Sigma Starter",
      price: "$0",
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
      price: "$19",
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
      price: "$49",
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

  return (
    <div className="upgrade-overlay" onClick={() => setIsUpgradeOpen(false)}>
      <div className="upgrade-modal animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <div className="upgrade-header">
          <div className="header-badge">
            <i className="fa-solid fa-gem"></i> Premium Intelligence
          </div>
          <h2>Upgrade Your SigmaGPT Experience</h2>
          <p>Unlock ultra-fast AI models, unlimited chats, custom personas, and text-to-speech audio.</p>
          <button className="upgrade-close-btn" onClick={() => setIsUpgradeOpen(false)} title="Close Modal">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="plans-grid">
          {plans.map((plan) => {
            const isCurrent = userPlan.toLowerCase() === plan.id.toLowerCase();
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
                  <span className="price-num">{plan.price}</span>
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
                  onClick={() => handleUpgradePlan(plan.id)}
                  disabled={isCurrent}
                >
                  {isCurrent ? (
                    <>
                      <i className="fa-solid fa-circle-check"></i> Active Plan
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-rocket"></i> Upgrade to {plan.id}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="upgrade-footer">
          <p><i className="fa-solid fa-shield-halved"></i> 30-day money back guarantee • Cancel or switch plans anytime</p>
        </div>
      </div>
    </div>
  );
}

export default UpgradeModal;
