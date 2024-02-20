import React from 'react';
import { Button, TextField } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';

const UrlListEditor = ({ urls, setUrls }) => {
  const handleAddUrl = () => {
    setUrls([...urls, { name: '', link: '' }]);
  };

  const handleRemoveUrl = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
  };

  const handleChangeUrl = (index, newName, newLink) => {
    const newUrls = urls.map((url, i) => {
      if (i === index) {
        return { ...url, name: newName, link: newLink };
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
                    style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}
                  >
                    <TextField
                      type="text"
                      value={url.name}
                      placeholder="Name"
                      onChange={(e) => handleChangeUrl(index, e.target.value, url.link)}
                      style={{ flexGrow: 1, marginRight: '8px' }}
                    />
                    <TextField
                      type="text"
                      value={url.link}
                      placeholder="Link"
                      onChange={(e) => handleChangeUrl(index, url.name, e.target.value)}
                      style={{ flexGrow: 1, marginRight: '8px' }}
                    />
                    <Button onClick={() => handleRemoveUrl(index)}>Remove</Button>
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
