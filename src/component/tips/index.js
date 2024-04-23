import { useEffect, useState } from 'react';
import './index.scss';
import { useLobbyContext } from 'provider/GameLobbyProvider';

const Tips = (props) => {
    const [showTips, setShowTips] = useState('hiddenTips');
    const {
        showMessage
    } = useLobbyContext();



    useEffect(() => {
        if (showMessage) {
            setShowTips('showTips');

            const timerId = setTimeout(() => {
                setShowTips('hiddenTips');
            }, 2000);

            return () => clearTimeout(timerId);
        }
    }, [showMessage]);

    return (
        <div className={`tips-box ${showTips}`}>
            <p>
                {showMessage}
            </p>
        </div>
    )
}

export default Tips;