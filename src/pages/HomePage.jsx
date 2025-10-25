import { useMediaQuery } from "../hooks/useMediaQuery";
import DesktopLayout from "../components/HomePage/DesktopLayout/_component";
import MobileLayout from "../components/HomePage/MobileLayout/_component";
import RouteProtector from "../components/HomePage/RouteProtector";

function HomePage() {
    const isMobile = useMediaQuery("(max-width: 430px)");

    return (
        <RouteProtector>
            {isMobile ? <MobileLayout /> : <DesktopLayout />}
        </RouteProtector>
    );
}

export default HomePage;