import { motion, LayoutGroup, AnimatePresence } from 'motion/react';
import AdaptiveContainer from '../components/shared/AdaptiveContainer';
import { useState, useEffect } from 'react';
import authAPI from '../apis/authAPI';
import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Animation variants
const pageVariants = {
  initial: {},
  animate: {},
  exit: { transition: { when: "beforeChildren" } }, // start children exits immediately
};
const headerVariants = {
  initial: { y: 0, opacity: 1 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -48, opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }, // fly up
};
const formVariants = {
  initial: { y: 0, opacity: 1 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 48, opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }, // fly down
};

function LoginPage() {
  // Hooks
  const [currentLayout, setCurrentLayout] = useState(0); // 0: Verify session, 1: Login form
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [rememberMeChecked, setRememberMeChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // On component mount actions
  useEffect(() => {
    preliminarySessionCheck();
  }, []);

  // Event handlers
  async function handleLogin() {
    setErrorMessage('');

    // Preliminary input validation
    if (usernameInput.length === 0 || passwordInput.length === 0) {
      setErrorMessage("Please fill out login credentials.");
      return;
    }

    // Call login API
    setCurrentLayout(0);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await authAPI.fetchPOSTLogin(usernameInput, passwordInput, rememberMeChecked);
      if (response.result == "0x000") {
        navigate('/');
        return;
      }
      else if (response.result == "0x001") {
        setErrorMessage("Please fill out login credentials.");
        setCurrentLayout(1);
        return;
      }
      else if (response.result == "0x002") {
        setErrorMessage("Service temporarily unavailable. Please try again later.");
        setCurrentLayout(1);
        return;
      }
      else if (response.result == "0x003") {
        setErrorMessage("Invalid login credentials.");
        setCurrentLayout(1);
        return;
      }
      else if (response.result == "0x004") {
        setErrorMessage("This account has been suspended.");
        setCurrentLayout(1);
        return;
      }
      else {
        setErrorMessage("Service temporarily unavailable. Please try again later.");
        setCurrentLayout(1);
        return;
      }
    }
    catch {
      setErrorMessage("Service temporarily unavailable. Please try again later.");
      setCurrentLayout(1);
      return;
    }
  }

  // Other functions
  async function preliminarySessionCheck() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      // Verify if session is valid
      const response = await authAPI.fetchGETVerifySession();
      console.log(response.result);
      if (response.result == 'Bx000') {
        navigate('/');
        return;
      }
    }
    catch { }

    try {
      // Try log in with remember me
      const response = await authAPI.fetchGETRememberMe();
      console.log(response.result);
      if (response.result == '14x000') {
        navigate('/');
        return;
      }
    }
    catch { }

    setCurrentLayout(1);
  }

  // Render
  return (
    <motion.div
      className='w-full h-full flex items-center justify-center font-automate'
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className='w-full flex flex-col items-center'>
        <LayoutGroup>
          <motion.div className='flex flex-col items-center' layout>
            <motion.div
              className='flex flex-col items-center justify-center'
              layout
              variants={headerVariants}
            >
              <img src='/logo.png' alt='SoundRealm Logo' className='w-15 h-15 3xl:w-20 3xl:h-20' />
              <span className='text-[#a5a5a5] text-[30px] 3xl:text-[43px]'>Login to SoundRealm</span>
            </motion.div>

            <motion.div
              variants={formVariants}
            >
              <AdaptiveContainer rootClassName='bg-[#00000080] rounded-3xl mt-10' selectedChildren={currentLayout}>
                {/* Layout 0: Loading screen */}
                <div className='h-13 w-60 3xl:w-70 3xl:h-15 flex items-center justify-center'>
                  <div className='flex flex-row items-center justify-center'>
                    <img className='h-5 w-5' src='/loading.gif'></img>
                    <span className='text-[#a5a5a5] text-[20px] 3xl:text-[30px] ml-3'>Processing...</span>
                  </div>
                </div>

                {/* Layout 1: Login form */}
                <div className='w-80 3xl:w-110 px-3 pb-3'>

                  {
                    errorMessage &&
                    <div className='flex flex-row items-center justify-center px-3 py-2 mt-3 w-full text-[#ff0000] bg-[#9f000099] rounded-2xl 3xl:text-[20px]'>
                      <ShieldAlert className='h-5 w-5 3xl:h-6 3xl:w-6 mr-2 shrink-0' color='#ff0000' />
                      <p className="min-w-0 whitespace-normal break-words">
                        {errorMessage}
                      </p>
                    </div>
                  }

                  <div className='mt-2 px-3 w-full text-[#a5a5a5] 3xl:text-[24px]'>Username</div>
                  <input
                    type='text'
                    placeholder='_'
                    className='bg-[#0000006f] rounded-2xl px-3 h-9 3xl:h-11 w-full text-[#a5a5a5] 3xl:text-[24px]'
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                  />
                  <div className='px-3 w-full text-[#a5a5a5] mt-2 3xl:mt-4 3xl:text-[24px]'>Password</div>
                  <input
                    type='password'
                    placeholder='_'
                    className='bg-[#0000006f] w-full rounded-2xl px-3 h-9 3xl:h-11 text-[#a5a5a5] 3xl:text-[24px]'
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                  />

                  <div className='flex flex-row items-center ml-3 mt-2'>
                    <input
                      className={`appearance-none w-4 h-4 3xl:w-5 3xl:h-5 border-2 rounded border-[#FD4A08] bg-[#111111] checked:bg-[#FD4A08] `}
                      type="checkbox"
                      checked={rememberMeChecked}
                      onChange={() => setRememberMeChecked(!rememberMeChecked)}
                    ></input>
                    <span
                      className='text-[#a5a5a5] text-[13px] 3xl:text-[16px] ml-2 hover:text-[#c5c5c5] cursor-pointer'
                      onClick={() => setRememberMeChecked(!rememberMeChecked)}
                    >
                      Remember me
                    </span>
                  </div>

                  <motion.button
                    className='bg-[#82cde2] mt-10 rounded-2xl px-3 h-9 3xl:h-11 3xl:text-[20px] w-full 3xl:mt-15 text-[#120300] hover:bg-[#6ba8b9] cursor-pointer'
                    whileTap={{ backgroundColor: '#120300', color: '#82cde2', transition: { duration: 0.08 } }}
                    onClick={handleLogin}
                  >
                    Login
                  </motion.button>
                </div>
              </AdaptiveContainer>
            </motion.div>
          </motion.div>
        </LayoutGroup>
      </div>
    </motion.div>
  );
}

export default LoginPage;