import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import * as projectApi from '../../api/firebase/project';
import { FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import styles from './url-list-editor.module.scss';

const UrlListEditor = ({ urls, setUrls }) => {
  const [urlTypeList, setUrlTypeList] = useState([]);

  const fetchUrlTypeList = async () => {
    const urlTypeList = await projectApi.getUrlTypeList();
    setUrlTypeList(urlTypeList);
  };

  useEffect(() => {
    fetchUrlTypeList();
  }, []);

  const handleAddUrl = () => {
    setUrls([...urls, { name: '', link: '', type: '' }]);
  };

  const handleRemoveUrl = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
  };

  const handleChangeUrl = (index, newName, newLink, newType) => {
    const newUrls = urls.map((url, i) => {
      if (i === index) {
        return { ...url, name: newName, link: newLink, type: newType};
      }
      return url;
    });
    setUrls(newUrls);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(urls);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setUrls(items);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="droppable-url-list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {urls.map((url, index) => (
              <Draggable key={index} draggableId={`item-${index}`} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    // style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}
                    className={styles.urlItem}
                  >
                    <TextField
                      type="text"
                      value={url.name}
                      placeholder="Name"
                      onChange={(e) => handleChangeUrl(index, e.target.value, url.link, url.type)}
                      style={{ flex: 1, marginRight: '8px' }}
                    />
                    <TextField
                      type="text"
                      value={url.link}
                      placeholder="Link"
                      onChange={(e) => handleChangeUrl(index, url.name, e.target.value, url.type)}
                      style={{ flex: 3, marginRight: '8px' }}
                    />
                    <FormControl fullWidth style={{ flex: 1 }}>
                      <InputLabel id="url-type-select-label">Url Type</InputLabel>
                      <Select
                        labelId="url-type-select-label"
                        id="url-type-select"
                        value={url.type}
                        label="Url type"
                        onChange={(e) => handleChangeUrl(index, url.name, url.link, e.target.value)}
                      >
                        {urlTypeList.map((type, i) => (
                          <MenuItem key={i} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <IconButton 
                      aria-label="clera-icon" 
                      color="success"
                      onClick={() => handleRemoveUrl(index)}
                      className={styles.iconButton}
                    >
                      <ClearIcon />
                    </IconButton>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Button onClick={handleAddUrl}>Add URL</Button>
    </DragDropContext>
  );
};

UrlListEditor.propTypes = {
  urls: PropTypes.array.isRequired,
  setUrls: PropTypes.func.isRequired,
};

export default UrlListEditor;
