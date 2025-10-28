import { useState } from "react";
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';
import { Maximize, Volume2, ListMusic } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

import ForwardButton from "../../shared/svg/ForwardButton";
import PlayButton from "../../shared/svg/PlayButton";
import PauseButton from "../../shared/svg/PauseButton";
import RepeatButton from "../../shared/svg/RepeatButton";
import RepeatDisabledButton from "../../shared/svg/RepeatDisabledButton";
import RepeatOneButton from "../../shared/svg/RepeatOneButton";
import ShuffleButton from "../../shared/svg/ShuffleButton";
import ShuffleDisabledButton from "../../shared/svg/ShuffleDisabledButton";
import RewindButton from "../../shared/svg/RewindButton";

import { increaseCurrent, decreaseCurrent, toggleShuffle, nextRepeatMode } from "../../../redux/slices/songQueueSlice";

function PlayerBar({ onFullscreenToggle }) {
  const [coverURL, setCoverURL] = useState("http://localhost:3000/public/image/688a0197a6d188a0596e279bd3b3e5aa");
  const [songName, setSongName] = useState("A Time of Quiet Between The Storms");
  const [artistsName, setArtistName] = useState("Test Artist");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Redux state
  const dispatch = useDispatch();
  const songQueueSlice = useSelector((state) => state.songQueue);


  const formatTime = (sec) => {
    if (!isFinite(sec) || sec <= 0) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full h-full grid grid-cols-[minmax(300px,1fr)_auto_minmax(300px,1fr)]">
      {/* Left Section */}
      <div className="flex flex-row items-center pl-1.5 overflow-hidden">
        <div className="overflow-hidden h-17 w-17 rounded-[13px] bg-[#111111] flex justify-center items-center shrink-0">
          {
            coverURL ?
              <img className="h-full w-full object-cover" src={coverURL} alt="Cover" />
              :
              <img className="h-7 w-7" src={"/music-note.svg"} />
          }
        </div>

        <div className="flex flex-col ml-2">
          <span className="text-[20px] font-bold text-nowrap">{songName}</span>
          <span className="text-[15px] text-nowrap">{artistsName}</span>
        </div>
      </div>

      {/* Center Section */}
      <div className="h-full w-150 flex flex-col">
        <div className="flex flex-row items-center pt-1">
          <span>{formatTime(currentTime)}</span>
          <Slider
            className="ml-1 mb-1 flex-1"
            railStyle={{ backgroundColor: '#2d2d2d80', height: 8 }}
            trackStyle={{ backgroundColor: '#545454', height: 8 }}
            handleStyle={{ display: 'none' }}
          />
          <span className="ml-1">{formatTime(duration)}</span>
        </div>

        <div className="flex-1 flex flex-row items-center justify-center pb-3">
          <div>
            <ShuffleDisabledButton size={30} />
          </div>
          <div className="ml-5">
            <RewindButton size={30} />
          </div>
          <div className="ml-2">
            <PlayButton size={42} />
          </div>
          <div className="ml-2">
            <ForwardButton size={30} />
          </div>
          <div className="ml-5">
            <RepeatDisabledButton size={30} />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-row justify-end items-center pr-3 space-x-4">
        <ListMusic size={20} />
        <Volume2 size={20} />
        <div className="w-18">
          <Slider
            className="mb-1"
            railStyle={{ backgroundColor: '#2d2d2d80', height: 8 }}
            trackStyle={{ backgroundColor: '#545454', height: 8 }}
            handleStyle={{ display: 'none' }}
          />
        </div>
        <Maximize size={20} />
      </div>
    </div>
  )
}

export default PlayerBar;