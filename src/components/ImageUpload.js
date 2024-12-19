import React from 'react';
import { Box, Button, TextField, Divider } from '@mui/material';

const ImageUploader = ({ imageUrl, setImageUrl, handleImageUrlSubmit, handleImageUpload }) => {
  return (
    <Box 
      component="section" 
      sx={{ 
        p: 2, 
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          multiple
        />
      </Box>

      <Divider orientation="vertical" variant="middle" flexItem />

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          label="Enter Image URL"
          variant="outlined"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleImageUrlSubmit()}
          style={{ marginTop: "10px", width: "800px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleImageUrlSubmit}
          style={{ marginTop: "10px" }}
        >
          Load Image from URL
        </Button>
      </Box>
    </Box>
  );
};

export default ImageUploader;
