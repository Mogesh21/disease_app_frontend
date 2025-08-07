import React, { useEffect, useState } from 'react';
import { Table, notification, Input, Button, Popconfirm } from 'antd';
import axiosInstance from 'config/axiosConfig';

const AuthorsList = () => {
  const [reports, setReports] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [tableLoading, setTableLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const response = await axiosInstance.get('/reports');
      const data = response.data?.data || [];
      const sortedData = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setReports(sortedData);
      setFilteredData(sortedData);
    } catch (err) {
      notification.error({ message: 'Unable to get Reports', duration: 2 });
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    setTableLoading(false);
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredData(
        reports.filter(
          (report) =>
            report.device_id.toLowerCase() === search.toLowerCase() ||
            report.reason_name.toLowerCase().includes(search.toLowerCase()) ||
            report.id === parseInt(search)
        )
      );
    } else {
      setFilteredData(reports);
    }
  }, [search]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id
    },
    {
      title: 'Content ID',
      dataIndex: 'content_id',
      key: 'content_id',
      sorter: (a, b) => a.id - b.id
    },
    {
      title: 'Type Name',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Reason',
      dataIndex: 'reason_name',
      key: 'reason_name'
    },
    {
      title: 'Device Id',
      dataIndex: 'device_id',
      key: 'device_id'
    },
    {
      title: 'User Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (data) => <p>{data?.reason || '-'}</p>
    },
    {
      title: 'Options',
      render: (data) => (
        <Popconfirm
          onCancel={false}
          onConfirm={() => handleDelete(data.id)}
          title="Delete Report"
          description="This is an irreversible process"
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      )
    }
  ];

  const handleDelete = async (id) => {
    try {
      console.log(id);
      const response = await axiosInstance.delete(`/reports/${id}`);
      if (response.status === 200) {
        notification.success({ message: 'Report deleted successfully' });
        fetchReports();
      } else {
        notification.error({ message: 'Report not found' });
      }
    } catch (err) {
      notification.error({ message: 'Unknown error occured' });
    }
  };

  return (
    <div className="page">
      <div className="search-container">
        <Input placeholder="Search here" value={search} className="search-bar" onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="container">
        <Table style={{ width: '100%', overflow: 'auto' }} columns={columns} loading={tableLoading} dataSource={filteredData} rowKey="id" />
      </div>
    </div>
  );
};

export default AuthorsList;
