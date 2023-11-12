const getUserDeatils = async (setCurrentUser) => {
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
        if (!res.status === 200) {
            alert("Error");
        }
    } catch (err) {
        console.log(err);
        navigate("/")
    }
}

export default getUserDeatils;