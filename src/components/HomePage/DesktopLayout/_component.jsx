import { Outlet } from "react-router-dom";
import PlayerBar from "./PlayerBar";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

function DesktopLayout() {
  const navigate = useNavigate();

  return (
    <motion.div exit={{ opacity: 0, transition: { duration: 0.5 } }} className="w-full h-full flex flex-col p-2 text-[#a5a5a5]" key="home-desktop-layout">
      <div className='w-full h-20 rounded-2xl bg-[#00000080]'>
        <PlayerBar />
      </div>

      <div className="w-full flex-1 flex flex-row mt-2">
        <button
          className="h-full w-50 rounded-2xl bg-[#00000080] p-2 mr-2"
          onClick={() => navigate('/login')}
        >
          Side Bar
        </button>

        <div className="h-full flex-1 rounded-2xl bg-[#00000080] p-2">
          <Outlet />
        </div>
      </div>
    </motion.div>
  );
}

export default DesktopLayout;