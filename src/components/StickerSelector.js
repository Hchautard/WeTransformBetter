import React from 'react';

function StickerSelector({ images, selectedImageIndex, applyModification }) {
  const stickers = ['/sticker1.png', '/sticker2.png'];

  return (
    <div>
      {stickers.map((src, index) => (
        <img 
          key={index} 
          src={src} 
          alt={`sticker-${index}`} 
          onClick={() => { /* Sticker logic */ }} 
        />
      ))}
    </div>
  );
}

export default StickerSelector;
