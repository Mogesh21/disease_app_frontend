import React, { useEffect, useState } from 'react';
import { Table, Button, notification, Input, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosConfig';
import { DeleteOutlined, EditOutlined, FileImageOutlined, VideoCameraOutlined } from '@ant-design/icons';

const Index = () => {
  const navigate = useNavigate();
  const [diseases, setDiseases] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [tableLoading, setTableLoading] = useState(true);

  const fetchDiseases = async () => {
    try {
      const response = await axiosInstance.get('/diseases');
      setDiseases(response.data.data);
    } catch (err) {
      notification.error({ message: 'Unable to get Authors', duration: 2 });
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredData(diseases.filter((disease) => disease.id === parseInt(search) || disease.name.includes(search.toLowerCase())));
    } else {
      setFilteredData(diseases);
    }
  }, [diseases, search]);

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => {
        return a.id - b.id;
      }
    },
    {
      title: 'Category Id',
      dataIndex: 'cat_id',
      key: 'cat_id',
      sorter: (a, b) => {
        return a.cat_id - b.cat_id;
      }
    },
    {
      title: 'Disease Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Image',
      dataIndex: 'image',
      // width: 150,
      render: (_, record) => {
        return <img alt="cover_image" width={120} src={record.image} />;
      }
    },
    {
      title: 'Options',
      render: (text, record) => {
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '.5rem' }}>
            {/* <Space size="middle"> */}
            <Button
              type="primary"
              onClick={() => handleEdit(diseases.find((disease) => disease.id === record.id))}
              style={{ backgroundColor: '#1DCCDE' }}
            >
              <EditOutlined /> Edit
            </Button>
            <Popconfirm
              onCancel={() => {}}
              onConfirm={() => {
                handleDelete(record);
              }}
              title="Delete This disease"
              description="This is an irreversible process"
              placement="left"
            >
              <Button style={{ width: '100%' }} danger>
                <DeleteOutlined /> Delete
              </Button>
            </Popconfirm>
            {/* </Space>
            <Space size="middle"> */}
            <Button
              type="primary"
              onClick={() => navigate('/app/dashboard/diseases/image-gallery', { state: { id: record.id, name: record.name } })}
              style={{ backgroundColor: '#f1d198' }}
            >
              <FileImageOutlined /> Images
            </Button>
            <Button
              type="primary"
              onClick={() => navigate('/app/dashboard/diseases/video-gallery', { state: { id: record.id, name: record.name } })}
              style={{ backgroundColor: '#55bbaa' }}
            >
              <VideoCameraOutlined /> Videos
            </Button>
            {/* </Space> */}
          </div>
        );
      }
    }
  ];

  const handleEdit = (record) => {
    navigate('/app/dashboard/diseases/edit-disease', { state: record });
  };

  const handleDelete = async (record) => {
    try {
      const response = await axiosInstance.delete(`/diseases/${record.id}`);
      if (response.status === 200) {
        notification.success({ message: 'Disease deleted successfully' });
        fetchDiseases();
      } else {
        notification.error({ message: 'Unable to delete. Please try again' });
      }
    } catch (err) {
      console.log(err);
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

export default Index;
