import { useSelector } from "react-redux";

function SongQueue() {
    const songQueueSlice = useSelector((state) => state.songQueue);

    return (
        <div className="w-full h-full overflow-hidden">
            {
                songQueueSlice.queue.map((song, index) => (
                    <div
                        key={index}
                    >
                        <span className={songQueueSlice.current === index ? "font-bold" : ""}>{song}</span>
                    </div>
                ))
            }
        </div>
    )
}

export default SongQueue;