import React, { useState } from 'react';
import ResponsiveAppBar from './appBar';
import Footer from '../src/footer';
import { Button, Container, Typography } from '@mui/material';
import ColorPicker from 'material-ui-color-picker';

function ImagePage() {
    const [image, setImage] = useState(null);
    const [selectedColor, setColor] = useState('#000000');
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            setImage(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
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
            setImage(coloredImageUrl);
        };
    };


    const deleteImage = () => {
        setImage(null);
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
            setImage(rotatedImageUrl);
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
                data[i] = 255 - data[i];
                data[i + 1] = 255 - data[i + 1];
                data[i + 2] = 255 - data[i + 2];
            }

            ctx.putImageData(imageData, 0, 0);

            const invertedImageUrl = canvas.toDataURL();
            setImage(invertedImageUrl);
        };
    };

    return (
    <>
    <ResponsiveAppBar/>
        <Container sx={{margin:'5%'}}>
            <Typography>Image Page</Typography>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {image && <img src={image} alt="Uploaded Image" />}
            <div>
                {image && <Button variant="contained" onClick={deleteImage}>Delete image</Button>}
                {image && <Button variant="contained" onClick={rotateImage}>Tourne</Button>}
                {image && <Button variant="contained" onClick={inverseImage}>Inverse</Button>}
                {image && ( <ColorPicker defaultValue="#000000" onChange={(color) => {  console.log("Selected Color:", color); setColor(color); }}/>
)}

                {image && <Button variant="contained" onClick={changeImageColor}>Change Color</Button>}
                </div>
           
        </Container>
        <Footer/>
        </>
    );
}

export default ImagePage;