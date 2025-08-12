import React, { useState } from 'react';
import { Form, Input, Button, notification, Layout, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosConfig';
import { UploadOutlined } from '@ant-design/icons';
import { imageValidator } from 'utilities/fileValidator';

const AddCategory = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      if (values.image_file) formData.append('image_file', values.image_file.file);

      const response = await axiosInstance.post('/categories', formData, {
        headers: {
          'Content-Type': 'application/form-data'
        }
      });
      if (response.status === 201) {
        notification.success({
          message: 'Cateory created successfully'
        });
        navigate('/app/dashboard/categories/categories-list');
      } else {
        throw new Error('Unable to create');
      }
    } catch (err) {
      console.log(err);
      notification.error({
        message: 'Error Occured....',
        description: 'Unable to create! Please try again...'
      });
    } finally {
      setLoading(false);
    }
  };

  const props = {
    listType: 'picture',
    accept: '.jpg,.jpeg,.png',
    maxCount: 1,
    beforeUpload: (file) => {
      const isValidType = ['image/jpg', 'image/jpeg', 'image/png'].includes(file.type);
      if (!isValidType) {
        setTimeout(() => {
          form.setFieldsValue({ image_file: [] });
          form.validateFields(['image_file']);
        }, 0);
        setFileValid(false);
        return false;
      }
      setFileValid(true);
      return Upload.LIST_IGNORE;
    }
  };

  return (
    <Layout className="layout" style={{ backgroundColor: 'white', borderRadius: '10px' }}>
      <p style={{ fontSize: '1.3rem', fontWeight: '500', padding: '.5rem', textDecoration: 'underline' }}>Add New Category</p>
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} style={{ margin: '1rem' }} layout="horizontal" onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: 'Please enter the name!' },
            { max: 30, message: 'Name cannot be longer than 30 characters!' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Cover Image"
          name="image_file"
          rules={[{ required: true, message: 'Please upload the image!' }, { validator: imageValidator }]}
        >
          <Upload {...props}>
            <Button className="uploadButton">
              <UploadOutlined /> Upload
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit" style={{ backgroundColor: '#1DCCDE' }} loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default AddCategory;
