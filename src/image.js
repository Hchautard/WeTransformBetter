import React, { useState } from 'react';
import ResponsiveAppBar from './appBar';
import Footer from './footer';
import { Container, Typography } from '@mui/material';

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

    const handleImageOperation = () => {
    };

    return (
    <>
    <ResponsiveAppBar/>
        <Container sx={{margin:'5%'}}>
            <Typography>Image Page</Typography>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {image && <img src={image} alt="Uploaded Image" />}
            <button onClick={handleImageOperation}>Apply Operation</button>
        </Container>
        <Footer/>
        </>
    );
}

export default ImagePage;