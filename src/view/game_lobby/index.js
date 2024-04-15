
import { useLobbyContext } from 'provider/GameLobbyProvider';
import Section from 'component/section';
import { connect } from 'react-redux';
import DefaultVedio from 'component/default_vedio';
import Titlebar from 'component/title_bar';
import { CustomTabs, CustomTab } from 'component/custom_tabs';
import Loading from 'component/loading';

import './index.scss';

function Gamelobby(props) {

    const { t } = useLobbyContext();



    return (
        <div className='game-lobby-wrap'>
            {props.isGameLobbyLoading ? (
                <Loading />
            ) : (

                <div>
                    <div className='forpc'>
                        <div className='hasbg'>
                            <div className="container-fluid demobg"></div>
                            <div className='demoheight'>
                                <div className='container'>
                                    <div className='row'>
                                        <div className='col'>
                                            <div className='list-box'>
                                                <CustomTabs
                                                    defaultActiveKey="baccarat"
                                                >
                                                    <CustomTab eventKey="baccarat" title={t("Global.ba")}>
                                                        <Section />
                                                        {/* hardcode demo用 */}
                                                        {/* <Section listItems={listItems1} /> */}
                                                    </CustomTab>
                                                    {/* <CustomTab eventKey="baccarat" title="百家樂">
                                                     
                                                        </CustomTab> */}
                                                </CustomTabs>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='formb'>
                        <div className='hasbg'>
                            <div className='demoheight'>
                                <div className='container'>
                                    <div className='row'>
                                        <div className='col'>
                                            <div className='list-box'>
                                                <CustomTabs
                                                    defaultActiveKey="baccarat"
                                                >
                                                    <CustomTab eventKey="baccarat" title={t("Global.ba")}>
                                                        <DefaultVedio />
                                                        <Titlebar title="全部遊戲" />
                                                        {/* hardcode demo用 */}
                                                        {/* <Section listItems={listItems1} /> */}
                                                        <Section />
                                                    </CustomTab>
                                                    {/* <CustomTab eventKey="baccarat" title="百家樂">
                                                        <Titlebar title="百家樂" />
                                    
                                                    </CustomTab> */}
                                                </CustomTabs>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            )}
        </div>
    )
}

// export default Gamelobby;

const mapStateToProps = (state) => {
    return {
        isGameLobbyLoading: state.gameLobby.isGameLobbyLoading,
    };
};



export default connect(mapStateToProps)(Gamelobby);