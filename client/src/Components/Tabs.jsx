import React, { useState } from "react";

const Tabs = (props) => {
    const [activeTab, setActiveTab] = useState(0);
    const { tabs } = props;

    const handleClick = (index) => {
        setActiveTab(index);
    };

    return (
        <div className="dark:bg-gray-900 dark:text-white flex flex-col">
            <div className="dark:bg-gray-900 dark:text-white flex">
                {tabs.map((tab, index) => {
                    const { label } = tab;
                    return (
                        <div
                            key={index}
                            className={`${activeTab === index
                                    ? "dark:bg-gray-900 dark:text-white border-b-2 border-blue-500 text-blue-600"
                                    : "bg-white dark:bg-gray-900"
                                } p-2 cursor-pointer mb-2 font-medium`}
                            onClick={() => handleClick(index)}
                        >
                            {label}
                        </div>
                    );
                })}
            </div>
            <div className="dark:bg-gray-900 dark:text-white flex flex-col">
                <div className="dark:bg-gray-900 dark:text-white p-2">
                    {tabs.find((_, index) => index === activeTab)?.content}
                </div>
            </div>
        </div>
    );
};

export default Tabs;
