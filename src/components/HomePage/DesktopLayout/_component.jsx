import { Outlet } from "react-router-dom";
import PlayerBar from "./PlayerBar";
import SideBar from "./SideBar";
import SongQueue from "./SongQueue";
import { motion } from "motion/react";
import { useState } from "react";

const blankVariant = {
  initial: {},
  animate: {},
  exit: { transition: { when: "afterChildren", staggerChildren: 0.03 } },
}

function DesktopLayout() {
  const [signal1, setSignal1] = useState(false);
  const [signal2, setSignal2] = useState(false);

  let playerBarVariants = {
    initial: { y: -48, opacity: 0, height: 80 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5 }, height: signal2 ? "100%" : 80 },
    exit: { y: -48, opacity: 0, transition: { duration: 0.5 } },
  }

  let sideBarVariants = {
    initial: { x: -48, opacity: 0 },
    animate: { x: signal1 ? -48 : 0, opacity: signal1 ? 0 : 1, transition: { duration: 0.5 }, display: signal1 ? "none" : "block" },
    exit: { x: -48, opacity: 0, transition: { duration: 0.5 } },
  }

  let outletContainerVariants = {
    initial: { y: 48, opacity: 0 },
    animate: { y: signal1 ? 48 : 0, opacity: signal1 ? 0 : 1, transition: { duration: 0.5 }, display: signal1 ? "none" : "block" },
    exit: { y: 48, opacity: 0, transition: { duration: 0.5 } },
  }

  let songQueueVariants = {
    initial: { x: 48, opacity: 0 },
    animate: { x: signal1 ? 48 : 0, opacity: signal1 ? 0 : 1, transition: { duration: 0.5 }, display: signal1 ? "none" : "block" },
    exit: { x: 48, opacity: 0, transition: { duration: 0.5 } },
  }

  async function handlePlayerBarFullscreenToggle() {
    if (signal1) {
      setSignal2(false);
      await new Promise(resolve => setTimeout(resolve, 500));
      setSignal1(false);
    }
    else {
      setSignal1(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setSignal2(true);
    }
  }

  return (
    <motion.div
      variants={blankVariant}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full h-full flex flex-col p-2 text-[#a5a5a5] font-automate overflow-hidden min-w-[1280px]"
      key="home-desktop-layout"
    >
      <motion.div variants={playerBarVariants} className='w-full rounded-2xl bg-[#2d2d2d80] backdrop-blur-2xl'>
        <PlayerBar onFullscreenToggle={handlePlayerBarFullscreenToggle}/>
      </motion.div>

      <div className="w-full flex-1 flex flex-row">
        <motion.div
          variants={sideBarVariants}
          className="mt-2 w-50 rounded-2xl bg-[#2d2d2d80] backdrop-blur-2xl flex flex-col"
        >
          <SideBar />
        </motion.div>

        <motion.div variants={outletContainerVariants} className="mt-2 flex-1 rounded-2xl bg-[#2d2d2d80] backdrop-blur-2xl ml-2">
          <Outlet />
        </motion.div>

        <motion.div
          variants={songQueueVariants}
          className="mt-2 w-60 rounded-2xl bg-[#2d2d2d80] backdrop-blur-2xl ml-2"
        >
          <SongQueue />
        </motion.div>
      </div>
    </motion.div >
  );
}

export default DesktopLayout;