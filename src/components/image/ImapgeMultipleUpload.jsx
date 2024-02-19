import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, LinearProgress, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';// Import the delete icon
import * as api from '../../api/firebase/image';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ImageMultipleUpload = (props) => {
  const [selectedImages, setSelectedImages] = useState([]); // Array to hold multiple images
  const [imageUrls, setImageUrls] = useState(props.originalImageUrls || []); // Array of URLs
  const [loading, setLoading] = useState(false);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(imageUrls);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImageUrls(items);
    props.handleImageUrls(items); // Update the parent component
  };

  useEffect(() => {
    if (props.originalImageUrls) {
      setImageUrls(props.originalImageUrls);
    }
  }, [props.originalImageUrls]);

  const onFileChange = async (imageFile) => {
    setLoading(true);
    try {
      const downloadURL = await api.getImageRef(imageFile, props.type, props.id);
      const newImageUrls = [...imageUrls, downloadURL];
      setImageUrls(newImageUrls);
      props.handleImageUrls(newImageUrls);
    } catch (error) {
      console.error('Error uploading image: ', error);
      // Handle upload error here, possibly setting an error message in state
    }
    setLoading(false);
  };

  useEffect(() => {
    selectedImages.forEach((imageFile) => {
      if (imageFile) {
        onFileChange(imageFile);
      }
    });
  }, [selectedImages]);

  const handleImageRemove = (index) => {
    // Remove image from the local state and call the parent handler
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImageUrls);
    props.handleImageUrls(newImageUrls);
  };

  return (
    <>
      <div className="uploadButton">
        <input
          accept="image/*"
          multiple // Allow multiple file selections
          type="file"
          id="select-multiple-image"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files) {
              const filesArray = Array.from(e.target.files);
              setSelectedImages(filesArray);
              filesArray.forEach(file => {
                onFileChange(file);
              });
              // Clear the file input after the files are processed
              e.target.value = null;
            }
          }}
        />
        <label htmlFor="select-multiple-image">
          <Button variant="contained" color="primary" component="span">
            Upload Images
          </Button>
        </label>
      </div>
      <Box sx={{ width: '100%' }}>
        {loading && <LinearProgress />}
      </Box>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="imageList" direction="horizontal">
          {(provided) => (
            <Box 
              {...provided.droppableProps}
              ref={provided.innerRef}
              mt={2}
              className="imageListContainer"
            >
              {imageUrls.map((url, index) => (
                <Draggable key={url} draggableId={url} index={index}>
                  {(provided) => (
                    <div 
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      key={index}
                      className="imageListItem"
                    >
                      <img src={url} alt={`Image ${index}`} className="imagePreview" />
                      <IconButton onClick={() => handleImageRemove(index)} className="deleteButton">
                        <ClearIcon />
                      </IconButton>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>   

    </>
  );
};

ImageMultipleUpload.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  handleImageUrls: PropTypes.func.isRequired, // This should now expect an array
  originalImageUrls: PropTypes.array // This should be an array of strings (URLs)
};

export default ImageMultipleUpload;
