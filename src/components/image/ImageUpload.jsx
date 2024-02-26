import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, LinearProgress, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear'; // Import the clear icon
import * as api from '../../api/firebase/image';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styles from './image-upload.module.scss';

const ImageUpload = (props) => {
  const [imageUrl, setImageUrl] = useState(props.originalImageUrl || ''); // State for the image URL
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If there's an originalImageUrl prop, use it to set the imageUrl state
    if (props.originalImageUrl) {
      setImageUrl(props.originalImageUrl);
    }
  }, [props.originalImageUrl]);

  const onFileChange = async (imageFile) => {
    setLoading(true);
    try {
      const downloadURL = await api.getImageRef(imageFile, props.type, props.id);
      setImageUrl(downloadURL); // Set the single image URL
      props.handleImageUrl(downloadURL); // Propagate the change up to the parent component
    } catch (error) {
      console.error('Error uploading image: ', error);
      // Optionally handle upload error here
    }
    setLoading(false);
  };

  const handleImageRemove = () => {
    // Clear the image URL and notify the parent component
    setImageUrl('');
    props.handleImageUrl('');
  };

  return (
    <div className={styles.imageUploadRoot}>
      <div className="uploadButton">
        <input
          accept="image/*"
          type="file"
          id="select-image"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              // setSelectedImage(file);
              onFileChange(file);
              e.target.value = null; // Clear the file input
            }
          }}
        />
        <label htmlFor="select-image">
          <Button 
            variant="contained" 
            color="primary" 
            component="span"
            startIcon={<CloudUploadIcon />}
          >
            Upload Main Image
          </Button>
        </label>
      </div>
      <Box sx={{ width: '100%' }}>
        {loading && <LinearProgress />}
      </Box>
      {imageUrl && (
        <Box 
          mt={2} 
          sx={{ width: '20%' }} 
          className="imagePreviewContainer"
        >
          <img src={imageUrl} alt="Uploaded" className="imagePreview" />
          <IconButton onClick={handleImageRemove} className="deleteButton">
            <ClearIcon />
          </IconButton>
        </Box>
      )}
    </div>
  );
};

ImageUpload.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  handleImageUrl: PropTypes.func.isRequired, // This should now expect a single URL
  originalImageUrl: PropTypes.string // This should be a string (URL)
};

export default ImageUpload;
