import { Button, Checkbox, Image, notification, Popconfirm } from 'antd';
import axiosInstance from 'config/axiosConfig';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CloseOutlined, DeleteOutlined, EditOutlined, PlusCircleFilled } from '@ant-design/icons';

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const [images, setImages] = useState([]);
  const [newData, setNewData] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (state) {
      fetchImageGallery();
    } else {
      navigate('/app/dashboard/diseases/diseases-list');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const fetchImageGallery = async () => {
    try {
      const response = await axiosInstance.get(`image-gallery/${state?.id}`);
      if (response.status === 200) {
        setImages(response.data.data);
      } else {
        setImages([]);
        notification.error({ message: 'Unable to fetch images' });
      }
    } catch (err) {
      setImages([]);
      console.log(err);
    }
  };

  const handleEdit = async (data) => {
    setUpdatedData(data);
  };
  const handleDelete = async (ids) => {
    const response = await axiosInstance.put(`image-gallery/${state?.id}`, {
      ids: ids
    });
    if (response.status === 200) {
      notification.success({ message: 'Image deleted successfully' });
      fetchImageGallery();
    } else {
      notification.error({ message: 'Unable to delete image' });
    }
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    setNewData((prev) => ({
      ...prev,
      name: text
    }));
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    if (newData && image) {
      const types = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
      if (image.size > 5 * 1024 * 1024) {
        notification.error({ message: 'Image must be less than 5MB' });
      } else if (types.includes(image.type)) {
        setNewData((prev) => ({
          ...prev,
          image_file: image
        }));
      } else {
        notification.error({ message: 'Invalid file format' });
      }
    } else {
      setNewData({
        image_file: image
      });
    }
  };

  const handleUpdateTextChange = (e) => {
    const text = e.target.value;
    setUpdatedData((prev) => ({
      ...prev,
      name: text
    }));
  };

  const handleUpdateImageChange = (e) => {
    const image = e.target.files[0];
    if (image) {
      const types = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
      if (image.size > 5 * 1024 * 1024) {
        notification.error({ message: 'Image must be less than 5MB' });
      } else if (types.includes(image.type)) {
        setUpdatedData((prev) => ({
          ...prev,
          image_file: image
        }));
      } else {
        notification.error({ message: 'Invalid file format' });
      }
    }
  };

  const createNewImage = async () => {
    try {
      if (!newData.name) {
        notification.error({ message: 'Image name is required' });
        return;
      }
      const formData = new FormData();
      formData.append('names', JSON.stringify([newData.name]));
      formData.append('images', newData.image_file);
      const response = await axiosInstance.post(`/image-gallery/${state?.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 201) {
        notification.success({ message: 'Image added successfully' });
        setNewData(null);
        fetchImageGallery();
      } else {
        notification.error({ message: 'Unable to add Image' });
      }
    } catch (err) {
      console.log(err);
      notification.error({ message: 'Error Occured' });
    }
  };

  const handleUpdateImage = async () => {
    try {
      if (!updatedData.name) {
        notification.error({ message: 'Image name is required' });
        return;
      }

      const formData = new FormData();
      formData.append('id', updatedData.id);
      formData.append('name', updatedData.name);
      formData.append('image', updatedData.image);
      if (updatedData.image_file) formData.append('image_file', updatedData.image_file);
      const response = await axiosInstance.post(`/image-gallery/update/${state?.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        notification.success({ message: 'Image updated successfully' });
        setUpdatedData(null);
        fetchImageGallery();
      } else {
        notification.error({ message: 'Unable to update Image' });
      }
    } catch (err) {
      console.log(err);
      notification.error({ message: 'Error Occured' });
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: 10,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: '1rem'
      }}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <p style={{ fontWeight: 'bolder', fontSize: 30 }}>Image Gallery - {state?.name} </p>
        {selected.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Popconfirm
              onCancel={() => {}}
              onConfirm={() => {
                handleDelete(selected);
                setSelected([]);
              }}
              title="Delete selected Image"
              description="This is an irreversible process"
              placement="left"
            >
              <Button style={{ width: '100%' }} danger>
                <DeleteOutlined /> Delete selected
              </Button>
            </Popconfirm>
          </div>
        )}
      </div>
      <Checkbox.Group onChange={(ids) => setSelected(ids)}>
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 20
          }}
        >
          {images.map((image) =>
            updatedData?.id !== image.id ? (
              <div key={image.id} style={{ display: 'flex', width: 150, flexDirection: 'column', gap: 5 }}>
                <Checkbox value={image.id} />
                <Image src={image.image} style={{ height: 150, aspectRatio: 1 / 1 }} />
                <span
                  style={{
                    minHeight: '2rem',
                    wordBreak: 'break-word',
                    alignContent: 'center',
                    textAlign: 'center',
                    paddingInline: 4
                  }}
                >
                  {image.name}
                </span>
                <div style={{ display: 'flex', width: '100%', gap: 10 }}>
                  <Button onClick={() => handleEdit(image)} style={{ width: '100%' }}>
                    <EditOutlined />
                  </Button>
                  <Popconfirm
                    onCancel={() => {}}
                    onConfirm={() => handleDelete([image.id])}
                    title="Delete Image"
                    description="This is an irreversible process"
                  >
                    <Button style={{ width: '100%' }} danger>
                      <DeleteOutlined />
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            ) : (
              <div
                key={image.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: 150,
                  gap: 5,
                  marginTop: 26
                }}
              >
                {updatedData?.image_file ? (
                  <Image src={URL.createObjectURL(updatedData.image_file)} style={{ height: 150, aspectRatio: 1 / 1 }} />
                ) : (
                  <label
                    htmlFor="image_upload"
                    style={{
                      height: 150,
                      cursor: 'pointer',
                      backgroundColor: '#00000077',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    <img
                      src={updatedData.image}
                      style={{ zIndex: -1, position: 'absolute', width: '100%', height: '100%' }}
                      alt={updatedData.name}
                    />
                    <input
                      name="image_upload"
                      id="image_upload"
                      onChange={handleUpdateImageChange}
                      hidden
                      type="file"
                      accept=".jpg,.png,.jpeg,.webp"
                    />
                    <PlusCircleFilled style={{ fontSize: 30, color: '#ffffff' }} />
                  </label>
                )}
                <input
                  maxLength={30}
                  value={updatedData.name}
                  style={{
                    border: '1px solid black',
                    paddingInline: 5,
                    borderRadius: 5,
                    minHeight: '2rem',
                    textAlign: 'center',
                    padding: 0
                  }}
                  onChange={handleUpdateTextChange}
                />
                <div style={{ display: 'flex', width: '100%', gap: 10 }}>
                  <Button type="primary" onClick={() => setUpdatedData(null)} style={{ width: '100%' }} danger>
                    <CloseOutlined />
                  </Button>
                  <Button type="primary" onClick={handleUpdateImage} style={{ width: '100%' }}>
                    Update
                  </Button>
                </div>
              </div>
            )
          )}

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: 150,
              gap: 5
            }}
          >
            {newData === null ? (
              <label
                htmlFor="image_upload"
                style={{
                  marginTop: 26,
                  height: 150,
                  cursor: 'pointer',
                  backgroundColor: '#00000077',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <input
                  name="image_upload"
                  id="image_upload"
                  onChange={handleImageChange}
                  hidden
                  type="file"
                  accept=".jpg,.png,.jpeg,.webp"
                />
                <PlusCircleFilled style={{ fontSize: 30, color: '#ffffff' }} />
              </label>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 26, gap: 5 }}>
                <Image src={URL.createObjectURL(newData.image_file)} style={{ height: 150, aspectRatio: 1 / 1 }} />
                <input
                  maxLength={30}
                  style={{
                    paddingInline: 5,
                    border: '1px solid black',
                    borderRadius: 5,
                    minHeight: '2rem',
                    textAlign: 'center',
                    padding: 0
                  }}
                  onChange={handleTextChange}
                />
                <div style={{ display: 'flex', width: '100%', gap: 10 }}>
                  <Button type="primary" onClick={() => setNewData(null)} style={{ width: '100%' }} danger>
                    <CloseOutlined />
                  </Button>
                  <Button type="primary" onClick={createNewImage} style={{ width: '100%' }}>
                    Create
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Checkbox.Group>
    </div>
  );
};

export default Index;
