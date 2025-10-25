import { useEffect, useState } from "react";
import AdaptiveContainer from "../shared/AdaptiveContainer";
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from "react-router-dom";
import authAPI from "../../apis/authAPI";
import toast from "react-hot-toast";

const loadingScreenVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

function RouteProtector({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  async function actions() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const response = await authAPI.fetchGETVerifySession();
      if (response.result === "Bx000") {
        toast.success("Session verified successfully!");
        setIsLoading(false);
        return;
      } else {
        navigate("/login");
        return;
      }
    }
    catch (e) {
      navigate("/login");
      return;
    }
  }

  useEffect(() => {
    actions();
  }, [])


  return (
    <AnimatePresence mode="wait" propagate>
      {isLoading
        ? (
          <motion.div
            className="w-full h-full flex items-center justify-center text-[#a5a5a5] font-automate"
            variants={loadingScreenVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            key="loading">
            <AdaptiveContainer rootClassName='bg-[#2d2d2d80] backdrop-blur-2xl rounded-3xl pb-3' selectedChildren={0}>
              <div className='w-80 3xl:w-100 flex flex-col items-center justify-center'>
                <div className="flex flex-row items-center justify-center w-full mt-2">
                  <img className='h-15 w-15' src='/logo.png' alt='Loading...' />
                  <span className='ml-3 text-[33px] 3xl:text-[43px]'>SoundRealm</span>
                </div>

                <div className="mt-6 flex flex-row items-center justify-center w-full">
                  <img className='h-5 w-5' src='/loading.gif' alt='Loading...' />
                  <span className='ml-3 text-[18px] 3xl:text-[23px]'>Now loading...</span>
                </div>

              </div>
            </AdaptiveContainer>
          </motion.div>
        )
        : (children)
      }
    </AnimatePresence>
  )
}

export default RouteProtector;