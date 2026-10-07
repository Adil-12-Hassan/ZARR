import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const content = {
  privacy: { title: "Privacy Policy", intro: "We use the information you share to provide and improve your ZARR shopping experience.", sections: [["Information we collect", "We collect account details, contact information, delivery addresses, and order history that you provide."], ["How we use it", "Your information is used to manage your account, process and deliver orders, provide support, and protect our services."], ["Your choices", "You can update your profile and saved addresses in your account. Contact customer care to request help with your personal information."]] },
  terms: { title: "Terms of Service", intro: "These terms apply when you browse or shop with ZARR.", sections: [["Orders", "An order is subject to product availability and confirmation. Prices and product details may be corrected if an error is found."], ["Payment and delivery", "Cash on Delivery is currently the accepted payment method. Delivery estimates may vary by location."], ["Account use", "Keep your sign-in details secure and provide accurate information for orders and delivery."]] },
  cookies: { title: "Cookies Policy", intro: "ZARR uses browser storage and similar technologies to keep the shop working smoothly.", sections: [["Essential storage", "We use essential browser storage for your signed-in session and shopping cart."], ["Preferences", "Your browser may store settings to make repeat visits more convenient."], ["Managing cookies", "You can clear or block browser storage in your browser settings. Some account and checkout features may then stop working."]] },
};

export default function LegalPage({ type }) {
  const page = content[type];
  return <><Navbar /><main className="legal-page"><span> ZARR CUSTOMER INFORMATION</span><h1>{page.title}</h1><p>{page.intro}</p>{page.sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}</main><Footer /></>;
}
