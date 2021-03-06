import React, { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import Auth from '../../../hoc/auth';
import { SERVER_USER, SERVER_VIDEO, SERVER_SUBSCRIBE } from '../../Config';

import VideoList from '../Landing/Sections/VideoList';

import '../../css/MyPage.css';


function MyPage() {
    const [User, setUser] = useState(null);
    const [Videos, setVideos] = useState([]);
    const [ViewNumber, setViewNumber] = useState(0);
    const [SubscribeNumber, setSubscribeNumber] = useState(0);
    const [ProfilePath, setProfilePath] = useState('');

    let variables = { };

    useEffect(() => {
        variables = {
            userTo: localStorage.getItem('userId')
        }

        Axios.post(`${SERVER_USER}/getUser`, variables)
        .then(response => {
            if(response.data.getUserSuccess) {
                setUser(response.data.user);
            }
            else {
                alert('사용자 정보를 가져오는데 실패하였습니다.');
            }
        });

        Axios.post(`${SERVER_SUBSCRIBE}/getSubscribes`, variables)
        .then(response => {
            if (response.data.getSubscribesSuccess) {
                setSubscribeNumber(response.data.subscribes.length);
            }
            else {
                alert('구독자 현황을 가져오는데 실패하였습니다.');
            }
        });

        Axios.post(`${SERVER_VIDEO}/getMyVideos`, variables)
        .then(response => {
            if(response.data.getMyVideosSuccess) {
                setVideos(response.data.videos);

                let number = 0;

                response.data.videos.map((video) => {
                    number += video.views;
                });
                
                setViewNumber(number);
            }
            else {
                alert('영상 목록을 가져오는데 실패하였습니다.');
            }
        });
    }, []);

    const onDropImage = (files) => {
        let formData = new FormData;
        const config = { header: { 'content-type': 'multipart/form-data' } }

        formData.append('file', files[0]);

        Axios.post(`${SERVER_USER}/dropImage`, formData, config)
        .then(response => {
            if(response.data.dropImageSuccess) {
                setProfilePath(response.data.profilePath);

                variables = {
                    userTo: localStorage.getItem('userId'),
                    profilePath: response.data.profilePath
                }

                Axios.post(`${SERVER_USER}/changeProfile`, variables)
                .then(response => {
                    if(response.data.changeProfileSuccess) {
                        window.location.reload();
                    }
                    else {
                        alert('프로필 이미지 변경에 실패하였습니다.');
                    }
                });
            }
            else {
                alert('파일 첨부에 실패하였습니다.');
            }
        });
    }

    return (
        <>
            <div className="content">
                <div className="my">
                    <div className="my-profile">
                        <h2>Profile</h2>
                        {User &&
                            <div className="my-profile-dropzone">
                                <Dropzone onDrop={onDropImage} multiple={false} maxSize={1000000000} accept="image/*">
                                    {({ getRootProps, getInputProps }) => (
                                        <div className="my-profile-dropzone-image" {...getRootProps()}>
                                            <Input {...getInputProps()} />
                                            {User.profilePath !== '' && <img src={`http://localhost:5000/${User.profilePath}`} alt="thumbnail" />}
                                            <div className="my-profile-dropzone-image-edit" >
                                                <EditOutlined style={{ fontSize: '2rem', color: 'gray' }} />
                                            </div>
                                        </div>
                                    )}
                                </Dropzone>
                                <div className="my-profile-dropzone-info">
                                        <p>{User.name}</p>
                                        <p>{User.email}</p>
                                        <p>구독자 {SubscribeNumber}명</p>
                                        <p>영상 총 조회수 {ViewNumber}회</p>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="my-videos">
                        <h2>My Videos</h2>      
                        <VideoList videos={Videos} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Auth(MyPage, true);