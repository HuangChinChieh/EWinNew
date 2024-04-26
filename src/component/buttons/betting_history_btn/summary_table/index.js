import React from 'react';

const SummaryTable = ({ tableData, tableHeaders, toHistoryDetail }) => {


    return (
        <table>
            <>
                <thead>
                    <tr>
                        {tableHeaders.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((data, index) => (
                        <tr key={index}>
                            <td>{data.SummaryDate}</td>
                            <td>{data.CurrencyType}</td>
                            <td>
                                {data.GameCode === 'EWin.BAC.0' ? '傳統' :
                                data.GameCode === 'EWin.BAC.1' ? '快速' :
                                data.GameCode === 'EWin.BAC.2' ? '網投' :
                                ''}
                            </td>
                            <td>{data.RewardValue}</td>
                            <td>{data.ValidBetValue}</td>
                            <td className='detail' onClick={() => toHistoryDetail(data.GameCode, data.SummaryDate)}>
                                <div>＋</div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </>
        </table>
    );
}

export default SummaryTable;