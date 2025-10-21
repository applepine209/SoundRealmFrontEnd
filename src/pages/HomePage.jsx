import { Outlet } from "react-router-dom";
import { useMediaQuery } from "../hooks/useMediaQuery";

function HomePage() {
    const isMobile = useMediaQuery("(max-width: 376px)");

    return (
        <div className="w-full h-full flex flex-col p-2 text-[#a5a5a5]">
            <div className='w-full h-20 rounded-2xl bg-[#00000080] p-2'>
                Player Bar
            </div>

            <div className="w-full flex-1 flex flex-row mt-2">
                <div className="h-full w-50 rounded-2xl bg-[#00000080] p-2 mr-2">
                    Side Bar
                </div>

                <div className="h-full flex-1 rounded-2xl bg-[#00000080] p-2">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default HomePage;