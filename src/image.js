import React, { useState } from 'react';
import ResponsiveAppBar from './appBar';
import Footer from './footer';
import { Button, Container, Typography } from '@mui/material';

function ImagePage() {
    const [image, setImage] = useState(null);

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

    const deleteImage = () => {
        setImage(null);
    };

    const handleImageOperation = () => {
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

    return (
    <>
    <ResponsiveAppBar/>
        <Container sx={{margin:'5%'}}>
            <Typography>Image Page</Typography>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {image && <img src={image} alt="Uploaded Image" />}
            <div>
                {image && <Button variant="contained" onClick={deleteImage}>Delete image</Button>}
                {image && <Button variant="contained" onClick={handleImageOperation}>Tourne</Button>}
            </div>
           
        </Container>
        <Footer/>
        </>
    );
}

export default ImagePage;