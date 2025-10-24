import { useMediaQuery } from "../hooks/useMediaQuery";
import DesktopLayout from "../components/HomePage/DesktopLayout/_component";
import MobileLayout from "../components/HomePage/MobileLayout/_component";
import PreloadWrapper from "../components/HomePage/PreloadWrapper";

function HomePage() {
    const isMobile = useMediaQuery("(max-width: 376px)");

    return (
        <PreloadWrapper>
            {isMobile ? <MobileLayout /> : <DesktopLayout />}
        </PreloadWrapper>
    );
}

export default HomePage;