import React from "react";
import Diamond from "../assets/diamond.png"
import Setting from "../assets/setting.png"
import Security from "../assets/security.png"
import World from "../assets/world.png"
import "../../src/global.css"
import "../../src/styles/components/feature.css"

function Features() {
    return (
        <section className="features">
            <div className="features-grid">
                {/* First Feature */}
                <div className="feature">
                    <img src={Diamond} alt="Diamond-Image" className="feature-image" />
                    <div className="feature-content"><h3 className="feature-heading">PREMIUM QUALITY</h3>
                        <p className="feature-desc">Finest materials for uncompromised quality.</p></div>
                </div>
                {/* Second Feature */}
                <div className="feature">
                    <img src={Setting} alt="Diamond-Image" className="feature-image" />
                    <div className="feature-content"> <h3 className="feature-heading">EXPERT CRAFTSMANSHIP</h3>
                        <p className="feature-desc">Precision engineered by master watchmakers.</p></div>
                </div>
                {/* Third Feature */}
                <div className="feature">
                    <img src={Security} alt="Security-Image" className="feature-image" />
                    <div className="feature-content"><h3 className="feature-heading">BUILT TO LAST</h3>
                        <p className="feature-desc">Durable, reliable and made to endure.</p></div>
                </div>
                {/* Fourth Feature */}
                <div className="feature">
                    <img src={World} alt="World-Image" className="feature-image" />
                    <div className="feature-content"> <h3 className="feature-heading">WORLDWIDE DELIVERY</h3>
                        <p className="feature-desc">Complimentary shipping and secure delivery.</p></div>
                </div>
            </div>
        </section>
    )
}

export default Features;