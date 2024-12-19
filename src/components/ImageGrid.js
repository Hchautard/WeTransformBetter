import React from 'react';
import { Button } from '@mui/material';

const ImageGrid = ({ images, setSelectedImageIndex, downloadImage }) => {
  return (
    <div style={{
      marginTop: "20px",
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "20px",
    }}>
      {images.map((img, index) => (
        <div
          key={index}
          style={{
            textAlign: "center",
            border: "2px solid black",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "auto",
          }}
        >
          <img
            src={img}
            alt={`Uploaded ${index + 1}`}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
            onClick={() => setSelectedImageIndex(index)}
          />
          <div style={{ marginTop: "10px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setSelectedImageIndex(index)}
              style={{ marginRight: "10px" }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => downloadImage(index)}
            >
              Download
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
