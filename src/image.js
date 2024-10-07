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

    const downloadImage = () => {
        if (!image) return; // Ne rien faire si aucune image

        const link = document.createElement('a');
        link.href = image;
        link.setAttribute('download', 'image.png'); // Nom du fichier téléchargé
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Nettoie le DOM
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
                {image && <Button variant="contained" onClick={downloadImage}>Télécharger</Button>} {/* Bouton de téléchargement */}

            </div>
           
        </Container>
        <Footer/>
        </>
    );
}

export default ImagePage;