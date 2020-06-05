import React from 'react';
import Router from 'next/router';
import { Button, Col, Row, Input, Statistic, Divider, notification } from 'antd';
import { SearchOutlined, InfoCircleOutlined, LikeOutlined, ArrowUpOutlined, TrophyTwoTone } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { REFRESH_STADIUMLIST_REQUEST } from '../reducers/location';
import { getLocation } from '../util/getLocation';

const Home = () => {
    const {isChangingLocation} = useSelector(state=>state.location);
    const dispatch = useDispatch();
    const onSearch = (e) => {
        console.log(e);
    }
    const onClickGPS = () => {
        (async () => {
            try {
                const arr = await getLocation();
                if (arr[0] === "success") {
                    dispatch({
                        type:REFRESH_STADIUMLIST_REQUEST, 
                        data:{latitude: arr[2], longitude: arr[3],} 
                    });
                }
                //클라이언트사이드 렌더링
                Router.push(`/stadia?arr=${arr}`, '/stadia');
            } catch (error) {
                console.log(error);
            }
        })();
    }
    const onClickNoGPS = () => {
        notification.open({ message: "현재위치로 탐색하시려면?", description: `이전에 위치정보 제공을 동의하시지 않은 경우, 주소창 앞 자물쇠 버튼을 클릭하여 수정하여 주세요. 그렇지 않은 경우 메인페이지에서 파란색 "현재위치정보 이용하여 둘러보기"를 클릭하여 주세요.(Internet Explorer에서는 사용하실 수 없습니다.)`, duration: 0 })
        Router.push('/stadia');
    }
    return (
        <div style={{ height: '80vh' }}>
            <Row align="middle" style={{ height: '100%', height: '100%', textAlign: 'center' }}>
                <Col md={{ span: 14, offset: 5 }} xs={{ span: 18, offset: 3 }}>
                    <Row>
                        <Divider orientation="left"><TrophyTwoTone twoToneColor="#fbd71f" style={{ marginRight: "5px" }} />어제의 기록</Divider>
                        <Col md={{ span: 6, offset: 3 }} xs={{ span: 18, offset: 3 }} >
                            <Statistic title="최다 구장 점령 수" value={7} prefix={<LikeOutlined />}></Statistic>
                        </Col>
                        <Col md={{ span: 6, offset: 0 }} xs={{ span: 18, offset: 3 }}>
                            <Statistic title="새로등록된 구장 수" value={7} valueStyle={{ color: "#40a9ff" }} prefix={<ArrowUpOutlined />} suffix="개"></Statistic>
                        </Col>
                        <Col md={{ span: 6, offset: 0 }} xs={{ span: 18, offset: 3 }}>
                            <Statistic title="구장깨기 성공 비율" value={30.45} precision={2} valueStyle={{ color: '#3f8600' }} prefix={<ArrowUpOutlined />} suffix="%"></Statistic>
                        </Col>
                    </Row>
                </Col>
                <Col md={{ span: 14, offset: 5 }} xs={{ span: 18, offset: 3 }}>
                    <Input.Search size="large" placeholder="활동지역을 검색하세요" onSearch={onSearch} enterButton />
                </Col>
                <Col span={24}>
                    <Row gutter={[10, 10]}>
                        <Col span={24} >
                            <Button type="primary" icon={<SearchOutlined />} size="large" shape="round" onClick={onClickGPS} loading={isChangingLocation}>현재위치정보 이용하여 둘러보기</Button>
                        </Col>
                        <Col span={24}>
                            <Button size="large" icon={<InfoCircleOutlined />} shape="round" onClick={onClickNoGPS}>지도로 구장 찾아보기</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default Home;