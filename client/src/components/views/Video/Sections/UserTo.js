import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Card, Avatar } from 'antd';

import { SERVER_SUBSCRIBE } from '../../../Config';

const { Meta } = Card;


function UserTo(props) {
    const [SpecificUser, setSpecificUser] = useState('');

    const onSpecific = (userTo) => {
        let variables = { };

        // 아무 계정도 선택되어있지 않거나 현재 선택되어있지 않은 계정을 선택한 경우
        if(SpecificUser === '' || SpecificUser !== userTo.name) {
            variables = { uploader: userTo }

            Axios.post(`${SERVER_SUBSCRIBE}/getSpecificVideos`, variables)
            .then(response => {
                if(response.data.getSpecificVideosSuccess) {
                    props.onRefreshVideos(response.data.videos);
                    setSpecificUser(userTo.name);
                }
                else {
                    alert('영상 목록을 가져오는데 실패하였습니다.');
                }
            });
        }
        // 현재 선택되어있는 계정을 다시 선택한 경우
        else {
            variables = { userFrom: localStorage.getItem('userId') }

            Axios.post(`${SERVER_SUBSCRIBE}/getAllVideos`, variables)
            .then(response => {
                if(response.data.getAllVideosSuccess) {
                    props.onRefreshVideos(response.data.videos);
                    setSpecificUser('');
                }
                else {
                    alert('영상 목록을 가져오는데 실패하였습니다.');
                }
            });
        }
    }

    return (
        <div className="subscribe-list">
            {props.userTo && props.userTo.map((userTo, index) => (
                <React.Fragment key={index}>
                    <div className="subscribe-list-userto" style={{ opacity: `${SpecificUser === '' || SpecificUser === userTo.name ? '1' : '0.4'}` }}>
                        <div className="subscribe-list-userto-info">
                            <Meta onClick={() => { onSpecific(userTo)}} avatar={<Avatar src={`http://localhost:5000/${userTo.profilePath}`} />} />
                            <p>{userTo.name}</p>
                        </div>
                    </div>
                </React.Fragment>
            ))}
        </div>
    )
}

export default UserTo;
