import React, { useState } from 'react';
import ResponsiveAppBar from './appBar';
import Footer from './footer';
import { Button, Container, Typography } from '@mui/material';
import ColorPicker from 'material-ui-color-picker';

function ImagePage() {
    const [image, setImage] = useState(null);
    const [imageHistory, setImageHistory] = useState([]); // Track history of image modifications
    const [selectedColor, setColor] = useState('#000000');

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            setImage(reader.result);
            setImageHistory([reader.result]); // Reset history on new image upload
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const cancelModification = () => {
        if (imageHistory.length > 1) {
            const newHistory = [...imageHistory];
            newHistory.pop(); // Remove the latest modification
            const lastImage = newHistory[newHistory.length - 1]; // Get the previous image
            setImage(lastImage);
            setImageHistory(newHistory); // Update history
        }
    };

    const applyModification = (newImage) => {
        setImageHistory([...imageHistory, newImage]); // Save current state to history
        setImage(newImage); // Update image with the modified version
    };

    const changeImageColor = () => {
        if (!selectedColor) {
            console.log(selectedColor);
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = image;

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const red = data[i];
                const green = data[i + 1];
                const blue = data[i + 2];

                const newRed = (red * parseInt(selectedColor.slice(1, 3), 16)) / 255;
                const newGreen = (green * parseInt(selectedColor.slice(3, 5), 16)) / 255;
                const newBlue = (blue * parseInt(selectedColor.slice(5, 7), 16)) / 255;

                data[i] = newRed;
                data[i + 1] = newGreen;
                data[i + 2] = newBlue;
            }

            ctx.putImageData(imageData, 0, 0);

            const coloredImageUrl = canvas.toDataURL();
            applyModification(coloredImageUrl); // Apply and save modification
        };
    };

    const deleteImage = () => {
        setImage(null);
        setImageHistory([]); // Clear history
    };

    const rotateImage = () => {
        const rotatedImage = document.createElement('canvas');
        const ctx = rotatedImage.getContext('2d');
        const img = new Image();
        img.src = image;

        img.onload = () => {
            rotatedImage.width = img.height;
            rotatedImage.height = img.width;

            ctx.translate(rotatedImage.width / 2, rotatedImage.height / 2);
            ctx.rotate(Math.PI / 2);
            ctx.drawImage(img, -img.width / 2, -img.height / 2);

            const rotatedImageUrl = rotatedImage.toDataURL();
            applyModification(rotatedImageUrl); // Apply and save modification
        };
    };

    const inverseImage = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = image;

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];       // Invert Red
                data[i + 1] = 255 - data[i + 1]; // Invert Green
                data[i + 2] = 255 - data[i + 2]; // Invert Blue
            }

            ctx.putImageData(imageData, 0, 0);

            const invertedImageUrl = canvas.toDataURL();
            applyModification(invertedImageUrl); // Apply and save modification
        };
    };

    const convertToGrayscale = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = image;

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const red = data[i];
                const green = data[i + 1];
                const blue = data[i + 2];

                const grayscale = 0.299 * red + 0.587 * green + 0.114 * blue;

                data[i] = grayscale;
                data[i + 1] = grayscale;
                data[i + 2] = grayscale;
            }

            ctx.putImageData(imageData, 0, 0);

            const grayscaleImageUrl = canvas.toDataURL();
            setImage(grayscaleImageUrl);
        };
    };

    return (
    <>
        <ResponsiveAppBar />
        <Container sx={{ margin: '5%' }}>
            <Typography>Image Page</Typography>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {image && <img src={image} alt="Uploaded Image" />}
            <div>
                {image && <Button variant="contained" onClick={deleteImage}>Delete image</Button>}
                {image && <Button variant="contained" onClick={rotateImage}>Rotate</Button>}
                {image && <Button variant="contained" onClick={inverseImage}>Inverse</Button>}
                {image && <Button variant="contained" onClick={cancelModification}>Cancel Last Modification</Button>}
                {image && <Button variant="contained" onClick={convertToGrayscale}>Grayscale</Button>}
                {image && (
                    <ColorPicker
                        defaultValue="#000000"
                        onChange={(color) => {
                            console.log("Selected Color:", color);
                            setColor(color);
                        }}
                    />
                )}
                {image && <Button variant="contained" onClick={changeImageColor}>Change Color</Button>}
            </div>
        </Container>
        <Footer />
    </>
    );
}

export default ImagePage;
