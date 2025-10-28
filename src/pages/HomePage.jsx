import { useMediaQuery } from "../hooks/useMediaQuery";
import DesktopLayout from "../components/HomePage/DesktopLayout/_component";
import MobileLayout from "../components/HomePage/MobileLayout/_component";
import RouteProtector from "../components/HomePage/RouteProtector";
import { Provider } from "react-redux";
import { store } from "../redux/store";

function HomePage() {
    const isMobile = useMediaQuery("(max-width: 430px)");

    return (
        <RouteProtector>
            <Provider store={store}>
                {isMobile ? <MobileLayout /> : <DesktopLayout />}
            </Provider>
        </RouteProtector>
    );
}

export default HomePage;