import { useSelector } from "react-redux";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useState } from "react";

function SongQueueItem({ songID, index, currentIndex }) {
  const [coverURL, setCoverURL] = useState(null);
  const [title, setTitle] = useState("Loading...");
  const [artist, setArtist] = useState("Loading...");
  const [isSongMetadataLoading, setIsSongMetadataLoading] = useState(true);

  async function fetchMetadata() {
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

  return (
    <div className="flex flex-col border mt-1 w-full min-w-0 overflow-hidden box-border">
      <span className="text-nowrap">Song ID: {songID}</span>
      <div className="truncate">Index: {index}</div>
      <div className="truncate">Current Index: {currentIndex}</div>
    </div>
  )
}

function SongQueue() {
  const songQueueSlice = useSelector((state) => state.songQueue);

  return (
    <ScrollArea.Root className="size-full" type="scroll">
      <ScrollArea.Viewport
        className="size-full"
        style={{
          width: '100%',
          overflowX: 'hidden',
          overflowY: 'scroll'
        }}
      >
        {/* Force inner wrapper to 100% width */}
        <div className="w-full min-w-0" style={{ width: '95%', boxSizing: 'border-box' }}>
          {
            songQueueSlice.queue.map((song, index) => (
              <SongQueueItem
                key={song ?? index}
                songID={song}
                index={index}
                currentIndex={songQueueSlice.current}
              />
            ))
          }
        </div>
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar
        className="flex touch-none select-none bg-gray-100 p-1 rounded
             data-[orientation=vertical]:w-2.5"
        orientation="vertical"
      >
        <ScrollArea.Thumb
          className="relative flex-1 w-full h-full rounded-full bg-gray-400 hover:bg-gray-500
               focus:outline-none focus:ring-2 focus:ring-blue-400
               data-[orientation=vertical]:min-h-[44px]"
        />
      </ScrollArea.Scrollbar>

      <ScrollArea.Corner className="bg-gray-100" />
    </ScrollArea.Root>
  )
}

export default SongQueue;