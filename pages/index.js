import React, { useCallback } from 'react';
import Router from 'next/router';
import { Button, Col, Row, Input, Statistic, Divider, notification, message } from 'antd';
import { SearchOutlined, InfoCircleOutlined, LikeOutlined, ArrowUpOutlined, TrophyTwoTone } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { SET_WHERE_USER } from '../reducers/location';
import { getLocation } from '../util/getLocation';

const Home = () => {
  const {isChangingLocation} = useSelector(state=>state.location);
  const dispatch = useDispatch();
  
  const onSearch = useCallback((e) => {
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(e, function(result, status) {
      if (status === kakao.maps.services.Status.OK) {
        dispatch({
          type: SET_WHERE_USER,
          data: { latitude: result[0].y, longitude: result[0].x },
        });
        message.success(`\'${e}\'지역으로 검색한 결과입니다!`, 5);
        Router.push(`/stadia`);
      }
    });
  },[]);

  const onClickGPS = useCallback(() => {
    (async () => {
      try {
        const arr = await getLocation();
        if (arr[0] === "success") {
          dispatch({
            type: SET_WHERE_USER,
            data: { latitude: arr[2], longitude: arr[3] },
          });
        }
        Router.push(`/stadia?arr=${arr.slice(0, 2)}`, '/stadia');
      } catch (error) {
        console.log(error);
        message.warn(error);
        Router.push('/stadia');
      }
    })();
  },[])
  const onClickNoGPS = useCallback(() => {
    notification.open({ message: "현재위치로 탐색하시려면?", description: `이전에 위치정보 제공을 동의하시지 않은 경우, 주소창 앞 자물쇠 버튼을 클릭하여 수정하여 주세요. 그렇지 않은 경우 메인페이지에서 파란색 "현재위치정보 이용하여 둘러보기"를 클릭하여 주세요.(Internet Explorer에서는 사용하실 수 없습니다.)`, duration: 0 })
    Router.push('/stadia');
  },[])
  return (
    <Row style={{ minHeight: '100vh', textAlign: 'center' }} align={"middle"}>
      <Col md={{ span: 16, offset: 4 }} sm={{span: 18, offset: 3}} xs={{ span: 20, offset: 2 }}>
          <img src="/index.png" alt="futchall icon"/>
      </Col>
      <Col md={{ span: 16, offset: 4 }} sm={{span: 18, offset: 3}} xs={{ span: 20, offset: 2 }}>
        <Row gutter={[0,20]}>
          <Divider orientation="left"><TrophyTwoTone twoToneColor="#fbd71f" /> 어제의 기록</Divider>
          <Col md={{ span: 6, offset: 2 }} xs={{ span: 18, offset: 3 }} >
            <Statistic title="최다 구장 점령 수" value={7} prefix={<LikeOutlined />}></Statistic>
          </Col>
          <Col md={{ span: 6, offset: 1 }} xs={{ span: 18, offset: 3 }}>
            <Statistic title="새로등록된 구장 수" value={7} valueStyle={{ color: "#40a9ff" }} prefix={<ArrowUpOutlined />} suffix="개"></Statistic>
          </Col>
          <Col md={{ span: 6, offset: 1 }} xs={{ span: 18, offset: 3 }}>
            <Statistic title="구장깨기 성공 비율" value={30.45} precision={2} valueStyle={{ color: '#3f8600' }} prefix={<ArrowUpOutlined />} suffix="%"></Statistic>
          </Col>
        </Row>
      </Col>
      <Col md={{ span: 12, offset: 6 }} sm={{span: 14, offset: 5}} xs={{ span: 20, offset: 2 }}>
        <Input.Search size="large" placeholder="활동지역을 검색해보세요" onSearch={onSearch} enterButton />
      </Col>
      <Col md={{ span: 16, offset: 4 }} sm={{span: 18, offset: 3}} xs={{ span: 20, offset: 2 }}>
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
  );
};

export default Home;