import { useNavigate } from "react-router-dom";

const getUserDeatils = async (setCurrentUser) => {
    // const navigate = useNavigate();
    try {
        const res = await fetch("/user/details", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            credentials: "include"
        });
        const data = await res.json();
        setCurrentUser(data);
        if (!res) {
            alert("Error");
        }
    } catch (err) {
        console.log(err);
        // navigate("/");
    }
}

export default getUserDeatils;

