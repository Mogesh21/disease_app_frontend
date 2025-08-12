import React, { useEffect, useState } from 'react';
import { Form, Button, notification, Layout, Upload, Select, Input, Space, Popconfirm } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosConfig';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import Ckeditor from '../../../components/Ckeditor';
import { useWatch } from 'antd/es/form/Form';

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(true);
  const [form] = Form.useForm();
  const infoList = useWatch('info', form);
  const [fileList, setFileList] = useState(null);
  const { state } = location;

  useEffect(() => {
    if (state) {
      form.setFieldValue('cat_id', state.cat_id);
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
      }
      form.setFieldValue('image_file', state.image);
      form.setFieldValue('info', state.info);
    } else {
      navigate('/app/dashboard/diseases/diseases-list');
    }
  }, [form, navigate, state]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      setCategories(response.data.data);
    } catch (err) {
      console.log(err);
      notification.error({ message: 'Unable to fetch categories! Please reload the page' });
    }
  };

  useEffect(() => {
    setError(!(infoList && infoList.length > 0));
  }, [infoList]);

  const onFinish = async (values) => {
    if (error) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('cat_id', values.cat_id);
      formData.append('name', values.name);
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('image_file', fileList[0].originFileObj);
      }
      formData.append('image', state.image);
      formData.append('info', JSON.stringify(values.info));
      const response = await axiosInstance.put(`/diseases/${state.id}`, formData, {
        headers: {
          'Content-Type': 'application/form-data'
        }
      });

      if (response.status === 200) {
        notification.success({
          message: 'Disease updated successfully'
        });
        navigate('/app/dashboard/diseases/diseases-list');
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      console.error(err);
      notification.error({
        message: 'Error occurred',
        description: 'Unable to update disease. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
        return Upload.LIST_IGNORE;
      }
      setFileValid(true);
      return false;
    }
  };

  return (
    <Layout className="layout" style={{ backgroundColor: 'white', borderRadius: '10px' }}>
      <p style={{ fontSize: '1.3rem', fontWeight: '500', padding: '.5rem', textDecoration: 'underline' }}>Add Disease</p>
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} style={{ margin: '1rem' }} layout="horizontal" onFinish={onFinish}>
        <Form.Item label="Category" name="cat_id" rules={[{ required: true, message: 'Please select category' }]}>
          <Select>
            {categories.map((category) => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Disease Name" name="name" rules={[{ required: true, message: 'disease name is required' }]}>
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
        <Form.Item
          label="Disease Info"
          required
          validateStatus={error ? 'error' : ''}
          help={error && 'Add at least one disease info item.'}
        >
          <Form.List label="Disease info" name="info">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    direction="vertical"
                    style={{ display: 'flex', marginBottom: 8, padding: 10, border: '1px solid #ccc', borderRadius: 8 }}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'title']}
                      label="Title"
                      rules={[{ required: true, message: 'Please input the title!' }]}
                    >
                      <Input placeholder="Title" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'content']}
                      label="Content"
                      rules={[{ required: true, message: 'Please input the content!' }]}
                    >
                      <Ckeditor
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          const currentValues = form.getFieldValue('info') || [];
                          currentValues[name] = { ...currentValues[name], content: data };
                          form.setFieldsValue({ info: currentValues });
                        }}
                        data={form.getFieldValue(['info', name, 'content']) || ''}
                      />
                    </Form.Item>
                    <Popconfirm title="Are you sure to delete?" onConfirm={() => remove(name)}>
                      <Button danger icon={<MinusCircleOutlined />}>
                        Delete
                      </Button>
                    </Popconfirm>
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Disease Info
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading} style={{ backgroundColor: '#1DCCDE' }}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default Index;
