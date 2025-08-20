import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification, Layout, Upload } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosConfig';
import { UploadOutlined } from '@ant-design/icons';

const EditCategory = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const { state } = location;

  useEffect(() => {
    if (state) {
      form.setFieldValue('name', state.name);
      if (state.image) {
        setFileList([
          {
            uid: '-1',
            name: 'Cover Image',
            status: 'done',
            url: state.image,
            thumbUrl: state.image
          }
        ]);
        form.setFieldValue('image_file', state.image);
      }
    } else {
      navigate('/app/dashboard/categories/categories-list');
    }
  }, [form, navigate, state]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('image_file', fileList[0].originFileObj);
      }
      formData.append('image', state.image);
      const response = await axiosInstance.put(`/categories/${state.id}`, formData, {
        headers: {
          'Content-Type': 'application/form-data'
        }
      });
      if (response.status === 200) {
        notification.success({
          message: 'Category updated successfully'
        });
        navigate('/app/dashboard/categories/categories-list');
      } else {
        throw new Error('Unable to update');
      }
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 413) {
        notification.error({ message: 'File size must be less than 200KB' });
      } else {
        notification.error({
          message: 'Error Occured....',
          description: 'Unable to update! Please try again...'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const props = {
    listType: 'picture',
    accept: '.jpg,.jpeg,.png',
    maxCount: 1,
    fileList: fileList,
    onChange: handleChange,
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
      <p style={{ fontSize: '1.3rem', fontWeight: '500', padding: '.5rem', textDecoration: 'underline' }}>Edit Category</p>
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
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          rules={[{ required: true, message: 'Please upload the image!' }]}
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

export default EditCategory;
