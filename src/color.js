import React, { useState, useRef, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Webcam from 'react-webcam';

const recommendedColors = {
  warm: [
    { name: 'Warm/Cool1', hex: '#FFA07A' }, // Light Salmon
    { name: 'Warm/Cool2', hex: '#FF69B4' }, // Hot Pink
  ],
  cool: [
    { name: 'Cool1', hex: '#00CED1' }, // Dark Turquoise
    { name: 'Cool2', hex: '#4682B4' }, // Steel Blue
  ],
};

const IMAGE_SIZE = 220;

const ColorRecommendation = ({ palette }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [cameraImage, setCameraImage] = useState(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const colors = recommendedColors[palette] || [];

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCameraImage(imageSrc);
  }, [webcamRef]);

  const applyColorOverlay = (color) => {
    if (!cameraImage) return;

    const img = new Image();
    img.src = cameraImage;
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = IMAGE_SIZE;
      canvas.height = IMAGE_SIZE;
      ctx.drawImage(img, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
      ctx.fillStyle = color.hex;
      ctx.globalAlpha = 0.5;
      ctx.fillRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);
    };
  };

  return (
    <Box sx={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '16px' }}>
      <Typography variant="h5" sx={{ mb: '16px' }}>
        Recommended {palette.charAt(0).toUpperCase() + palette.slice(1)} Palette
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: '16px' }}>
        {colors.map((color) => (
          <Box key={color.hex} sx={{ textAlign: 'center', mx: '8px' }}>
            <Typography variant="body1">{color.name}</Typography>
            <Box
              sx={{
                width: '50px',
                height: '50px',
                backgroundColor: color.hex,
                border: '1px solid #ccc',
                display: 'inline-block',
                cursor: 'pointer',
              }}
              onClick={() => {
                setSelectedColor(color);
                applyColorOverlay(color);
              }}
            ></Box>
          </Box>
        ))}
      </Box>
      <Box>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          videoConstraints={{ width: IMAGE_SIZE, height: IMAGE_SIZE, facingMode: 'user' }}
          style={{ borderRadius: '8px', marginBottom: '16px' }}
        />
        <Button variant="contained" color="primary" onClick={capture}>
          Capture Image
        </Button>
      </Box>
      {cameraImage && (
        <Box sx={{ mt: '16px' }}>
          <Typography variant="h6">Captured Image:</Typography>
          <canvas ref={canvasRef} style={{ width: `${IMAGE_SIZE}px`, height: `${IMAGE_SIZE}px`, border: '1px solid #ccc' }}></canvas>
        </Box>
      )}
    </Box>
  );
};

export default ColorRecommendation;
