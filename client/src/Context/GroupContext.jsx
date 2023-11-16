import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ToastContext from "./ToastContext";

const GroupContext = createContext({});

export const GroupProvider = ({ children }) => {
    const [groupList, setGroupList] = useState([]);
    const [group, setGroup] = useState({});
    const [memberList, setMemberList] = useState([]);
    const [expenseList, setExpenseList] = useState([]);
    const [settledExpenseList, setSettledExpenseList] = useState([]);

    const { showToast } = useContext(ToastContext);

    const navigate = useNavigate();

    const fetchGroups = async () => {
        // Assuming authService and groupService exist
        const currentUser = authService.getCurrentUser();
        const groups = await groupService.getGroupByMemberId(currentUser.id);
        setGroupList(groups);
    };

    const getGroupById = (id) => {
        return groupList.find((group) => group._id === id);
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const currentUser = authService.getCurrentUser();

    const fetchGroupById = async (groupId) => {
        if (!groupId) return;
        const result = await groupService.getGroupById(groupId);
        if (result) {
            setGroup(result);
            setMemberList(result.members);
        } else {
            showToast("Group not found", "error");
            navigate("/groups");
        }
    };

    const fetchExpenses = async (groupId) => {
        if (!groupId) return;
        const { activeExpenses, settledExpenses } =
            await expenseService.getExpensesByGroupIdAndMemberId(
                groupId,
                currentUser.id
            );

        if (activeExpenses || settledExpenses) {
            setExpenseList(activeExpenses || []);
            setSettledExpenseList(settledExpenses || []);
        }
    };

    return (
        <GroupContext.Provider
            value={{
                group,
                groupList,
                fetchGroups,
                getGroupById,
                expenseList,
                fetchExpenses,
                fetchGroupById,
                memberList,
                settledExpenseList,
                setMemberList,
            }}
        >
            {children}
        </GroupContext.Provider>
    );
};

export default GroupContext;
