import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingPage from "@/pages/misc/Loading";
import authAPI from "@/apis/authAPI";

function RouteProtector({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await authAPI.verifySession();
                if (response.result === "Bx000") {
                    setIsLoading(false);
                    return;
                } else {
                    navigate("/login");
                    return;
                }
            }
            catch {
                navigate("/login");
                return;
            }
        }
        checkAuth();
    }, []);

    return <>{isLoading ? <LoadingPage message="Loading..." /> : children}</>;
}

export default RouteProtector;