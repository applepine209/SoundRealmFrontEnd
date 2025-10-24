import { useEffect, useState } from "react";
import AdaptiveContainer from "../shared/AdaptiveContainer";
import { motion } from 'motion/react';

function PreloadWrapper({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  async function preloadActions() {
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  }

  useEffect(() => {
    preloadActions();
  }, [])

  if (isLoading) {
    return (
      <motion.div
        className="w-full h-full flex items-center justify-center text-[#a5a5a5] font-automate"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
        key='preload-wrapper'
      >
        <AdaptiveContainer rootClassName='bg-[#00000080] rounded-3xl pb-3' selectedChildren={0}>
          <div className='w-90 3xl:w-110 flex flex-col items-center justify-center'>
            <div className="flex items-center justify-center text-[20px] 3xl:text-[30px] mt-2">
              Welcome to
            </div>

            <div className="flex flex-row items-center justify-center w-full">
              <img className='h-15 w-15' src='/logo.png' alt='Loading...' />
              <span className='ml-3 text-[30px] 3xl:text-[43px]'>SoundRealm UI</span>
            </div>

            <div className="mt-8 flex flex-row items-center justify-center w-full">
              <img className='h-5 w-5' src='/loading.gif' alt='Loading...' />
              <span className='ml-3 text-[20px] 3xl:text-[30px]'>Loading...</span>
            </div>

          </div>
        </AdaptiveContainer>
      </motion.div>
    )
  }
  else {
    return children;
  }
}

export default PreloadWrapper;