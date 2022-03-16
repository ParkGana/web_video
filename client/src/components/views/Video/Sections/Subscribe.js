import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Card, Avatar } from 'antd';

import { SERVER_SUBSCRIBE } from '../../../Config';

const { Meta } = Card;


function Subscribe(props) {
    const [SubscribeNumber, setSubscribeNumber] = useState(0);
    const [Subscribed, setSubscribed] = useState(false);
    

    useEffect(() => {
        const variables = {
            userTo: props.userTo
        }

        Axios.post(`${SERVER_SUBSCRIBE}/getSubscribes`, variables)
        .then(response => {
            if (response.data.getSubscribesSuccess) {
                setSubscribeNumber(response.data.subscribes.length);

                response.data.subscribes.map(subscribe => {
                    if (subscribe.userFrom === props.userFrom) {
                        setSubscribed(true);
                    }
                });
            }
            else {
                alert('구독자 현황을 가져오는데 실패하였습니다.');
            }
        });
    }, []);

    const onSubscribe = (e) => {
        const variables = {
            userTo: props.userTo,
            userFrom: props.userFrom
        }

        if(Subscribed) {
            Axios.post(`${SERVER_SUBSCRIBE}/removeSubscribe`, variables)
            .then(response => {
                if(response.data.removeSubscribeSuccess) { 
                    setSubscribeNumber(SubscribeNumber - 1);
                    setSubscribed(false);
                }
                else {
                    alert('구독 취소에 실패하였습니다.');
                }
            });

        }
        else {
            Axios.post(`${SERVER_SUBSCRIBE}/addSubscribe`, variables)
            .then(response => {
                if(response.data.addSubscribeSuccess) {
                    setSubscribeNumber(SubscribeNumber + 1);
                    setSubscribed(true);
                }
                else {
                    alert('구독에 실패하였습니다.');
                }
            });
        }
    }

    return (
        <div className="video-detail-main-uploader">
            <div className="video-detail-main-uploader-info">
                <Meta avatar={<Avatar src={props.video.uploader.profilePath} />} title={props.video.uploader.name} />
                <p>구독자 {SubscribeNumber}명</p>
            </div>
            <div className="video-detail-subscribe">
                <div onClick={onSubscribe} style={{ backgroundColor: `${Subscribed ? 'gray' : '#B21016'}` }}>{Subscribed ? '구독 중' : '구독' }</div>
            </div>
        </div>
        
    )
}

export default Subscribe;
