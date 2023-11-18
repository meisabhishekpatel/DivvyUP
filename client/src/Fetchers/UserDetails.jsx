const fetchUserDetails = async () => {
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
        if (!res) {
            alert("Error");
        }
        // setId(data._id);
        return data;
    } catch (err) {
        console.log(err);
        // navigate("/");
    }
}

export default fetchUserDetails;