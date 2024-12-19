import React, { useRef, useState, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import { Box, Slider, Typography, Button } from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';


function PaintCanvas({ image, applyModification }) {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushColor, setBrushColor] = useState("#000000");
    const [brushSize, setBrushSize] = useState(5);

    useEffect(() => {
        if (!image) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = image;

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            contextRef.current = ctx;
        };
    }, [image]);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);

        // Save the modified image to the parent component when drawing stops
        const newImage = canvasRef.current.toDataURL();
        applyModification(newImage);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.strokeStyle = brushColor;
        contextRef.current.lineWidth = brushSize;
        contextRef.current.lineCap = "round";
        contextRef.current.lineJoin = "round";
        contextRef.current.stroke();
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                onMouseLeave={finishDrawing}
                style={{
                    border: '1px solid #ccc',
                    cursor: 'crosshair',
                    maxWidth: '100%',
                    marginTop: '20px'
                }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <ChromePicker
                    color={brushColor}
                    onChangeComplete={(color) => setBrushColor(color.hex)}
                    disableAlpha
                    icon={false}
                />
                <Box sx={{ ml: 3 }}>
                    <Typography gutterBottom>Brush Size</Typography>
                    <Slider
                        value={brushSize}
                        onChange={(e, newValue) => setBrushSize(newValue)}
                        min={1}
                        max={30}
                        valueLabelDisplay="auto"
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default PaintCanvas;
