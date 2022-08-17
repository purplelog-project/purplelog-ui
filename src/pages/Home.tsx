import React, { useRef } from 'react'
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons'
import { Button, Tag, Space, Menu, Dropdown } from 'antd'
import type { ProColumns, ActionType } from '@ant-design/pro-components'

import { ProTable, TableDropdown, SettingDrawer } from '@ant-design/pro-components';
import axios from "axios";
import moment from "moment";

type GithubIssueItem = {
  url: string
  id: number
  number: number
  title: string
  labels: {
    name: string
    color: string
  }[]
  state: string
  comments: number
  created_at: string
  updated_at: string
  closed_at?: string
}

const columns: ProColumns<GithubIssueItem>[] = [
  {
    title: 'ID',
    dataIndex: '_id',
    search: false,
  },
  {
    disable: true,
    title: '级别',
    dataIndex: 'level',
    valueType: 'select',
    valueEnum: {
      error: {
        text: 'ERROR',
        color: 'red',
      },
      debug: {
        text: 'DEBUG',
        color: 'green',
      },
      info: {
        text: 'INFO',
        color: 'blue',
      },
      warn: {
        text: 'WARN',
        color: 'gold',
      },
      fatal: {
        text: 'FATAL',
        color: 'red',
      }
    },
  },
  {
    disable: true,
    title: '标签',
    dataIndex: 'tags',
    renderFormItem: (_, { defaultRender }) => {
      return defaultRender(_);
    },
    render: (_, record:any) => (
      <Space>
        {record.tags.map((item,index) => (
          <Tag key={index}>
            {item}
          </Tag>
        ))}
      </Space>
    ),
  },
  {
    disable: true,
    title: '内容',
    dataIndex: 'msg',
    ellipsis: true
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    valueType: 'dateTimeRange',
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1],
        };
      },
    },
    render(_:any,record:any){
      // console.log(_,record)
      return <span>{moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
    }
  },
]

const menu = (
  <Menu>
    <Menu.Item key="1">1st item</Menu.Item>
    <Menu.Item key="2">2nd item</Menu.Item>
    <Menu.Item key="3">3rd item</Menu.Item>
  </Menu>
)

export default () => {
  const actionRef = useRef<ActionType>()
  return (
    <ProTable<GithubIssueItem>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(sort, filter)
        return axios('/api/log', {
          params,
        }).then(res=>{
          // console.log(res.data,'res.data')
          return {
            data:res.data.data,
            success:true,
            total:res.data.total
          }
        })
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        onChange(value) {
          console.log('value: ', value)
        },
      }}
      rowKey="_id"
      search={{
        defaultCollapsed:false,
        labelWidth: 'auto',
        span:12
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            }
          }
          return values
        },
      }}
      pagination={{
        pageSize: 25,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="高级表格"
      toolBarRender={() => [
        <Button key="button" icon={<PlusOutlined />} type="primary">
          新建
        </Button>,
        <Dropdown key="menu" overlay={menu}>
          <Button>
            <EllipsisOutlined />
          </Button>
        </Dropdown>,
      ]}
    />
  )
}
