import { useState } from 'react';

export const CustomTabs = ({ defaultActiveKey, children }) => {
    const [activeTab, setActiveTab] = useState(defaultActiveKey);

    const handleTabSelect = (key) => {
        setActiveTab(key);
    };

    // 如果 children 不是數组，就把它轉換成數組
    const childrenArray = Array.isArray(children) ? children : [children];

    return (
        <div className="custom-tabs">
            <div className="tab-list">
                {childrenArray.map((child) => {
                    const { eventKey, title } = child.props;
                    return (
                        <div
                            key={eventKey}
                            className={`tab ${activeTab === eventKey ? 'active' : ''}`}
                            onClick={() => handleTabSelect(eventKey)}
                        >
                            <span className={`icons ${eventKey}`}></span>{title}
                        </div>
                    );
                })}
            </div>
            <div className="tab-content">
                {childrenArray.map((child) => {
                    const { eventKey, children: tabChildren } = child.props;
                    return activeTab === eventKey ? <div key={eventKey}>{tabChildren}</div> : null;
                })}
            </div>
        </div>
    );
};

export const CustomTab = ({ eventKey, title, children }) => {
    return <div data-event-key={eventKey} data-title={title}>{children}</div>;
};
