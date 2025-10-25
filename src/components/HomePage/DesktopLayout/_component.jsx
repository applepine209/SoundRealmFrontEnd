import { Outlet } from "react-router-dom";
import PlayerBar from "./PlayerBar";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const blankVariant = {
  initial: {},
  animate: {},
  exit: { transition: { when: "afterChildren", staggerChildren: 0.03 } },
}

function DesktopLayout() {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);

  let playerBarVariants = {
    initial: { y: -48, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: { y: -48, opacity: 0, transition: { duration: 0.5 } },
  }

  let sideBarVariants = {
    initial: { y: 48, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: { y: 48, opacity: 0, transition: { duration: 0.5 } },
  }

  let outletContainerVariants = {
    initial: { y: 48, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: { y: 48, opacity: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      variants={blankVariant}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full h-full flex flex-col p-2 text-[#a5a5a5] overflow-hidden"
      key="home-desktop-layout"
    >
      <motion.div variants={playerBarVariants} className='w-full h-20 rounded-2xl bg-[#2d2d2d80] backdrop-blur-2xl'>
        <PlayerBar />
      </motion.div>

      <div className="w-full flex-1 flex flex-row mt-2">
        <motion.div
          variants={sideBarVariants}
          className="h-full w-50 rounded-2xl bg-[#2d2d2d80] backdrop-blur-2xl p-2 mr-2 flex flex-col"
        >
          <button onClick={() => navigate('/login')}>To Login</button>
          <button onClick={() => navigate('/song/123')}>To Song</button>
          <button onClick={() => navigate('/artist/123')}>To Artist</button>
          <button onClick={() => navigate('/album/123')}>To Album</button>
        </motion.div>

        <motion.div variants={outletContainerVariants} className="h-full flex-1 rounded-2xl bg-[#2d2d2d80] backdrop-blur-2xl p-2">
          <Outlet />
        </motion.div>
      </div>
    </motion.div >
  );
}

export default DesktopLayout;