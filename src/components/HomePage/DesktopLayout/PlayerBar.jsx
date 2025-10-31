import { useEffect, useRef, useState } from "react";
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';
import { Maximize, Volume2, ListMusic, VolumeX, Volume, Volume1, Minimize, CircleEllipsis } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import shaka from "shaka-player";
import { AnimatePresence, motion } from "motion/react"

import ForwardButton from "../../shared/svg/ForwardButton";
import PlayButton from "../../shared/svg/PlayButton";
import PauseButton from "../../shared/svg/PauseButton";
import RepeatButton from "../../shared/svg/RepeatButton";
import RepeatDisabledButton from "../../shared/svg/RepeatDisabledButton";
import RepeatOneButton from "../../shared/svg/RepeatOneButton";
import ShuffleButton from "../../shared/svg/ShuffleButton";
import ShuffleDisabledButton from "../../shared/svg/ShuffleDisabledButton";
import RewindButton from "../../shared/svg/RewindButton";

import MarqueeText from "../../shared/MarqueeContainer"
import SongQueue from "./SongQueue";

import { increaseCurrent, decreaseCurrent, toggleShuffle, nextRepeatMode } from "../../../redux/slices/songQueueSlice";
import audioAPI from "../../../apis/audioAPI";
import { IMG_HOST_URL, MUSIC_HOST_URL } from "../../../config/constants";
import { Link, useNavigate } from "react-router-dom";

function PlayerBar({ onFullscreenToggle, signal1, signal2, onSongQueueToggle, isSongQueueEnabled }) {
  // Redux state
  const dispatch = useDispatch();
  const songQueueSlice = useSelector((state) => state.songQueue);

  const navigate = useNavigate();

  const [isSongMetadataLoading, setIsSongMetadataLoading] = useState(false);

  const [coverURL, setCoverURL] = useState("");
  const [songName, setSongName] = useState("");
  const [artistsInfo, setArtistsInfo] = useState([]);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [lastUserSetPlayStatus, setLastUserSetPlayStatus] = useState(true);

  const [isScrubbing, setIsScrubbing] = useState(false);

  const [volume, setVolume] = useState(0.7);
  const [prevVolume, setPrevVolume] = useState(0.7);

  const [lyric, setLyric] = useState("");

  const audioRef = useRef(null);
  const playerRef = useRef(null);

  // On mount
  useEffect(() => {
    setupPlayer();
  }, []);

  // On song change
  useEffect(() => {
    if (songQueueSlice.current >= 0) {
      const songID = songQueueSlice.queue[songQueueSlice.current];
      populateSongNameAndCover(songID);
      loadSongIntoPlayer(songID);
    }
  }, [songQueueSlice.queue[songQueueSlice.current]]);

  // Player configurations
  async function setupPlayer() {
    const media = audioRef.current;
    if (!media) return;

    // Install built-in polyfills to patch browser incompatibilities.
    shaka.polyfill.installAll();
    if (!shaka.Player.isBrowserSupported()) {
      toast.error("This browser is not supported for audio playback!");
      return;
    }

    // Initialize Shaka player
    const player = new shaka.Player();
    playerRef.current = player;

    // Networking/filter setup
    const net = player.getNetworkingEngine?.();
    if (net) {
      net.registerRequestFilter((type, request) => {
        request.credentials = "include";
        request.allowCrossSiteCredentials = true;
      });
    }

    // Attach to the existing audio element
    player.attach(media).catch((e) => {
      toast.error("An unexpected error occurred during playback.");
    });

    // Cleanup on unmount
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    }
  }

  async function loadSongIntoPlayer(songID) {
    const player = playerRef.current;
    if (!player || !songID) return;

    player.load(`${MUSIC_HOST_URL}/${songID}/file/master.m3u8`).catch((e) => {
      toast.error("An unexpected error occurred during playback.");
    });
  }

  // Data fetching functions
  async function populateSongNameAndCover(songID) {
    setIsSongMetadataLoading(true);

    try {
      // Fetch song metadata
      const songMetadata = await audioAPI.fetchGETSongMetadata(songID);
      const resultCode = songMetadata.result;
      const payload = songMetadata.payload;

      // Process response
      if (resultCode == "Bx002" || resultCode == "3x003") {
        toast.error("Cannot load song metadata. Please try again later.");
        return;
      }
      else if (resultCode[0] == "B") {
        toast.error("Session expired. Please log in again.");
        navigate('/login');
        return;
      }
      else if (resultCode != "3x000") {
        toast.error("The requested song is unavailable.");
        return;
      }
      else if (resultCode == "3x000") {
        setCoverURL(`${IMG_HOST_URL}/${payload.cover_id}`);
        setSongName(payload.title);
      }
      else {
        throw new Error("Unrecognized response from server.");
      }

      // Fetch artists name
      const artistMetadata = await Promise.all(
        payload.artist_ids.map(async (artistID) => {
          try {
            return await audioAPI.fetchGETArtistMetadata(artistID);
          }
          catch {
            return { result: "5x003", payload: null };
          }
        })
      );

      // Process artist metadata
      const artistInfos = [];
      let aggregatedResultCode = 0;

      for (let i = 0; i < artistMetadata.length; i++) {
        if (artistMetadata[i].result == "5x000") {
          aggregatedResultCode = Math.max(aggregatedResultCode, 0);
          artistInfos.push({
            id: payload.artist_ids[i],
            name: artistMetadata[i].payload.name,
          });
        }
        else if (artistMetadata[i].result[0] == "B" && artistMetadata[i].result != "Bx002") {
          aggregatedResultCode = Math.max(aggregatedResultCode, 2);
          artistInfos.push({
            id: payload.artist_ids[i],
            name: "<Unknown Artist>",
          });
        }
        else {
          aggregatedResultCode = Math.max(aggregatedResultCode, 1);
          artistInfos.push({
            id: payload.artist_ids[i],
            name: "<Unknown Artist>",
          });
        }
      }

      if (aggregatedResultCode == 1) {
        toast.error("Some artist info could not be loaded.");
        return;
      }
      else if (aggregatedResultCode == 2) {
        toast.error("Session expired. Please log in again.");
        navigate('/login');
        return;
      }
      else {
        setArtistsInfo(artistInfos);
      }
    }
    catch (e) {
      console.error(e);
      if (e.name === "AbortError") return; // Ignore abort errors
      toast.error("An unexpected error occurred while loading song metadata. Please try again later.");
    }
    finally {
      setIsSongMetadataLoading(false);
    }
  }

  // Event handlers
  function onCanPlay() {
    if (audioRef.current && lastUserSetPlayStatus) {
      audioRef.current.play();
    }
  }

  function onTimeUpdate() {
    if (!isScrubbing) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }

  function onPlayPauseClick() {
    const media = audioRef.current;
    if (!media) return;
    if (media.paused) {
      media.play();
      setLastUserSetPlayStatus(true);
    } else {
      media.pause();
      setLastUserSetPlayStatus(false);
    }
  }

  function onNextClick() {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    dispatch(increaseCurrent());
  }

  function onPlayerError() {
    toast.error("An error occurred during playback!");
  }

  function onPlay() {
    setIsPlaying(true);
  }

  function onPause() {
    setIsPlaying(false);
  }

  function onEmptied() {
    setIsPlaying(false);
  }

  function onEnded() {
    if (songQueueSlice.repeatMode == 0 && songQueueSlice.current == songQueueSlice.queue.length - 1) {
      setLastUserSetPlayStatus(false);
    }
    onNextClick();
  }

  function onLoadedMetadata() {
    setDuration(audioRef.current.duration || 0);
  }

  function onDurationChange() {
    setDuration(audioRef.current.duration || 0);
  }

  function onSliderChange(value) {
    setIsScrubbing(true);
    setCurrentTime(value);
  }

  function onSliderChangeComplete(value) {
    setIsScrubbing(false);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
    }
  }

  function onVolumeChange(value) {
    setVolume(value);
    setPrevVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  }

  function onMuteClick() {
    if (volume > 0) {
      setVolume(0);
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
    }
    else {
      if (prevVolume == 0) {
        setVolume(0.7);
        setPrevVolume(0.7);
        if (audioRef.current) {
          audioRef.current.volume = 0.7;
        }
      }
      else {
        setVolume(prevVolume);
        if (audioRef.current) {
          audioRef.current.volume = prevVolume;
        }
      }
    }
  }

  // Helper functions
  const formatTime = (sec) => {
    if (!isFinite(sec) || sec <= 0) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full h-full">
      <audio
        hidden={true}
        ref={audioRef}
        controls
        onCanPlay={onCanPlay}
        onError={onPlayerError}
        onPlay={onPlay}
        onPause={onPause}
        onEmptied={onEmptied}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onDurationChange={onDurationChange}
      />
      <AnimatePresence>
        {/* Minimized Player */}
        {
          !signal1 && !signal2
            ? (
              <motion.div
                className="grid grid-cols-[minmax(300px,1fr)_auto_minmax(300px,1fr)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.5 } }}
                exit={{ opacity: 0 }}
              >
                {/* Left Section */}
                <div className="flex flex-row items-center overflow-hidden">
                  <div className="overflow-hidden h-18 w-18 rounded-[13px] bg-[#232323] flex justify-center items-center shrink-0 ml-1.5">
                    {
                      coverURL ?
                        <img className="h-full w-full object-cover" src={coverURL} alt="Cover" />
                        :
                        <img className="h-7 w-7" src={"/music-note.svg"} />
                    }
                  </div>
                  {
                    isSongMetadataLoading
                      ? (
                        <div className="ml-2 overflow-hidden flex flex-row items-center">
                          <img className="h-4 w-4 ml-2" src="/loading.gif" />
                          <span className="ml-1.5 text-[15px] text-nowrap">Loading song metadata...</span>
                        </div>
                      )
                      : (
                        <div className="ml-2">
                          <MarqueeText>
                            <Link className="text-[24px] font-bold text-nowrap hover:underline" to={`/song/${songQueueSlice.queue[songQueueSlice.current]}`}>{songName}</Link>
                          </MarqueeText>
                          <MarqueeText className="text-[13px] w-full">{
                            artistsInfo.map((artists, index) => {
                              return (
                                <span key={artists.id}>
                                  <Link
                                    className="hover:underline"
                                    to={`/artist/${artists.id}`}
                                  >
                                    {artists.name}
                                  </Link>
                                  <span>{index !== artistsInfo.length - 1 && ", "}</span>
                                </span>
                              )
                            })
                          }</MarqueeText>
                        </div>
                      )
                  }
                </div>

                {/* Center Section */}
                <div className="h-full w-150 flex flex-col ">
                  <div className="flex flex-row items-center pt-1">
                    <span className="w-14">{formatTime(currentTime)}</span>
                    <Slider
                      className="mb-1 flex-1"
                      railStyle={{ backgroundColor: '#2d2d2d80', height: 8 }}
                      trackStyle={{ backgroundColor: '#545454', height: 8 }}
                      handleStyle={{ display: 'none' }}

                      min={0}
                      max={duration}
                      value={currentTime}

                      onChange={onSliderChange}
                      onChangeComplete={onSliderChangeComplete}
                    />
                    <span className="ml-1.5 w-14">{formatTime(duration)}</span>
                  </div>

                  <div className="flex-1 flex flex-row items-center justify-center pb-3">
                    <div onClick={() => { dispatch(toggleShuffle()); }}>
                      {
                        songQueueSlice.shuffle ? <ShuffleButton size={30} /> : <ShuffleDisabledButton size={30} />
                      }
                    </div>
                    <div className="ml-5" onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                      }
                      dispatch(decreaseCurrent());
                    }}>
                      <RewindButton size={30} />
                    </div>
                    <div className="ml-2" onClick={onPlayPauseClick}>
                      {
                        isPlaying ? <PauseButton size={42} /> : <PlayButton size={42} />
                      }
                    </div>
                    <div className="ml-2" onClick={onNextClick}>
                      <ForwardButton size={30} />
                    </div>
                    <div className="ml-5" onClick={() => { dispatch(nextRepeatMode()); }}>
                      {
                        songQueueSlice.repeatMode == 0
                          ? (<RepeatDisabledButton size={30} />)
                          : songQueueSlice.repeatMode == 1
                            ? (<RepeatButton size={30} />)
                            : (<RepeatOneButton size={30} />)
                      }
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-row justify-end items-center pr-5 space-x-2">
                  <div onClick={onSongQueueToggle}>
                    {
                      isSongQueueEnabled
                        ?
                        <ListMusic color="#5f5f5fff" size={20} />
                        :
                        <ListMusic size={20} />
                    }
                  </div>
                  <div onClick={onMuteClick}>
                    {
                      volume == 0 ? <VolumeX size={20} /> :
                        (volume <= 0.33) ? <Volume size={20} /> :
                          (volume <= 0.66) ? <Volume1 size={20} /> :
                            <Volume2 size={20} />
                    }
                  </div>
                  <div className="w-18">
                    <Slider
                      className="mb-1"
                      railStyle={{ backgroundColor: '#2d2d2d80', height: 8 }}
                      trackStyle={{ backgroundColor: '#aaaaaa', height: 8 }}
                      handleStyle={{ display: 'none' }}

                      min={0}
                      max={1}
                      step={0.01}
                      value={volume}
                      onChange={onVolumeChange}
                    />
                  </div>
                  <div onClick={onFullscreenToggle}>
                    <Maximize size={20} />
                  </div>
                </div>
              </motion.div >
            ) : null
        }
        {/* Fullscreen Player */}
        {
          signal1 && signal2
            ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.5 } }}
                exit={{ opacity: 0 }}
                className="flex flex-col h-full w-full"
              >
                {/* Top Bar */}
                <div className="
                  w-full h-[83px]
                  grid grid-cols-[minmax(300px,1fr)_auto_minmax(300px,1fr)]
                  "
                >
                  <div className="w-1 flex flex-row items-center justify-end pr-3 space-x-2" />

                  <div className="w-150 flex items-center justify-center bg-[#38383880] rounded-2xl m-2">
                    <img className="w-15 h-15" src="/logo.png" alt="Logo" />
                  </div>

                  <div className="flex justify-end pr-5 items-center" onClick={onFullscreenToggle}>
                    <Minimize size={20} />
                  </div>
                </div>

                <div className="w-full flex flex-row items-center overflow-hidden flex-1">
                  {/* Song Section */}
                  <div className="h-full border-r-2 border-solid w-120 flex flex-col items-center justify-center
                                  [border-image:linear-gradient(to_bottom,transparent,#aaaaaa_50%,transparent_100%)_1]">

                    {/* Cover image */}
                    <div className="overflow-hidden h-100 w-100 rounded-[13px] bg-[#232323] flex justify-center items-center shrink-0">
                      {
                        coverURL ?
                          <img className="h-full w-full object-cover" src={coverURL} alt="Cover" />
                          :
                          <img className="h-15 w-15" src={"/music-note.svg"} />
                      }
                    </div>

                    {/* Song title and artist names */}
                    <div className="w-100 h-[79px] flex flex-row items-center">
                      {
                        isSongMetadataLoading
                          ? (
                            <div className="ml-4 overflow-hidden flex flex-row items-center">
                              <img className="h-4 w-4 ml-2" src="/loading.gif" />
                              <span className="ml-1.5 text-[15px] text-nowrap">Loading song metadata...</span>
                            </div>
                          )
                          : (
                            <div className="w-full flex flex-row items-center mt-4 ml-3">
                              <div className="flex flex-col flex-1 min-w-0">
                                <MarqueeText className="w-full ">
                                  <Link className="text-[27px] font-bold text-nowrap hover:underline" to={`/song/${songQueueSlice.queue[songQueueSlice.current]}`}>{songName}</Link>
                                </MarqueeText>
                                <MarqueeText className="text-[15px] w-full">{
                                  artistsInfo.map((artists, index) => {
                                    return (
                                      <span key={artists.id}>
                                        <Link
                                          className="hover:underline"
                                          to={`/artist/${artists.id}`}
                                        >
                                          {artists.name}
                                        </Link>
                                        <span>{index !== artistsInfo.length - 1 && ", "}</span>
                                      </span>
                                    )
                                  })
                                }</MarqueeText>
                              </div>
                              {
                                songQueueSlice.current != -1 ? <div className="p-4"><CircleEllipsis size={30} /></div> : null
                              }
                            </div>
                          )
                      }
                    </div>

                    {/* Progress bar */}
                    <div className="w-100 flex flex-col mt-10">
                      <Slider
                        className="mb-1 flex-1"
                        railStyle={{ backgroundColor: '#2d2d2d80', height: 8 }}
                        trackStyle={{ backgroundColor: '#545454', height: 8 }}
                        handleStyle={{ display: 'none' }}

                        min={0}
                        max={duration}
                        value={currentTime}

                        onChange={onSliderChange}
                        onChangeComplete={onSliderChangeComplete}
                      />

                      <div className="flex flex-row w-full items-center justify-between mt-1">
                        <span className="w-14 self-start">{formatTime(currentTime)}</span>
                        <span className="ml-1.5 w-14 self-end">{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Playback controls */}
                    <div className="w-100 flex flex-row items-center justify-center pb-3 mt-2">
                      <div onClick={() => { dispatch(toggleShuffle()); }}>
                        {
                          songQueueSlice.shuffle ? <ShuffleButton size={30} /> : <ShuffleDisabledButton size={30} />
                        }
                      </div>
                      <div className="ml-5" onClick={() => {
                        if (audioRef.current) {
                          audioRef.current.currentTime = 0;
                        }
                        dispatch(decreaseCurrent());
                      }}>
                        <RewindButton size={30} />
                      </div>
                      <div className="ml-2" onClick={onPlayPauseClick}>
                        {
                          isPlaying ? <PauseButton size={42} /> : <PlayButton size={42} />
                        }
                      </div>
                      <div className="ml-2" onClick={onNextClick}>
                        <ForwardButton size={30} />
                      </div>
                      <div className="ml-5" onClick={() => { dispatch(nextRepeatMode()); }}>
                        {
                          songQueueSlice.repeatMode == 0
                            ? (<RepeatDisabledButton size={30} />)
                            : songQueueSlice.repeatMode == 1
                              ? (<RepeatButton size={30} />)
                              : (<RepeatOneButton size={30} />)
                        }
                      </div>
                    </div>

                    {/* Volume controls */}
                    <div className="w-100 flex flex-row items-center mt-15">
                      <div onClick={onMuteClick}>
                        {
                          volume == 0 ? <VolumeX size={20} /> :
                            (volume <= 0.33) ? <Volume size={20} /> :
                              (volume <= 0.66) ? <Volume1 size={20} /> :
                                <Volume2 size={20} />
                        }
                      </div>
                      <div className="flex-1 ml-2">
                        <Slider
                          className="mb-1"
                          railStyle={{ backgroundColor: '#2d2d2d80', height: 8 }}
                          trackStyle={{ backgroundColor: '#545454', height: 8 }}
                          handleStyle={{ display: 'none' }}

                          min={0}
                          max={1}
                          step={0.01}
                          value={volume}
                          onChange={onVolumeChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lyric Section */}
                  <div className="h-full border-r-2 border-solid flex-1 p-20
                                  [border-image:linear-gradient(to_bottom,transparent,#aaaaaa_50%,transparent_100%)_1]">
                    {
                      lyric ? <span>{lyric}</span> : <span className="text-[#888888]">Lyric data unavailable.</span>
                    }
                  </div>

                  {/* Queue Section */}
                  <div className="h-full w-100 p-10">
                    <SongQueue />
                  </div>

                </div>
              </motion.div>
            ) : null
        }
      </AnimatePresence>
    </div>
  )
}

export default PlayerBar;