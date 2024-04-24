
import { connect } from 'react-redux';
import './index.scss';

const RoadMap = (props) => {


    // 露單樣式，須看實際資料再作調整
    // 生成表格的列和行
    const columns = Array.from({ length: 35 }, (_, index) => index + 1);
    const rows = Array.from({ length: 5 }, (_, index) => index + 1);
    // 實際看後端返回什麼後再做一次處理
    // const backendData = [0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1];
    // const [backendData, setBackendData] = useState([]);



    return (
        <div className="table-container">
            <table>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row}>
                            {columns.map((col, colIndex) => {
                                const index = colIndex * rows.length + (row - 1);                            
                                return (
                                    <td key={col}>
                                        
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
};



export default (RoadMap);
