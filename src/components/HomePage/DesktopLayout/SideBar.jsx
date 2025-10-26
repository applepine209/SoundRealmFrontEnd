import { motion } from "motion/react"
import { useNavigate } from "react-router-dom"

function SideBar() {
	const navigate = useNavigate();

	return (
		<>
			<button onClick={() => navigate('/login')}>To Login</button>
			<button onClick={() => navigate('/song/123')}>To Song</button>
			<button onClick={() => navigate('/artist/123')}>To Artist</button>
			<button onClick={() => navigate('/album/123')}>To Album</button>
		</>
	)
}

export default SideBar;