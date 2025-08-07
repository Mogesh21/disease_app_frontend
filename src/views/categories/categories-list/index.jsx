import React, { useEffect, useState } from 'react';
import { Table, Button, Space, notification, Input, Image, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosConfig';

const CategoriesList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [tableLoading, setTableLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      setCategories(response.data.data);
    } catch (err) {
      notification.error({ message: 'Unable to get Categories', duration: 2 });
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredData(
        categories.filter((category) => category.name.toLowerCase().includes(search.toLowerCase()) || category.id === parseInt(search))
      );
    } else {
      setFilteredData(categories);
    }
  }, [categories, search]);

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
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Image',
      dataIndex: 'image',
      // width: 150,
      render: (_, record) => {
        return <Image width={120} src={record.image} />;
      }
    },
    {
      title: 'Status',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            type="primary"
            onClick={() => handleUpdate(record)}
            style={{ backgroundColor: record.status === 1 ? '#08d007' : '#dd0621', justifySelf: 'center' }}
          >
            {record.status === 1 ? 'Active' : 'Inactive'}{' '}
          </Button>
        </div>
      )
    },
    {
      title: 'Options',
      key: 'options',
      render: (text, record) => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              onClick={() => handleEdit(categories.find((category) => category.id === record.id))}
              style={{ backgroundColor: '#1DCCDE' }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete the category"
              description="Are you sure to delete this category?"
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  const handleEdit = (record) => {
    navigate('/app/dashboard/categories/edit-category', { state: record });
  };

  const handleUpdate = async (values) => {
    values.status = values.status === 1 ? 0 : 1;
    try {
      const response = await axiosInstance.put(`/categories/${values.id}`, values);

      if (response.status === 200) {
        fetchCategories();
        notification.success({
          message: 'Status changed successfully'
        });
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      console.error(err);
      notification.error({
        message: 'Error occurred',
        description: 'Unable to update status. Please try again.'
      });
    }
  };

  const handleDelete = async (record) => {
    try {
      const response = await axiosInstance.delete(`/categories/${record.id}`);
      if (response.status === 200) {
        notification.success({ message: 'Success', description: 'category deleted sucessfully' });
        fetchCategories();
      } else {
        throw response.data.message;
      }
    } catch (err) {
      console.log(err);
      notification.error({ message: 'Server Error', description: 'Unable to delete! Please try again...' });
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

export default CategoriesList;
