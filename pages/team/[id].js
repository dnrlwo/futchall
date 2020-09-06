/* eslint-disable no-undef */
import React, { useEffect, useRef, useCallback } from 'react';
import Router, { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { Skeleton, Col, Row, Tabs, Button, message, Descriptions, Typography, Table, Card, Space, Tag } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import AppLayout2 from '../../components/AppLayout2';
import Feed from '../../components/Feed';
import { SELECT_TEAM_REQUEST } from '../../reducers/team';
import { JOIN_IN_REQUEST } from '../../reducers/user';
import style from '../../SCSS/feedLayout.module.scss';
import { teamMemberColumns as memberColumns, teamRecordColumns as recordColumns } from '../../util/columns';

const Stadium = () => {
  const router = useRouter();
  const { id } = router.query;
  const { info, isSelected } = useSelector((state) => state.team, (left, right) => { if (left.info.id === right.info.id) { return true; } return false; });
  const { me, isLoggedIn, isJoinnigIn } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const lastScrollTop = useRef(0);
  const updownDirection = useRef(false);

  useEffect(() => { dispatch({ type: SELECT_TEAM_REQUEST, data: { id } }); }, []);
  const joinInTeam = useCallback(() => {
    dispatch({
      type: JOIN_IN_REQUEST,
      data: {
        id,
      },
    });
  }, []);

  useEffect(() => {
    if (isSelected && info.Stadia.length !== 0) {
      const points = info.Stadia.map((obj) => new kakao.maps.LatLng(obj.lat, obj.lng));
      const options = {
        center: new kakao.maps.LatLng(38, 127.30),
        level: 5,
      };
      const map = new kakao.maps.Map(document.getElementById('stadiumAddress'), options);
      map.setDraggable(false);
      map.setZoomable(false);
      const bounds = new kakao.maps.LatLngBounds();
      for (let i = 0; i < points.length; i++) {
        // need index for getting req, so don't use forEach etc.
        const marker = new kakao.maps.Marker({ position: points[i], clickable: true });
        marker.setMap(map);
        kakao.maps.event.addListener(marker, 'click', () => {
          Router.push(`/stadium/${info.Stadia[i].id}`);
        });
        bounds.extend(points[i]);
      }
      map.relayout();
      map.setBounds(bounds);
    }
  }, [isSelected]);

  useEffect(() => {
    function onScroll() {
      const st = window.pageYOffset;
      const targetDiv = document.getElementById('facebookFlow');
      const fakeDiv = document.getElementById('facebookFake');
      const upDivHeight = document.getElementById('upDiv').offsetHeight + 66;
      const vh = window.innerHeight;
      if (st <= upDivHeight) {
        fakeDiv.style.cssText = 'height: 0px';
        updownDirection.current = false;
      }

      if (st > lastScrollTop.current) {
        // down
        targetDiv.style.cssText = `top: ${vh - targetDiv.offsetHeight - 10}px`;
        if (updownDirection.current && st > upDivHeight) {
          fakeDiv.style.cssText = `height: ${st - targetDiv.offsetHeight}px`;
          updownDirection.current = false;
        }
      } else if (st < lastScrollTop.current) {
        // up
        targetDiv.style.cssText = `bottom: ${vh - targetDiv.offsetHeight - 70}px`;
        if (!updownDirection.current) {
          fakeDiv.style.cssText = `height: ${st}px`;
          updownDirection.current = true;
        }
      }
      lastScrollTop.current = st <= 0 ? 0 : st;
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <AppLayout2>
      <Row>
        <Col className={style.mainInfo} id="upDiv">
          <Card
            cover={(
              <div
                className={style.ImgContainer}
              >
                <img
                alt="Main image of Team"
                src={isSelected && `http://localhost:3065/${info.Images[0]?.src}`}
                style={{ maxHeight: '100%', width: 'auto', margin: '0 auto' }}
                />
              </div>
            )}
            className={style.cardDiv}
          >
            <Card.Meta
              title={(
                <Typography.Title level={3} copyable={isSelected && { text: window.location.pathname }}>
                  <Skeleton loading={!isSelected} active paragraph={false} />
                  {isSelected && info.title}
                </Typography.Title>
                )}
              description={isSelected && info.description}
              className={style.stickyTitle}
            />
          </Card>
        </Col>
      </Row>
      <Row className={style.flowInfo}>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 10 }}>
          <div id="facebookFake" />
          <div className={style.fixedInfo} id="facebookFlow">
            <Tabs
              tabBarExtraContent={
                isSelected && isLoggedIn && (info.id === me?.LeaderId)
                && <Button onClick={() => { message.warn('준비중입니다.'); }} shape="round"><QuestionCircleOutlined />팀 관리</Button>
              }
            >
              <Tabs.TabPane tab="상세정보" key="1">
                <Descriptions
                  column={{ xxl: 4, xl: 2, lg: 2, md: 2, sm: 2, xs: 2 }}
                  bordered
                  title={isSelected && info.title}
                  size="middle"
                >
                  <Descriptions.Item label="활동 지역" span={2}>
                    <Skeleton loading={!isSelected} active paragraph={false} />
                    {isSelected && info.location}
                  </Descriptions.Item>
                  <Descriptions.Item label="모임 시간" span={2}>
                    <Skeleton loading={!isSelected} active paragraph={false} />
                    {isSelected && info.time}
                  </Descriptions.Item>
                  <Descriptions.Item label="모집 여부" span={2}>
                    <Skeleton loading={!isSelected} active paragraph={false} />
                    <Space size="middle">
                      {isSelected && info.recruit}
                      {isSelected && isLoggedIn && info.recruit === 'Y' && !me?.TeamId && !me?.JoinInId && <Button type="primary" shape="round" onClick={joinInTeam} size="small" loading={isJoinnigIn}>팀 가입 하기</Button>}
                      {isSelected && isLoggedIn && me?.JoinInId === info.id && <Tag>가입 대기중</Tag> }
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
                {
                  isSelected && info.Stadia.length !== 0 && (
                    <div className={style.mapContainer}>
                      <div id="stadiumAddress" className={style.occupyMap} />
                    </div>
                  )
                }
              </Tabs.TabPane>
              <Tabs.TabPane tab="선수 명단" key="2">
                <Skeleton active loading={!isSelected} />
                {isSelected
                                  && (
                                  <Table
                                    showHeader
                                    tableLayout="fixed"
                                    columns={memberColumns}
                                    pagination={{ pageSize: 15 }}
                                    scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, y: 550 }}
                                    dataSource={info.Users}
                                    rowKey={(member) => member.id}
                                  />
                                  )}
              </Tabs.TabPane>
              <Tabs.TabPane tab="전적" key="3">
                <Skeleton active loading={!isSelected} />
                {isSelected
                                  && (
                                  <Table
                                    showHeader
                                    columns={recordColumns}
                                    dataSource={info.record}
                                  />
                                  )}
              </Tabs.TabPane>
              <Tabs.TabPane tab="사진" key="4">
                <Skeleton active />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 13, offset: 1 }} className={style.postWall}>
          <Feed where="team" req={id} />
        </Col>
      </Row>
    </AppLayout2>
  );
};
export default Stadium;
