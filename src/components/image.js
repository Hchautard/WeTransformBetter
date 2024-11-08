import React, { useState, useEffect } from 'react';
import ResponsiveAppBar from './appBar';
import Footer from './footer';
import { Button, Container, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material';
import { ChromePicker } from 'react-color';

function ImagePage() {
    const [image, setImage] = useState(null);
    const [originalImage, setOriginalImage] = useState(null); 
    const [imageHistory, setImageHistory] = useState([]); 
    const [selectedColor, setColor] = useState('#000000');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [imageName, setImageName] = useState(''); // Nouveau state pour le nom de l'image

    const hexToRgb = (hex) => {
        hex = hex.replace(/^#/, '');
        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('');
        }
        const bigint = parseInt(hex, 16);
        if (isNaN(bigint)) return null;
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            setImage(reader.result);
            setOriginalImage(reader.result); 
            setImageHistory([reader.result]);
            setColor('#000000'); 
            setImageName(file.name.split('.')[0]); // Extraire le nom de l'image sans extension
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const cancelModification = () => {
        if (imageHistory.length > 1) {
            const newHistory = [...imageHistory];
            newHistory.pop(); 
            const lastImage = newHistory[newHistory.length - 1]; 
            setImage(lastImage);
            setImageHistory(newHistory); 
        }
    };

    const applyModification = (newImage) => {
        setImageHistory([...imageHistory, newImage]);
        setImage(newImage); 
    };

    const changeImageColor = () => {
        if (!selectedColor) {
            console.log("Aucune couleur sélectionnée.");
            return;
        }

        if (!originalImage) {
            console.log("Aucune image originale disponible.");
            return;
        }

        const rgb = hexToRgb(selectedColor);
        if (!rgb) {
            console.log("Format de couleur invalide :", selectedColor);
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = originalImage;

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                data[i] = data[i] * (1 - 0.5) + rgb.r * 0.5;       
                data[i + 1] = data[i + 1] * (1 - 0.5) + rgb.g * 0.5; 
                data[i + 2] = data[i + 2] * (1 - 0.5) + rgb.b * 0.5; 
            }

            ctx.putImageData(imageData, 0, 0);

            const coloredImageUrl = canvas.toDataURL();
            setImageHistory([originalImage, coloredImageUrl]); 
            setImage(coloredImageUrl); 
        };

        img.onerror = () => {
            console.log("Erreur de chargement de l'image.");
        };
    };

    const deleteImage = () => {
        setImage(null);
        setOriginalImage(null); 
        setImageHistory([]); 
        setColor('#000000'); 
        setImageName(''); // Réinitialiser le nom de l'image
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
            applyModification(rotatedImageUrl);
        };

        img.onerror = () => {
            console.log("Erreur de chargement de l'image pour rotation.");
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
            applyModification(invertedImageUrl);
        };

        img.onerror = () => {
            console.log("Erreur de chargement de l'image pour inversion.");
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
            applyModification(grayscaleImageUrl);
        };

        img.onerror = () => {
            console.log("Erreur de chargement de l'image pour niveaux de gris.");
        };
    };

    const downloadImage = () => {
        if (!image) return;

        const link = document.createElement('a');
        link.href = image;
        console.log("Image à télécharger :", image);
        link.setAttribute('download', `${imageName}-WTB.png`); // Utiliser le format {nom_image}-WTB
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadClick = () => {
        setPreviewOpen(true);
    };

    return (
        <>
            <ResponsiveAppBar />
            <Container sx={{
                    margin: '5%',
                    minHeight: 'calc(100vh - 64px - 300px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}>
                <Typography variant="h4" gutterBottom>
                    Image Page
                </Typography>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {image && (
                    <img
                    src={image}
                    alt="Uploaded Image"
                    style={{
                        maxWidth: '100%',
                        maxHeight: '500px',
                        marginTop: '20px',
                        objectFit: 'contain',
                    }}
                />
                )}

                <div style={{ marginTop: '20px' }}>
                    {image && (
                        <>
                            <Button
                                variant="contained"
                                color="error"
                                style={{ marginRight: '10px', marginBottom: '10px' }}
                                onClick={deleteImage}
                            >
                                Supprimer l'image
                            </Button>
                            <Button
                                variant="contained"
                                style={{ marginRight: '10px', marginBottom: '10px' }}
                                onClick={cancelModification}
                                disabled={imageHistory.length <= 1}
                            >
                                Annuler la dernière modification
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginRight: '10px', marginBottom: '10px' }}
                                onClick={handleDownloadClick}
                            >
                                Télécharger
                            </Button>
                            <br />
                            <Button
                                variant="contained"
                                style={{ marginRight: '10px', marginBottom: '10px' }}
                                onClick={rotateImage}
                            >
                                Tourner
                            </Button>
                            <Button
                                variant="contained"
                                style={{ marginRight: '10px', marginBottom: '10px' }}
                                onClick={inverseImage}
                            >
                                Inverser
                            </Button>
                            <Button
                                variant="contained"
                                style={{ marginRight: '10px', marginBottom: '10px' }}
                                onClick={convertToGrayscale}
                            >
                                Niveaux de gris
                            </Button>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                <ChromePicker
                                    color={selectedColor}
                                    onChangeComplete={(color) => {
                                        console.log("Couleur sélectionnée :", color.hex);
                                        setColor(color.hex);
                                    }}
                                    disableAlpha
                                />
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={changeImageColor}
                                    style={{ marginLeft: '10px', marginBottom: '10px' }}
                                >
                                    Changer la couleur
                                </Button>
                            </div>
                        </>
                    )}
                </div>

                <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
                    <DialogTitle>Prévisualisation de l'image à télécharger</DialogTitle>
                    <DialogContent dividers>
                        {image && (
                            <img
                                src={image}
                                alt="Preview"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setPreviewOpen(false)}>Annuler</Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                downloadImage();
                                setPreviewOpen(false);
                            }}
                        >
                            Télécharger
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
            <Box
                sx={{
                    position: 'relative',
                    bottom: 0,
                    width: '100%',
                    mt: 2, 
                }}
            >
                <Footer />
            </Box>
        </>
    );
}

export default ImagePage;
