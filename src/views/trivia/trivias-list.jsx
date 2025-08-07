import React, { useEffect, useState } from 'react';
import { Table, Button, Space, notification, Input, Popconfirm, Upload, Modal, Radio } from 'antd';
import axiosInstance from 'config/axiosConfig';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import readXlsxFile from 'read-excel-file';

const Trivias = () => {
  const [trivias, setTrivias] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [tableLoading, setTableLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newData, setNewData] = useState([]);
  const [updatedData, setUpdatedData] = useState(null);
  const [addMode, setAddMode] = useState(1);
  const [error, setError] = useState(null);

  const fetchTrivias = async () => {
    try {
      const response = await axiosInstance.get('/trivia');
      console.log(response.data.data);
      setTrivias(response.data.data);
    } catch (err) {
      notification.error({ message: 'Unable to get Trivias', duration: 2 });
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchTrivias();
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredData(
        trivias.filter((trivia) => trivia.content.toLowerCase().includes(search.toLowerCase()) || trivia.id === parseInt(search))
      );
    } else {
      setFilteredData(trivias);
    }
  }, [trivias, search]);

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
      title: 'Trivia',
      dataIndex: 'content',
      key: 'content'
    },
    {
      title: 'Options',
      key: 'options',
      width: 230,
      render: (text, record) => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              onClick={() => handleEdit(trivias.find((trivia) => trivia.id === record.id))}
              style={{ backgroundColor: '#1DCCDE' }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete the trivia"
              description="Are you sure to delete this trivia?"
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              placement="bottomLeft"
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
    setUpdatedData(record);
  };

  const handleDelete = async (record) => {
    try {
      const response = await axiosInstance.delete(`/trivias/${record.id}`);
      if (response.status === 200) {
        notification.success({ message: 'Success', description: 'trivia deleted sucessfully' });
        fetchTrivias();
      } else {
        throw response.data.message;
      }
    } catch (err) {
      console.log(err);
      notification.error({ message: 'Server Error', description: 'Unable to delete! Please try again...' });
    }
  };

  const handleFileChange = async (file) => {
    const fileData = file.file;
    if (fileData instanceof File) {
      const data = await readXlsxFile(fileData);
      const header = data[0];
      if (!header[0] || header[0] !== 'trivia') {
        setError('First column must be trivia');
      } else {
        setError(null);
        const trivias = data.map((record) => record[0]).slice(1);
        setNewData(trivias);
      }
    } else {
      setError(null);
      setNewData(null);
    }
  };

  const props = {
    accept: '.xlsx, .xls',
    maxCount: 1,
    onChange: handleFileChange,
    onRemove: () => {
      setNewData(null);
    },
    beforeUpload: () => {
      return false;
    }
  };

  const handleAddTrivia = async () => {
    try {
      if (!newData) {
        notification.error({ message: 'Please add trivia' });
        return;
      }
      const response = await axiosInstance.post('/trivia', { content: newData });
      if (response.status === 201) {
        notification.success({ message: 'Trivia added successsfully' });
        setAddModalOpen(false);
        setNewData(null);
        fetchTrivias();
      } else {
        notification.error({ message: 'Unable to add trivia' });
      }
    } catch (err) {
      console.log(err);
      notification.error({ message: 'Unknown error occured' });
    }
  };

  const handleUpdateTrivia = async () => {
    try {
      const response = await axiosInstance.put(`/trivia/${updatedData.id}`, updatedData);
      if (response.status === 200) {
        notification.success({ message: 'Trivia updated successfully' });
        setUpdatedData(null);
        fetchTrivias();
      } else {
        notification.error({ message: 'Unable to update trivia' });
      }
    } catch (err) {
      console.log(err);
      notification.error({ message: 'Unknown error occured' });
    }
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <Input placeholder="Search here" value={search} className="search-bar" onChange={(e) => setSearch(e.target.value)} />
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <Button type="primary" style={{ backgroundColor: 'green' }} onClick={() => setAddModalOpen(true)}>
            <PlusOutlined /> Add
          </Button>
        </div>
      </div>
      <div className="container">
        <Table style={{ width: '100%', overflow: 'auto' }} columns={columns} loading={tableLoading} dataSource={filteredData} rowKey="id" />
      </div>

      {/* Update Modal */}
      <Modal
        open={updatedData ? true : false}
        onCancel={() => setUpdatedData(null)}
        onClose={() => setUpdatedData(null)}
        onOk={handleUpdateTrivia}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bolder', marginBottom: '1rem' }}>Update Trivia</p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ display: 'flex', width: '5rem', fontWeight: 'bold', justifyContent: 'space-between' }}>
              <span>ID</span> <span>:</span>
            </span>
            <Input value={updatedData?.id} disabled></Input>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ display: 'flex', width: '5rem', fontWeight: 'bold', justifyContent: 'space-between' }}>
              <span>Content</span> <span>:</span>
            </span>
            <Input.TextArea
              rows={4}
              value={updatedData?.content}
              onChange={(e) =>
                setUpdatedData((prev) => ({
                  ...prev,
                  content: e.target.value
                }))
              }
            ></Input.TextArea>
          </div>
        </div>
      </Modal>

      {/* Add Modal */}
      <Modal
        open={addModalOpen}
        onCancel={() => {
          setAddModalOpen(false);
          setNewData(null);
        }}
        onClose={() => {
          setAddModalOpen(false);
          setNewData(null);
        }}
        onOk={handleAddTrivia}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bolder', marginBottom: '.5rem' }}>Add Trivia</p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ display: 'flex', width: '5rem', fontWeight: 'bold', justifyContent: 'space-between' }}>
              <span>Mode</span> <span>:</span>
            </span>
            <Radio.Group
              value={addMode}
              onChange={(e) => setAddMode(e.target.value)}
              options={[
                { value: 1, label: 'Single' },
                { value: 2, label: 'Multiple' }
              ]}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ display: 'flex', width: '5rem', fontWeight: 'bold', justifyContent: 'space-between' }}>
              <span>Content</span> <span>:</span>
            </span>
            {addMode === 1 ? (
              <Input.TextArea rows={4} value={newData ? newData[0] : ''} onChange={(e) => setNewData([e.target.value])}></Input.TextArea>
            ) : (
              <div>
                <Upload {...props}>
                  <Button type="primary" style={{ backgroundColor: 'rebeccapurple' }}>
                    <UploadOutlined /> Upload
                  </Button>
                </Upload>
                {
                  <span style={{ fontSize: '.8rem', color: 'red' }}>
                    {newData ? (error ? error : `${newData.length} Trivias found`) : 'Note: Excel must have one column named trivia'}
                  </span>
                }
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Trivias;
