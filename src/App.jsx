import { useEffect } from "react";

import AppRoutes from "./routes/AppRoutes";

import useAuthStore from "./store/authStore";

function App() {

    const checkAuth = useAuthStore(state => state.checkAuth);

    useEffect(() => {

        checkAuth();

    }, [checkAuth]);

    return <AppRoutes />;

}

export default App;
