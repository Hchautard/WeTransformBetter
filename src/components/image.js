import React, { useState, useEffect } from 'react';
import ResponsiveAppBar from './appBar';
import Footer from './footer';
import { Button, Container, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material';
import { ChromePicker } from 'react-color'; // Import du ChromePicker

function ImagePage() {
    const [image, setImage] = useState(null);
    const [originalImage, setOriginalImage] = useState(null); // Stocker l'image originale
    const [imageHistory, setImageHistory] = useState([]); // Suivre l'historique des modifications
    const [selectedColor, setColor] = useState('#000000');
    const [previewOpen, setPreviewOpen] = useState(false); // État pour gérer l'ouverture du modal de prévisualisation

    // Fonction utilitaire pour convertir une couleur hex en RGB
    const hexToRgb = (hex) => {
        // Retirer le '#' s'il est présent
        hex = hex.replace(/^#/, '');
        // Support des codes courts (#RGB)
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

    useEffect(() => {
        console.log("selectedColor a changé :", selectedColor);
    }, [selectedColor]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            setImage(reader.result);
            setOriginalImage(reader.result); // Stocker l'image originale
            setImageHistory([reader.result]); // Réinitialiser l'historique
            setColor('#000000'); // Réinitialiser la couleur sélectionnée
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const cancelModification = () => {
        if (imageHistory.length > 1) {
            const newHistory = [...imageHistory];
            newHistory.pop(); // Supprimer la dernière modification
            const lastImage = newHistory[newHistory.length - 1]; // Obtenir l'image précédente
            setImage(lastImage);
            setImageHistory(newHistory); // Mettre à jour l'historique
        }
    };

    const applyModification = (newImage) => {
        setImageHistory([...imageHistory, newImage]); // Sauvegarder l'état actuel dans l'historique
        setImage(newImage); // Mettre à jour l'image avec la version modifiée
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
        img.src = originalImage; // Utiliser l'image originale

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Appliquer une teinte basée sur la couleur sélectionnée
            for (let i = 0; i < data.length; i += 4) {
                // Mélange linéaire des couleurs
                data[i] = data[i] * (1 - 0.5) + rgb.r * 0.5;       // Rouge
                data[i + 1] = data[i + 1] * (1 - 0.5) + rgb.g * 0.5; // Vert
                data[i + 2] = data[i + 2] * (1 - 0.5) + rgb.b * 0.5; // Bleu
                // data[i + 3] reste inchangé (alpha)
            }

            ctx.putImageData(imageData, 0, 0);

            const coloredImageUrl = canvas.toDataURL();
            setImageHistory([originalImage, coloredImageUrl]); // Réinitialiser l'historique avec l'image originale et la couleur appliquée
            setImage(coloredImageUrl); // Mettre à jour l'image

            // Optionnel : Réinitialiser la couleur sélectionnée si nécessaire
            // setColor('#000000'); // Décommentez cette ligne si vous souhaitez réinitialiser la couleur après l'application
        };

        img.onerror = () => {
            console.log("Erreur de chargement de l'image.");
        };
    };

    const deleteImage = () => {
        setImage(null);
        setOriginalImage(null); // Supprimer l'image originale
        setImageHistory([]); // Effacer l'historique
        setColor('#000000'); // Réinitialiser la couleur sélectionnée
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
            applyModification(rotatedImageUrl); // Appliquer et enregistrer la modification
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
                data[i] = 255 - data[i];         // Inverser le Rouge
                data[i + 1] = 255 - data[i + 1]; // Inverser le Vert
                data[i + 2] = 255 - data[i + 2]; // Inverser le Bleu
                // data[i + 3] reste inchangé (alpha)
            }

            ctx.putImageData(imageData, 0, 0);

            const invertedImageUrl = canvas.toDataURL();
            applyModification(invertedImageUrl); // Appliquer et enregistrer la modification
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
                // data[i + 3] reste inchangé (alpha)
            }

            ctx.putImageData(imageData, 0, 0);

            const grayscaleImageUrl = canvas.toDataURL();
            applyModification(grayscaleImageUrl); // Appliquer et enregistrer la modification
        };

        img.onerror = () => {
            console.log("Erreur de chargement de l'image pour niveaux de gris.");
        };
    };

    const downloadImage = () => {
        if (!image) return; // Ne rien faire si aucune image

        const link = document.createElement('a');
        link.href = image;
        link.setAttribute('download', 'image.png'); // Nom du fichier téléchargé
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Nettoyer le DOM
    };

    // Fonction pour gérer le clic sur le bouton de téléchargement (ouvre le modal)
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
                        style={{ maxWidth: '100%', maxHeight: '500px', marginTop: '20px' }}
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
                                    disableAlpha // Désactiver l'alpha si non nécessaire
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

                {/* Modal de prévisualisation */}
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
