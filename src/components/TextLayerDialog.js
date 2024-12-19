import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, 
         FormControl, InputLabel, Select, MenuItem, Slider } from '@mui/material';
import { ChromePicker } from 'react-color';

const TextLayerDialog = ({ 
  open, 
  onClose, 
  textInput, 
  setTextInput, 
  textFont, 
  setTextFont, 
  textSize, 
  setTextSize, 
  textColor, 
  setTextColor, 
  addTextLayer 
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Text Layer</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Text"
          fullWidth
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Font</InputLabel>
          <Select value={textFont} onChange={(e) => setTextFont(e.target.value)}>
            <MenuItem value="Arial">Arial</MenuItem>
            <MenuItem value="Times New Roman">Times New Roman</MenuItem>
            <MenuItem value="Courier New">Courier New</MenuItem>
            <MenuItem value="Verdana">Verdana</MenuItem>
          </Select>
        </FormControl>
        <Slider
          value={textSize}
          onChange={(e, newValue) => setTextSize(newValue)}
          min={12}
          max={1000}
          valueLabelDisplay="auto"
        />
        <ChromePicker
          color={textColor}
          onChangeComplete={(color) => setTextColor(color.hex)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={addTextLayer} color="primary">Add Text</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TextLayerDialog;
