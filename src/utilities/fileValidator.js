export const imageValidator = (_, value) => {
  if (!value || value.fileList.length === 0) {
    return Promise.reject(new Error('Please upload a file'));
  }

  const file = value.fileList[0].originFileObj;
  const maxBytes = 5 * 1024 * 1024;
  if (file.size > maxBytes) {
    return Promise.reject(new Error('File must be smaller than 5 MB'));
  }

  return Promise.resolve();
};

export const videoValidator = (_, value) => {
  if (!value || value.fileList.length === 0) {
    return Promise.reject(new Error('Please upload a file'));
  }

  const file = value.fileList[0].originFileObj;
  const maxBytes = 5 * 1024 * 1024;
  if (file.size > maxBytes) {
    return Promise.reject(new Error('File must be smaller than 5 MB'));
  }

  return Promise.resolve();
};
