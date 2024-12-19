import React from 'react';
import { ChromePicker } from 'react-color';

function ColorPicker({ images, selectedImageIndex, applyModification }) {
  const handleColorChange = (color) => {
    // Change color logic
  };

  return <ChromePicker onChangeComplete={handleColorChange} />;
}

export default ColorPicker;
