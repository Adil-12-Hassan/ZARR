import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { OrdersProvider } from "./context/OrdersContext";

function App() {
    return (
        <AuthProvider>
            <OrdersProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </OrdersProvider>
        </AuthProvider>
    );

}
export default App;
