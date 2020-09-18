import React, { useCallback, useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import PropTypes from 'prop-types';

import { Drawer, Space, Table, Tabs } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);
const managementMatch = [
  {
    title: '신청팀',
    align: 'center',
    dataIndex: 'AwayId',
  },
  {
    title: '경기일자',
    align: 'center',
    dataIndex: 'date',
  },
  {
    title: '경기장소',
    align: 'center',
    dataIndex: 'StadiumId',
  },
  {
    title: '처리',
    align: 'center',
    dataIndex: 'id',
    render: (val) => (
      <Space>
        <a>승인</a>
        <a>거절</a>
      </Space>
    ),
  },
];
const joinInTeam = [
  {
    title: '닉네임',
    align: 'center',
    dataIndex: 'nickname',
  },
  {
    title: '포지션',
    align: 'center',
    dataIndex: 'positions',
  },
  {
    title: '지역',
    align: 'center',
    dataIndex: 'locations',
  },
  {
    title: '나이',
    align: 'center',
    dataIndex: 'age',
  },
  {
    title: '처리',
    align: 'center',
    dataIndex: 'id',
    render: (val) => (
      <Space>
        <a>승인</a>
        <a>거절</a>
      </Space>
    ),
  },
];
const TeamManagement = ({ setVisible, teamId, visible }) => {
  const [tabkey, setTabKey] = useState('1');
  const { data, error } = useSWR(`http://localhost:3065/team/${teamId}/management/${tabkey}`, fetcher);
  
  const onClose = useCallback(() => {
    setVisible(false);
  }, []);
  console.log(data);
  return (
    <Drawer
      title="팀 관리"
      placement="left"
      visible={visible}
      onClose={onClose}
      width="70%"
    >
      <Tabs
        defaultActiveKey={tabkey}
        type="card"
        onChange={(key) => { setTabKey(key); }}
      >
        <Tabs.TabPane key="1" tab="경기관리">
          {
            !data && !error && <LoadingOutlined />
          }
          {/* <Table columns={managementMatch} dataSource={data} /> */}
        </Tabs.TabPane>
        <Tabs.TabPane key="2" tab="입단신청">
          {
            !data && !error && <LoadingOutlined />
          }
          <Table columns={joinInTeam} dataSource={data} />
        </Tabs.TabPane>
        <Tabs.TabPane key="3" tab="정보 수정">
          {
            !data && !error && <LoadingOutlined />
          }
        </Tabs.TabPane>
      </Tabs>
    </Drawer>
  );
};

TeamManagement.propTypes = {
  setVisible: PropTypes.func.isRequired,
  teamId: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default TeamManagement;