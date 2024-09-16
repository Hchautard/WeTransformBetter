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
    };

    return (
    <>
    <ResponsiveAppBar/>
        <Container sx={{margin:'5%'}}>
            <Typography>Image Page</Typography>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {image && <img src={image} alt="Uploaded Image" />}
            <div>
                <Button variant="contained" onClick={deleteImage}>Delete image</Button>
                 <Button variant="contained" onClick={handleImageOperation}>Apply Operation</Button>
            </div>
           
        </Container>
        <Footer/>
        </>
    );
}

export default ImagePage;