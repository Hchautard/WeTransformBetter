import React, { useState, useEffect } from 'react';
import ResponsiveAppBar from './appBar';
import Footer2 from './footer'
import PaintCanvas from './PaintCanvas';
import { Button, Container, Typography, TextField, MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';
import { ChromePicker } from 'react-color';

function ImagePage() {
    const [images, setImages] = useState([]);
    const [originalImages, setOriginalImages] = useState([]);
    const [imageHistory, setImageHistory] = useState([]);
    const [selectedColor, setColor] = useState('#000000');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [imageName, setImageName] = useState('');
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [isPainting, setIsPainting] = useState(false);
    const [filter, setFilter] = useState('');

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

    useEffect(() => {
        console.log("selectedColor changed:", selectedColor);
    }, [selectedColor]);
    const applyFilter = (selectedFilter) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = images[selectedImageIndex]; 
    
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
    
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
    
            switch (selectedFilter) {
                case 'grayscale':
                    for (let i = 0; i < data.length; i += 4) {
                        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                        data[i] = avg;
                        data[i + 1] = avg;
                        data[i + 2] = avg;
                    }
                    break;
                case 'sepia':
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];
    
                        data[i] = r * 0.393 + g * 0.769 + b * 0.189;
                        data[i + 1] = r * 0.349 + g * 0.686 + b * 0.168;
                        data[i + 2] = r * 0.272 + g * 0.534 + b * 0.131;
                    }
                    break;
                case 'invert':
                    for (let i = 0; i < data.length; i += 4) {
                        data[i] = 255 - data[i];
                        data[i + 1] = 255 - data[i + 1];
                        data[i + 2] = 255 - data[i + 2];
                    }
                    break;
                case 'brightness':
                    const brightnessFactor = 1.2;
                    for (let i = 0; i < data.length; i += 4) {
                        data[i] *= brightnessFactor;
                        data[i + 1] *= brightnessFactor;
                        data[i + 2] *= brightnessFactor;
                    }
                    break;
                case 'contrast':
                    const contrastFactor = 1.5;
                    const intercept = 128 * (1 - contrastFactor);
                    for (let i = 0; i < data.length; i += 4) {
                        data[i] = data[i] * contrastFactor + intercept;
                        data[i + 1] = data[i + 1] * contrastFactor + intercept;
                        data[i + 2] = data[i + 2] * contrastFactor + intercept;
                    }
                    break;
                case 'blur':
                    ctx.filter = 'blur(5px)';
                    ctx.drawImage(canvas, 0, 0);
                    break;
                default:
                    return;
            }
    
            if (selectedFilter !== 'blur') {
                ctx.putImageData(imageData, 0, 0);
            }
            const filteredImageUrl = canvas.toDataURL();
            applyModification(filteredImageUrl); 
        };
    };
    
    const handleFilterChange = (event) => {
        const selectedFilter = event.target.value;
        setFilter(selectedFilter);
        applyFilter(selectedFilter);
    };

    const loadImageFromUrl = async (url) => {
        const response = await fetch(url, { mode: 'cors' });
        const blob = await response.blob();
        const localUrl = URL.createObjectURL(blob);
        return localUrl;
    };

    const handleImageUrlSubmit = async () => {
        if (imageUrl) {
            try {
                const localImageUrl = await loadImageFromUrl(imageUrl);
                setImages([localImageUrl]);
                setOriginalImages([localImageUrl]);
                setImageHistory([localImageUrl]);
                setImageUrl('');
            } catch (error) {
                console.error("Error loading image:", error);
            }
        }
    };

    const handleImageUpload = (event) => {
        const files = event.target.files;

        if (files.length > 4) {
            alert("You can upload a maximum of 4 images.");
            return;
        }

        const fileArray = Array.from(files);
        const readerPromises = fileArray.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readerPromises)
            .then((imageUrls) => {
                setImages(imageUrls);
                setOriginalImages(imageUrls);
                setImageHistory(imageUrls);
                setImageName(fileArray[0].name.split('.')[0]);
            })
            .catch((error) => console.error("File read error", error));
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

    const applyModification = (newImage) => {
        const newImages = [...images];
        newImages[selectedImageIndex] = newImage;
        setImageHistory([...imageHistory, newImage]);
        setImages(newImages);
    };

    const changeImageColor = () => {
        if (!selectedColor || selectedImageIndex === null) {
            console.log("No color selected or no image selected.");
            return;
        }

        const rgb = hexToRgb(selectedColor);
        if (!rgb) {
            console.log("Invalid color format:", selectedColor);
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = originalImages[selectedImageIndex];

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
            applyModification(coloredImageUrl);
        };

        img.onerror = () => {
            console.log("Error loading image.");
        };
    };

    const deleteImage = () => {
        if (selectedImageIndex !== null) {
            const newImages = [...images];
            const newOriginalImages = [...originalImages];
            newImages.splice(selectedImageIndex, 1);
            newOriginalImages.splice(selectedImageIndex, 1);
            setImages(newImages);
            setOriginalImages(newOriginalImages);
            setImageHistory([]);
            setColor('#000000');
            setFilter('');
            setImageName('');
            setSelectedImageIndex(null);
        }
    };

    const rotateImage = () => {
        if (selectedImageIndex === null) return;

        const rotatedImage = document.createElement('canvas');
        const ctx = rotatedImage.getContext('2d');
        const img = new Image();
        img.src = images[selectedImageIndex];

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
            console.log("Error loading image for rotation.");
        };
    };

    const inverseImage = () => {
        if (selectedImageIndex === null) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = images[selectedImageIndex];

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
            console.log("Error loading image for inversion.");
        };
    };

    const convertToGrayscale = () => {
        if (selectedImageIndex === null) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = images[selectedImageIndex];

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
            console.log("Error loading image for grayscale.");
        };
    };

    const downloadImage = (index) => {
        if (images.length === 0) return;

        const link = document.createElement('a');
        link.href = images[index];
        link.setAttribute('download', `${imageName}-WTB.png`);
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

                <input type="file" accept="image/*" onChange={handleImageUpload} multiple />

                <TextField
                    label="Enter Image URL"
                    variant="outlined"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleImageUrlSubmit()}
                    style={{ marginTop: '10px' }}
                />
                <Button variant="contained" color="primary" onClick={handleImageUrlSubmit} style={{ marginTop: '10px' }}>
                    Load Image from URL
                </Button>

                {images.length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                        {images.map((img, index) => (
                            <div key={index} style={{ marginBottom: '20px', textAlign: 'center' }}>
                                <img
                                    src={img}
                                    alt={`Uploaded Image ${index + 1}`}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '500px',
                                        objectFit: 'contain',
                                    }}
                                    onClick={() => setSelectedImageIndex(index)}
                                />
                                <div>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => setSelectedImageIndex(index)}
                                        style={{ marginTop: '10px', marginRight: '10px' }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => downloadImage(index)}
                                        style={{ marginTop: '10px' }}
                                    >
                                        Download
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedImageIndex !== null && (
                    <div style={{ marginTop: '20px' }}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={deleteImage}
                            style={{ marginRight: '10px', marginBottom: '10px' }}
                        >
                            Delete Image
                        </Button>
                        <FormControl sx={{ marginLeft: 2, minWidth: 120 }}>
                            <InputLabel id="filter-select-label">Filter</InputLabel>
                            <Select
                                labelId="filter-select-label"
                                value={filter}
                                onChange={handleFilterChange}
                                displayEmpty
                            >
                                <MenuItem value="">None</MenuItem>
                                <MenuItem value="grayscale">Grayscale</MenuItem>
                                <MenuItem value="sepia">Sepia</MenuItem>
                                <MenuItem value="invert">Invert</MenuItem>
                                <MenuItem value="brightness">Brightness</MenuItem>
                                <MenuItem value="contrast">Contrast</MenuItem>
                                <MenuItem value="blur">Blur</MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            style={{ marginRight: '10px', marginBottom: '10px' }}
                            onClick={cancelModification}
                            disabled={imageHistory.length <= 1}
                        >
                            Undo Last Modification
                        </Button>
                        <Button
                            variant="contained"
                            style={{ marginRight: '10px', marginBottom: '10px' }}
                            onClick={rotateImage}
                        >
                            Rotate
                        </Button>
                        <Button
                            variant="contained"
                            style={{ marginRight: '10px', marginBottom: '10px' }}
                            onClick={inverseImage}
                        >
                            Invert
                        </Button>
                        <Button
                            variant="contained"
                            style={{ marginRight: '10px', marginBottom: '10px' }}
                            onClick={convertToGrayscale}
                        >
                            Grayscale
                        </Button>
                        <Button
                            variant="contained"
                            style={{ marginRight: '10px', marginBottom: '10px' }}
                            onClick={() => setIsPainting(!isPainting)}
                        >
                            {isPainting ? 'Exit Paint Mode' : 'Paint Mode'}
                        </Button>

                        {isPainting && (
                            <PaintCanvas image={images[selectedImageIndex]} applyModification={applyModification} />
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                            <ChromePicker
                                color={selectedColor}
                                onChangeComplete={(color) => {
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
                                Change Color
                            </Button>
                        </div>
                    </div>
                )}
            </Container>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                    padding: 0,
                }}
            >
                <Box sx={{ flex: 1, padding: 0 }}> 
               
                </Box>
                <Footer2 />
            </Box>
        </>
    );
}

export default ImagePage;
