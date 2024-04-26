import { useState } from 'react';
import snapshot from '../../../../img/bettinghistory/snapshot.png'

const BettingHistoryDetail = ({detailTableHeaders,tableData,reacquireHistoryDetail,detailList,tableHeaders}) => {    
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const openLightbox = () => {
      setLightboxOpen(true);
    };
  
    const closeLightbox = () => {
      setLightboxOpen(false);
    };
    
    return ( 
        <>
            <table className='table-flex'>
                    <tbody>
                        <tr className='header'>
                            <th>{tableHeaders[0]}</th>
                        </tr>
                        <tr>
                            <td className='day-choose'>
                                {tableData.map((data, index) => (
                                    <span key={index} onClick={() => reacquireHistoryDetail(data.GameCode, data.SummaryDate)}>{data.SummaryDate}</span>
                                ))}
                            </td>
                        </tr>
                    </tbody>
                    <tbody className='detailContainer'>
                        <tr className='header'>
                            {detailTableHeaders.map((data, index) => (
                                <th key={index}>{data}</th>
                            ))}
                        </tr>
                            {detailList.map((data, index) => (
                                <tr key={index} className='detail'>
                                    <td className='col-arrange-center'>
                                        <span className='order-id'>{data.OrderID}</span>
                                        <span>{data.CreateDate.split(" ")[0]}</span>
                                        <span>{data.CreateDate.split(" ")[1]}</span>
                                    </td>
                                    <td>{data.RoundInfo}</td>
                                    <td>{data.CurrencyType}</td>
                                    <td className='col-arrange-left'>
                                        <span>庒:{data.OrderBanker}</span>
                                        <span>閒:{data.OrderPlayer}</span>
                                        <span>和:{data.OrderTie}</span>
                                        <span>庒對:{data.OrderBankerPair}</span>
                                        <span>閒對:{data.OrderPlayerPair}</span>
                                    </td>
                                    <td>
                                        {data.Result === '1' || data.Result === '5' || data.Result === '9' || data.Result === 'D' ? '庒' :
                                        data.Result === '2' || data.Result === '6' || data.Result === 'A' || data.Result === 'E' ? '閒' :
                                        data.Result === '3' || data.Result === '7' || data.Result === 'B' || data.Result === 'F' ? '和' :
                                        ''}
                                    </td>
                                    <td>{data.RewardValue}</td>
                                    <td>{data.BuyChipValue}</td>
                                    <td>{data.LendChipTax}</td>
                                    <td>{data.AddChip}</td>
                                    <td>{data.TipsValue}</td>
                                    <td>{data.TableChip}</td>
                                    <td className='snapshot' 
                                    onClick={openLightbox}
                                    >
                                        {/* <img src={data.SnapShot} alt="Snapshot" /> */}
                                        <img src={snapshot} alt="Description ohe image" />
                                    </td>
                                    
                                </tr>
                            ))}

                    </tbody>
            </table>
            <div>
                <div className={`lightbox ${lightboxOpen ? 'open' : ''}`} onClick={closeLightbox}>
                    <div className="lightbox-content">
                    <img src={snapshot} alt="" />
                    <button className="close-button" onClick={closeLightbox}>X</button>
                    </div>
                </div>
            </div>    
        </>

    )
}



export default BettingHistoryDetail;