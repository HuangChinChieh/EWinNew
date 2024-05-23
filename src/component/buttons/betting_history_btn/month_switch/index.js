
const MonthSwtich = ({updateDatesAndSearch}) => {
    // 增減一個月
    const handleAddMonth = () => {
        updateDatesAndSearch((date, setDate) => {
            date.setMonth(date.getMonth() + 1);
            setDate(date.toISOString().split('T')[0]);
        });
    };
    const handleSubtractMonth = () => {
        updateDatesAndSearch((date, setDate) => {
            date.setMonth(date.getMonth() - 1);
            setDate(date.toISOString().split('T')[0]);
        });
    };

    return (
        <div className='month-container' >
            <button onClick={handleSubtractMonth}>
                <span>＜</span>
                上個月
            </button>
            <button onClick={handleAddMonth}>
                下個月
                <span>＞</span>
            </button>
        </div>
    )
}

export default MonthSwtich;