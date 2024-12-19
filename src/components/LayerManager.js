import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Typography, Button } from '@mui/material';

const LayerManager = ({ layers, onDragEnd, removeLayer }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="layers">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {layers.map((layer, index) => (
              <Draggable key={layer.id} draggableId={layer.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  >
                    <img
                      src={layer.image}
                      alt="Layer"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "contain",
                        marginRight: "10px",
                      }}
                    />
                    <Typography style={{ flexGrow: 1 }}>
                      {layer.content} ({layer.font}, {layer.size}px)
                    </Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeLayer(layer.id)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default LayerManager;
