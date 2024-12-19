import { useState, useEffect } from 'react';

export const useImageEditor = () => {
  const [images, setImages] = useState([]);
  const [originalImages, setOriginalImages] = useState([]);
  const [imageHistory, setImageHistory] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [filter, setFilter] = useState("");
  const [blurIntensity, setBlurIntensity] = useState(5);

  const applyModification = (newImage) => {
    const newImages = [...images];
    newImages[selectedImageIndex] = newImage;
    setImageHistory([...imageHistory, newImage]);
    setImages(newImages);
  };

  const cancelModification = () => {
    if (imageHistory.length > 1 && selectedImageIndex !== null) {
      const newHistory = [...imageHistory];
      newHistory.pop();
      const lastImage = newHistory[newHistory.length - 1];
      const newImages = [...images];
      newImages[selectedImageIndex] = lastImage;
      setImages(newImages);
      setImageHistory(newHistory);
    }
  };

  // Add other image manipulation functions here...

  return {
    images,
    setImages,
    originalImages,
    setOriginalImages,
    imageHistory,
    setImageHistory,
    selectedImageIndex,
    setSelectedImageIndex,
    filter,
    setFilter,
    blurIntensity,
    setBlurIntensity,
    applyModification,
    cancelModification,
  };
};

export default useImageEditor;
