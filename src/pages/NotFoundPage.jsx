import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

// Multi-device layout (min-width: 375px, min-height: 812px)
function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full min-w-[375px] min-h-[812px] bg-[#120300] flex flex-col items-center font-automate text-center text-black overflow-hidden">
      <div className="w-full h-20 bg-[#120300] text-[#FD4A08] overflow-hidden relative mt-10">
        <div
          className="absolute inset-0 bg-[repeating-linear-gradient(135deg,_#FD4A08_0,_#FD4A08_20px,_transparent_20px,_transparent_40px)]"
        />
      </div>


      <div className="py-12 z-10 flex-1 flex flex-col items-center justify-center text-[#FD4A08]">
        <div className="font-automate text-6xl mb-2">404</div>
        <div className="font-automate text-lg">The requested page does not exist</div>
        <motion.button
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-2 bg-[#FD4A08] text-[#120300] rounded-2xl hover:bg-[#bf3908]"
          whileTap={{backgroundColor: '#120300', color: '#FD4A08', transition: { duration: 0.05 }}}
        >
          Go to Home Page
        </motion.button>
      </div>

      <div className="w-full h-20 bg-[#120300] text-[#FD4A08] overflow-hidden relative mb-10">
        <div
          className="absolute inset-0 bg-[repeating-linear-gradient(135deg,_#FD4A08_0,_#FD4A08_20px,_transparent_20px,_transparent_40px)]"
        />
      </div>
    </div>
  );
}

export default NotFoundPage;