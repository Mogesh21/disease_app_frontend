import { Button, Checkbox, Image, Input, notification, Popconfirm } from 'antd';
import axiosInstance from 'config/axiosConfig';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { CloseOutlined, DeleteOutlined, EditOutlined, PlusCircleFilled, PlusOutlined } from '@ant-design/icons';

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const [videos, setVideos] = useState([]);
  const [newData, setNewData] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (state) {
      fetchVideoGallery();
    } else {
      navigate('/app/dashboard/diseases/diseases-list');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const fetchVideoGallery = async () => {
    try {
      const response = await axiosInstance.get(`video-gallery/${state.id}`);
      if (response.status === 200) {
        setVideos(response.data.data);
      } else {
        setVideos([]);
        notification.error({ message: 'Unable to fetch videos' });
      }
    } catch (err) {
      setVideos([]);
      console.log(err);
    }
  };

  const handleEdit = async (data) => {
    setUpdatedData(data);
  };

  const handleDelete = async (ids) => {
    const response = await axiosInstance.put(`video-gallery/${state.id}`, {
      ids: ids
    });
    if (response.status === 200) {
      notification.success({ message: 'Video deleted successfully' });
      fetchVideoGallery();
    } else {
      notification.error({ message: 'Unable to delete video' });
    }
  };

  const handleTextChange = (e, field) => {
    const text = e.target.value;
    setNewData((prev) => ({
      ...prev,
      [field]: text
    }));
  };

  const handleVideoChange = (e) => {
    const video = e.target.files[0];
    if (video) {
      const types = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
      if (video.size > 20 * 1024 * 1024) {
        notification.error({ message: 'Video must be less than 20MB' });
      } else if (types.includes(video.type)) {
        setNewData((prev) => ({
          ...prev,
          video_file: video
        }));
      } else {
        notification.error({ message: 'Invalid file format' });
      }
    }
  };

  useEffect(() => {
    console.log(newData);
  }, [newData]);

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
      if (image.size > 5 * 1024 * 1024) {
        notification.error({ message: 'Image must be less than 5MB' });
      } else {
        setNewData({
          image_file: image
        });
      }
    }
  };

  const handleUpdateTextChange = (e, field) => {
    const text = e.target.value;
    setUpdatedData((prev) => ({
      ...prev,
      [field]: text
    }));
  };

  const handleUpdateVideoChange = (e) => {
    const video = e.target.files[0];
    if (video) {
      const types = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
      if (video.size > 20 * 1024 * 1024) {
        notification.error({ message: 'Video must be less than 20MB' });
      } else if (types.includes(video.type)) {
        setUpdatedData((prev) => ({
          ...prev,
          video_file: video
        }));
      } else {
        notification.error({ message: 'Invalid file format' });
      }
    }
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

  const createNewVideo = async () => {
    try {
      if (!newData.name) {
        notification.error({ message: 'Name is required' });
        return;
      }
      if (!newData.video_file) {
        notification.error({ message: 'Video is required' });
        return;
      }
      if (!newData.image_file) {
        notification.error({ message: 'Thumbnail image is required' });
        return;
      }

      const formData = new FormData();
      formData.append('names', JSON.stringify([newData.name]));
      formData.append('descriptions', JSON.stringify([newData.description]));
      formData.append('videos', newData.video_file);
      formData.append('thumbnails', newData.image_file);
      const response = await axiosInstance.post(`/video-gallery/${state.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 201) {
        notification.success({ message: 'Video added successfully' });
        setNewData(null);
        fetchVideoGallery();
      } else {
        notification.error({ message: 'Unable to add Video' });
      }
    } catch (err) {
      console.log(err);
      notification.error({ message: 'Error Occured' });
    }
  };

  const handleUpdateVideo = async () => {
    try {
      if (!updatedData.name) {
        notification.error({ message: 'Name is required' });
        return;
      }

      const formData = new FormData();
      formData.append('id', updatedData.id);
      formData.append('name', updatedData.name);
      formData.append('video', updatedData.video);
      formData.append('thumbnail', updatedData.thumbnail_image);
      formData.append('description', updatedData.description);
      if (updatedData.video_file) formData.append('video_file', updatedData.video_file);
      if (updatedData.image_file) formData.append('image_file', updatedData.image_file);
      const response = await axiosInstance.post(`/video-gallery/update/${state.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        notification.success({ message: 'Video updated successfully' });
        setUpdatedData(null);
        fetchVideoGallery();
      } else {
        notification.error({ message: 'Unable to update Video' });
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
        <p style={{ fontWeight: 'bolder', fontSize: 30 }}>Video Gallery - {state?.name} </p>
        {selected.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Popconfirm
              onCancel={() => {}}
              onConfirm={() => {
                handleDelete(selected);
                setSelected([]);
              }}
              title="Delete selected Video"
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
            flexDirection: 'column',
            gap: 20
          }}
        >
          {videos.map((video) =>
            updatedData?.id !== video.id ? (
              <div
                key={video.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                  paddingBottom: 10,
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #cfcfcf'
                }}
              >
                <div style={{ display: 'flex', gap: 5, justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <Checkbox value={video.id} style={{ alignSelf: 'start' }} />
                      <ReactPlayer controls src={video.video} style={{ aspectRatio: 16 / 9 }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <span style={{ fontWeight: 700 }}>Thumbnail Image:</span>
                      <Image src={video.thumbnail_image} style={{ width: 160, height: 180 }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifySelf: 'end' }}>
                    <Button onClick={() => handleEdit(video)} style={{ width: '100%' }}>
                      <EditOutlined />
                    </Button>
                    <Popconfirm
                      onCancel={() => {}}
                      onConfirm={() => handleDelete([video.id])}
                      title="Delete Video"
                      description="This is an irreversible process"
                    >
                      <Button style={{ width: '100%' }} danger>
                        <DeleteOutlined />
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
                <div style={{ width: '100%', paddingInline: 10, flexDirection: 'column', overflow: 'hidden' }}>
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      minHeight: '2rem',
                      alignContent: 'center',
                      textAlign: 'center'
                    }}
                  >
                    {video.name}
                  </span>
                  <p style={{ wordBreak: 'break-word', height: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {video.description}
                  </p>
                </div>
              </div>
            ) : (
              <div
                key={video.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                  paddingBottom: 10,
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #cfcfcf'
                }}
              >
                <div style={{ display: 'flex', gap: 5, justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <span style={{ fontWeight: 700 }}>Video :</span>
                      <label
                        htmlFor="video_upload"
                        style={{
                          height: 155,
                          aspectRatio: 16 / 9,
                          cursor: 'pointer',
                          backgroundColor: '#00000077',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          position: 'relative',
                          zIndex: 1
                        }}
                      >
                        <ReactPlayer
                          src={updatedData.video_file ? URL.createObjectURL(updatedData.video_file) : updatedData.video}
                          style={{ zIndex: -1, position: 'absolute', width: '100%', height: '100%' }}
                          alt={updatedData.name}
                        />
                        <input
                          name="video_upload"
                          id="video_upload"
                          onChange={handleUpdateVideoChange}
                          hidden
                          type="file"
                          accept="video/*"
                        />
                        <PlusCircleFilled style={{ fontSize: 35, color: '#ffffff' }} />
                      </label>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <span style={{ fontWeight: 700 }}>Thumbnail Image:</span>
                      <label
                        htmlFor="image_upload"
                        style={{
                          height: 155,
                          width: 155,
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
                          src={updatedData.image_file ? URL.createObjectURL(updatedData.image_file) : updatedData.thumbnail_image}
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
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Button type="primary" onClick={() => setUpdatedData(null)} style={{ width: '100%' }} danger>
                      <CloseOutlined />
                    </Button>
                    <Button type="primary" onClick={handleUpdateVideo} style={{ width: '100%' }}>
                      Update
                    </Button>
                  </div>
                </div>
                <div style={{ width: '100%', paddingInline: 10, display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: 10 }}>
                  <Input
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      minHeight: '2rem',
                      alignContent: 'center'
                    }}
                    maxLength={30}
                    value={updatedData.name}
                    onChange={(e) => handleUpdateTextChange(e, 'name')}
                  />

                  <Input.TextArea
                    style={{ wordBreak: 'break-word', height: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    value={updatedData.description}
                    rows={5}
                    onChange={(e) => handleUpdateTextChange(e, 'description')}
                  />
                </div>
              </div>
            )
          )}

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
              paddingBottom: 10,
              justifyContent: 'space-between',
              borderBottom: '1px solid #cfcfcf'
            }}
          >
            {newData === null ? (
              <div
                style={{
                  height: 100,
                  width: 'fit-content',
                  paddingInline: 40,
                  cursor: 'pointer',
                  backgroundColor: '#1f111f',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10
                }}
                onClick={() => setNewData({})}
              >
                <span style={{ color: 'white', fontSize: 20 }}>Add Video</span>
                <PlusOutlined style={{ color: 'white', fontSize: 20 }} />
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                  paddingBottom: 10,
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', gap: 5, justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <span style={{ fontWeight: 700 }}>Video :</span>
                      <label
                        htmlFor="video_upload"
                        style={{
                          height: 155,
                          aspectRatio: 16 / 9,
                          cursor: 'pointer',
                          backgroundColor: '#00000077',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          position: 'relative',
                          zIndex: 1
                        }}
                      >
                        {newData.video_file && (
                          <ReactPlayer
                            src={URL.createObjectURL(newData?.video_file)}
                            style={{ zIndex: -1, position: 'absolute', width: '100%', height: '100%' }}
                            alt={newData.name}
                          />
                        )}
                        <input name="video_upload" id="video_upload" onChange={handleVideoChange} hidden type="file" accept="video/*" />
                        <PlusCircleFilled style={{ fontSize: 35, color: '#ffffffff' }} />
                      </label>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <span style={{ fontWeight: 700 }}>Thumbnail Image:</span>
                      <label
                        htmlFor="image_upload"
                        style={{
                          height: 155,
                          width: 155,
                          cursor: 'pointer',
                          backgroundColor: '#00000077',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          position: 'relative',
                          zIndex: 1
                        }}
                      >
                        {newData.image_file && (
                          <img
                            src={URL.createObjectURL(newData.image_file)}
                            style={{ zIndex: -1, position: 'absolute', width: '100%', height: '100%' }}
                            alt={newData.name}
                          />
                        )}
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
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Button type="primary" onClick={() => setNewData(null)} style={{ width: '100%' }} danger>
                      <CloseOutlined />
                    </Button>
                    <Button type="primary" onClick={createNewVideo} style={{ width: '100%' }}>
                      Create
                    </Button>
                  </div>
                </div>
                <div style={{ width: '100%', paddingInline: 10, display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: 10 }}>
                  <Input
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      minHeight: '2rem',
                      alignContent: 'center'
                    }}
                    maxLength={30}
                    value={newData.name || ''}
                    onChange={(e) => handleTextChange(e, 'name')}
                  />

                  <Input.TextArea
                    style={{ wordBreak: 'break-word', height: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    value={newData.description || ''}
                    rows={5}
                    onChange={(e) => handleTextChange(e, 'description')}
                  />
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
