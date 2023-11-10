import { UserGroupIcon, XIcon } from "@heroicons/react/outline";
import Joi from "joi";
import Breadcrumb from "../../Components/BreadCrumb";
import SearchMember from "../../Components/SearchBox";
// import button from "components/button";
// import FormInput from "components/FormInput";
import { useContext, useState } from "react";
// import { authService, groupService } from "services";
// import ToastContext from "contexts/ToastContext";
// import GroupContext from "contexts/GroupContext";
import { useNavigate } from "react-router-dom";
import FormInput from "../../Components/FormInput";


const schema = {
    name: Joi.string().required().min(1).max(50).label("Name"),
    description: Joi.string().allow("").label("Description"),
};

const AddGroup = () => {
    const navigate = useNavigate();
    // const currentUser: any = authService.getCurrentUser();
    const currentUser = {
        name: "Abhishek",
        email: "abhishek.20214053@gmail.com",
        id: "dnfajndvaokonoafnvaof"
    }
    // const { fetchGroups } = useContext(GroupContext);
    const [group, setGroup] = useState({
        name: "",
        description: "",
    });
    const [memberList, setMemberList] = useState([
        {
            name: currentUser.name,
            email: currentUser.email,
            id: currentUser.id,
        },
    ]);

    // const { showToast } = useContext(ToastContext);



    const handleSubmit = (e) => {
        e.preventDefault();
    };


    const handleChange = ({ currentTarget: input }) => {
        setGroup({ ...group, [input.name]: input.value });
    };

    const handleRemoveMember = (id) => {
        setMemberList(memberList.filter((member) => member.id !== id));
    };

    return (
        <div className="mt-4 flex h-[calc(100vh-180px)] flex-1 flex-col px-4  sm:px-6 lg:mx-auto lg:px-8 xl:max-w-6xl">
            {/* Page Header */}
            <div className="">
                <Breadcrumb
                    paths={[
                        { name: "Groups", to: "/groups" },
                        { name: "Add Group", to: "/addgroup" },
                    ]}
                />
                <div className="mt-10 md:flex md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                            Add Group
                        </h2>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex flex-1 flex-col items-center justify-evenly lg:flex-row lg:justify-between">
                <div className="mt-4 mb-6 w-full max-w-md lg:mb-0 lg:w-3/4">
                    <FormInput
                        label="Name"
                        name="name"
                        type="text"
                        placeholder="Enter Group Name"
                        onChange={handleChange}
                    />
                    <FormInput
                        label="Description"
                        name="description"
                        type="text"
                        placeholder="Enter Group Description (Optional)"
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-2 w-full lg:mt-0 lg:w-2/4">
                    <p className="text-xl font-bold">Add Members</p>
                    <div className="mt-2">
                        <SearchMember
                            handleAdd={null}
                            memberList={memberList}
                            setMemberList={setMemberList}
                        />
                    </div>
                    {/* Member List */}
                    {/* Empty State */}
                    {memberList.length < 1 && (
                        <div className="mt-2 rounded border-2 border-dashed p-2 text-center lg:mt-12">
                            <div className="flex justify-center">
                                <UserGroupIcon className="w-10 stroke-slate-600 stroke-1" />
                            </div>
                            <h3 className="text mt-2 font-medium text-gray-900">
                                No members
                            </h3>
                            <p className="text mt-1 text-gray-500">
                                Add users by searching for them in the search bar above.
                            </p>
                        </div>
                    )}
                    {/* END Empty State */}
                    {memberList.length > 0 && (
                        <div className="mt-4">
                            <p className="mb-3 font-semibold uppercase text-gray-800">
                                Member List
                            </p>
                            <div className="flex flex-col">
                                {memberList.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex w-full flex-row justify-around border-b py-3"
                                    >
                                        <div className="flex-1">
                                            <p className="text font-medium text-gray-900">
                                                {member.name}
                                            </p>
                                            <p className="text-sm text-gray-500">{member.email}</p>
                                        </div>
                                        <button
                                            type="icon"
                                            margin="mr-5"
                                            onClick={() => handleRemoveMember(member.id)}
                                        >
                                            <XIcon className="w-5 text-red-600" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* END Member List */}
                </div>
            </div>
            <div className="flex flex-1 items-end justify-center">
                <button onClick={handleSubmit} className=" bg-blue-700 flex items-center justify-between cursor-pointer px-4 py-2 md:px-6 rounded font-medium active:ring-2 ring-brand-200 text-white bg-brand-600 hover:bg-brand-700" width="w-full">AddGroup</button>
            </div>
        </div>
    );
};

export default AddGroup;
