const getGroupDetails = async (set, _id) => {
    try {
        const res = await fetch(`/group/member/${_id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            credentials: "include"
        });
        const data = await res.json();
        set(data);
        if (!res.status === 200) {
            alert("Error");
        }
    } catch (err) {
        console.log(err);
    }
}

export default getGroupDetails;