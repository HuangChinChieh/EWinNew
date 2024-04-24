import { useEffect, useState } from 'react';
import './index.scss';

const Tips = (props) => {
    const [showTips, setShowTips] = useState('hiddenTips');




    useEffect(() => {
        if (123) {
            setShowTips('showTips');

            const timerId = setTimeout(() => {
                setShowTips('hiddenTips');
            }, 2000);

            return () => clearTimeout(timerId);
        }
    }, [123]);

    return (
        <div className={`tips-box ${showTips}`}>
            <p>
                {123}
            </p>
        </div>
    )
}

export default Tips;