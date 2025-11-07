import { useMediaQuery } from "../hooks/useMediaQuery";
import DesktopLayout from "../components/HomePage/DesktopLayout/_component";
import MobileLayout from "../components/HomePage/MobileLayout/_component";
import { Provider } from "react-redux";
import { store } from "../redux/store";

function HomePage() {
    const isMobile = useMediaQuery("(max-width: 430px)");

    return isMobile
        ?
        <Provider store={store}>
            < MobileLayout />
        </Provider >
        :
        <Provider store={store}>
            <DesktopLayout />
        </Provider >
};

export default HomePage;