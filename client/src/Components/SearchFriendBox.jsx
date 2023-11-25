import { CheckIcon } from "@heroicons/react/outline";
import SearchInput from "./SearchInput";
import { useState, useContext } from "react";
import axios from "axios";

const SearchFriend = ({
    memberList,
    setMemberList,
    handleAdd,
}) => {
    const [email, setEmail] = useState("");
    const [foundUser, setFoundUser] = useState(false);
    const [searchedUser, setSearchedUser] = useState();

    const handleChange = ({ currentTarget: input }) => {
        setFoundUser(false);
        setEmail(input.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        doSearch();
    };

    const doSearch = async () => {
        try {
            const result = await axios.get(`http://localhost:4000/user/getDetailsByEmail/${email}`);
            if (result.data) {
                setSearchedUser(result.data);
                setFoundUser(true);
            }
        } catch (error) {
            alert("No person with this email found")
            console.log(error);
        }
    };

    const handleAddMember = (e) => {
        // if (memberList.length === 5) {
        //     alert("Maximum 5 Friend are allowed in the group", "warning");
        //     return;
        // }
        if (memberList.find((member) => member.email === searchedUser.email)) {
            alert("Friend already added : error");
            setSearchedUser({});
            setFoundUser(false);
            setEmail("");
        } else {
            setMemberList([...memberList, searchedUser]);
            if (handleAdd) {
                handleAdd(searchedUser.id);
            }
            alert("Friend added : success");
            setSearchedUser({});
            setFoundUser(false);
            setEmail("");
        }
        return;
    };

    return (
        <>
            <div className="flex items-start dark:bg-black">
                <SearchInput
                    name="email"
                    placeholder="Search by email"
                    onChange={handleChange}
                    value={email}
                    foundUser={foundUser}
                />

                <div className="ml-5 dark:bg-black">
                    {foundUser ? (
                        <button
                            leftIcon={<CheckIcon className="w-5 " />}
                            onClick={handleAddMember}
                            className=" bg-blue-700 flex items-center justify-between cursor-pointer px-4 py-2 md:px-6 rounded font-medium active:ring-2 ring-brand-200 text-white bg-brand-600 hover:bg-brand-700 dark:bg-black" width="w-full">Add</button>
                    ) : (
                        <button onClick={handleSearch} className=" bg-blue-700 flex items-center justify-between cursor-pointer px-4 py-2 md:px-6 rounded font-medium active:ring-2 ring-brand-200 text-white bg-brand-600 hover:bg-brand-700 dark:bg-black " width="w-full">Search</button>
                    )}
                </div>
            </div>
            {foundUser && (
                <div className="mt-1 text-green-700">
                    Do you want to add this user to your FriendList?
                </div>
            )}
        </>
    );
};

export default SearchFriend;
