import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import "./style.css"; // Assuming you have custom styles
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import colortest1 from './colortest.png';

const IMAGE_SIZE = 220; // Fixed size for images and canvas

function Colortest() {
  const [image, setImage] = useState(null);
  const [cameraImage, setCameraImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [bgRemove, setBgRemove] = useState(null);
  const [pickedColors, setPickedColors] = useState({ skin: null, hair: null, eye: null });
  const [analysisResult, setAnalysisResult] = useState('');
  const [bg, setBackgroundColor] = useState('#ffffff');
  const hiddenFileInput = useRef(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const handleRemoveBackground = async () => {
    const apiKey = "nSHSyfmmaM4YwsqDUt1WMvDu"
    const apiUrl = "https://api.remove.bg/v1.0/removebg"

    const formData = new FormData();
    formData.append("image_file", image, image.name);
    formData.append("size", 'auto');

    try {
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'X-Api-Key': apiKey
            },
            body: formData
        })

        const data = await res.blob();

        const reader = new FileReader();
        reader.onloadend = () => setBgRemove(reader.result)
        reader.readAsDataURL(data);
    } catch (error) {
        console.log(error)
    }
}

console.log(image)

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const imgname = file.name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = IMAGE_SIZE;
        canvas.height = IMAGE_SIZE;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, (IMAGE_SIZE - img.width) / 2, (IMAGE_SIZE - img.height) / 2, img.width, img.height);
        
        canvas.toBlob((blob) => {
          const newFile = new File([blob], imgname, { type: "image/png", lastModified: Date.now() });
          setImage(newFile);
        }, "image/png", 0.8);
      };
    };
  };

  const handleUploadButtonClick = (file) => {
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const videoConstraints = {
    width: 220,
    height: 200,
    facingMode: "user"
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "camera_image.png", {
          type: "image/png",
          lastModified: Date.now(),
        });
        setCameraImage(file);
        setImage(file);
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          canvas.width = IMAGE_SIZE;
          canvas.height = IMAGE_SIZE;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
          
        };
      })
      .catch((error) => console.log("Error capturing image from webcam:", error));
  }, [webcamRef]);

  const pickColor = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const imageData = ctx.getImageData(x, y, 1, 1).data;
    
    const pickedColor = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
    setPickedColors((prevColors) => {
      if (!prevColors.skin) {
        return { ...prevColors, skin: pickedColor };
      } else if (!prevColors.hair) {
        return { ...prevColors, hair: pickedColor };
      } else if (!prevColors.eye) {
        return { ...prevColors, eye: pickedColor };
      } else {
        return prevColors;
      }
    });
  };

  const resetColors = () => {
    setPickedColors({ skin: null, hair: null, eye: null });
    setAnalysisResult('');
  };

  const analyzeColors = () => {
    const { skin, hair, eye } = pickedColors;
    if (!skin || !hair || !eye) {
      setAnalysisResult('Please pick colors for skin, hair, and eyes.');
      return;
    }

    const skinTone = getSkinTone(skin);
    const hairTone = getHairTone(hair);
    const eyeTone = getEyeTone(eye);

    const result = `
      Skin Tone: ${skinTone}
      Hair Color: ${hairTone}
      Eye Color: ${eyeTone}
      Jewelary type that suits you: ${getJewelry(skinTone)}
      Color Season : ${determineSeason(skinTone, hairTone, eyeTone)}
      Recommendations:
      Colors to Embrace: ${getEmbraceColors(skinTone)}
      Colors to Avoid: ${getAvoidColors(skinTone)}


    `;
 
    setAnalysisResult(result);
  };

  
  const getJewelry = (skinTone) => {
    return skinTone === 'Warm' ? 'Gold' : 'Silver';
  };
  const getSkinTone = (color) => {
    const rgb = color.match(/\d+/g).map(Number);
    const avg = (rgb[0] + rgb[1] + rgb[2]) / 3;
    return avg > 127 ? 'Warm' : 'Cool';
  };

  const getHairTone = (color) => {
    const rgb = color.match(/\d+/g).map(Number);
    return rgb[2] < rgb[1] ? 'Dark' : 'Light';
  };

  const getEyeTone = (color) => {
    const rgb = color.match(/\d+/g).map(Number);
    return rgb[2] < rgb[1] ? 'Deep' : 'Light';
  };

  const getEmbraceColors = (skinTone) => {
    return skinTone === 'Warm' ? 'Earthy tones, warm reds, soft pastels' : 'Cool blues, soft purples, jewel tones';
  };

  const getAvoidColors = (skinTone) => {
    return skinTone === 'Warm' ? 'Cool or muted colors' : 'Warm tones that may wash you out';
  };



  const determineSeason = (skinTone, hairTone, eyeTone) => {
    if (skinTone === 'Warm' && hairTone === 'Light' && eyeTone === 'Light') {
      return 'Spring';

    } else if (skinTone === 'Warm' && hairTone === 'Dark' && eyeTone === 'Deep') {
      return 'Autumn';
    } else if (skinTone === 'Cool' && hairTone === 'Light' && eyeTone === 'Light') {
      return 'Summer';
    } else if (skinTone === 'Cool' && hairTone === 'Dark' && eyeTone === 'Deep') {
      return 'Winter';
    } else {
      return 'Spring';
    }
  };
 const changebackdrop = (color) =>{
  setBackgroundColor(color);
 };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f5f5f5', padding: '4%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: '800px', textAlign: 'center', mb: '16px' }}>
        <Box id="home" sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'Menu', padding: '2%' }}>
          <img
            src={colortest1}
            alt="A girl wearing new collection clothing in a ruffle purple dress with a sunflower"
            style={{ maxWidth: '45%', marginRight: '5%' }}
          />
          <Box sx={{ textAlign: 'left', justifyContent: 'center', justifyItems: 'left', maxWidth: '50%' }}>
            <Typography variant="body2" sx={{ textAlign: 'center', fontFamily: 'Anahaw' }}>
              Let's Try Something New
            </Typography>
            <Typography className='new-arrival' variant="h3" sx={{ marginBottom: '1%', textAlign: 'center', fontFamily: 'Atteron' }}>
              CoLor <br />
              Test<br />
              _________
            </Typography>
            <br /><br />
            <Typography variant="body1">
              Welcome to try Korean Colortest! Explore and find your perfect style.
            </Typography>
            <br />
          </Box>
        </Box>
        <br />
        <Typography variant="h4" sx={{ fontFamily: 'Arial', mb: '16px' }}>
          Before you begin, please read the rules:
        </Typography>
        <Box sx={{ textAlign: 'left', display: 'inline-block' }}>
          <Typography variant="body2" sx={{ fontFamily: 'Arial' }}>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Rule 1: Follow the instructions carefully.</li>
              <li>Rule 2: Upload high-quality images for accurate results.</li>
            </ul>
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', width: '100%', maxWidth: '800px', backgroundColor: '#fff', borderRadius: '8px', padding: '24px', boxShadow: 3, flexWrap: 'wrap' }}>
        <Box className="box-decoration" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: '16px', width: '100%', maxWidth: '360px' }}>
          <label htmlFor="image-upload-input" className="image-upload-label" style={{ marginBottom: '8px' }}>
            {image ? image.name : "Choose an image"}
          </label>
          <div onClick={handleClick} style={{ cursor: "pointer", marginBottom: '8px', position: 'relative', width: `${IMAGE_SIZE}px`, height: `${IMAGE_SIZE}px`, border: '2px dashed #ccc', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
            {image ? (
              <img src={URL.createObjectURL(image)} alt="uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <InsertPhotoIcon fontSize="large" className="img-display-before" />
            )}
            <input
              id="image-upload-input"
              type="file"
              onChange={handleImageChange}
              ref={hiddenFileInput}
              style={{ display: "none" }}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRemoveBackground}
            sx={{ width: '100%' }}
          >
            Upload
          </Button>
        </Box>

        {/* Webcam Capture Section */}
        <Box className="box-decoration" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: '16px', width: '100%', maxWidth: '360px' }}>
          <label htmlFor="camera-input" className="image-upload-label" style={{ marginBottom: '8px' }}>
            {cameraImage ? cameraImage.name : "Take a photo"}
          </label>
          <div style={{ marginBottom: '8px', position: 'relative', width: `${IMAGE_SIZE}px`, height: `${IMAGE_SIZE}px`, border: '2px dashed #ccc', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
            {cameraImage ? (
              <img src={URL.createObjectURL(cameraImage)} alt="camera capture" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Webcam
                audio={false}
                height={200}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={220}
                videoConstraints={videoConstraints}
                style={{ borderRadius: '8px' }}
              />
            )}
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={capture}
            sx={{ width: '100%', marginBottom: cameraImage ? '8px' : '0' }}
          >
            Capture
          </Button>
          {cameraImage && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRemoveBackground}
                sx={{ width: '100%', marginBottom: '8px' }}
              >
                Upload
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setCameraImage(null)}
                sx={{ width: '100%' }}
              >
                Retake Image
              </Button>
            </>
          )}
        </Box>
      </Box>
      <br />
      {/* Displaying image */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', width: '100%', maxWidth: '800px', backgroundColor: '#fff', borderRadius: '8px', padding: '24px', boxShadow: 3, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: '16px', width: '100%', maxWidth: '360px' }}>
          <canvas ref={canvasRef} onClick={pickColor} style={{ width: `${IMAGE_SIZE}px`, height: `${IMAGE_SIZE}px`, border: '1px solid #ccc' ,cursor: 'crosshair', border: '1px solid black' }} />
          {selectedImage && <img src={selectedImage} alt="selected" style={{ width: `${IMAGE_SIZE}px`, height: `${IMAGE_SIZE}px`, objectFit: 'cover' }} />}
        </Box>
      </Box>
      {/* Display Colors */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', maxWidth: '800px', mt: '16px' }}>
        <Box sx={{ textAlign: 'center', width: '120px', height: '100px', backgroundColor: pickedColors.skin || '#ccc' }}>
          <Typography variant="body2" sx={{ color: 'white' }}>Skin Color</Typography>
          <Typography variant="body2" sx={{ color: 'white' }}>{pickedColors.skin}</Typography>
        </Box>
        
        <Box sx={{ textAlign: 'center', width: '120px', height: '100px', backgroundColor: pickedColors.hair || '#ccc' }}>
          <Typography variant="body2" sx={{ color: 'white' }}>Hair Color</Typography>
          <Typography variant="body2" sx={{ color: 'white' }}>{pickedColors.hair}</Typography>
        </Box>
        <Box sx={{ textAlign: 'center', width: '120px', height: '100px', backgroundColor: pickedColors.eye || '#ccc' }}>
          <Typography variant="body2" sx={{ color: 'white' }}>Eye Color</Typography>
          <Typography variant="body2" sx={{ color: 'white' }}>{pickedColors.eye}</Typography>
        </Box>
      </Box>

      {/* Edit Colors */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: '800px', mt: '16px' }}>
        <Button variant="contained" color="secondary" onClick={resetColors} sx={{ width: '100%' }}>
          Edit Colors
        </Button>
      </Box>

      {/* Analyze */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: '800px', mt: '16px' }}>
        <Button variant="contained" color="secondary" onClick={analyzeColors} sx={{ width: '100%' }}>
          Analyze 
        </Button>
      </Box>

      {/* Analysis Result */}
      {analysisResult && (
        <Box sx={{ mt: '16px', p: 2, border: '1px solid #ccc', borderRadius: '4px', width: '100%', maxWidth: '800px', backgroundColor: '#fff' }}>
          <Typography variant="h6">Analysis Result:</Typography>
          <Typography>{analysisResult}</Typography>
        </Box>
      )}
      <br/>
      {/* Background removal */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', width: '20%', maxWidth: '800px', backgroundColor: bg, borderRadius: '8px', padding: '24px', boxShadow: 3, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: '16px', width: '100%', maxWidth: '360px' }}>
     
      {bgRemove && <div className="border-2 border-gray-500 rounded-r-lg border-dashed flex justify-center p-2 w-40 lg:w-80">
                            <img className="w-90 h-90" src={bgRemove} alt="img" sx={{height:'49%',width: '400px',marginLeft: '10px'}}/>
                        </div>}
    </Box>
    </Box>
    <Box sx={{ mt: 2 }}>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => changebackdrop('pink')}
              sx={{ marginRight: '8px', backgroundColor: '#FFB6C1', '&:hover': { backgroundColor: '#FF69B4' } }}
            >
              Change to Pink
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => changebackdrop('blue')}
              sx={{ marginRight: '8px', backgroundColor: '#ADD8E6', '&:hover': { backgroundColor: '#87CEEB' } }}
            >
              Change to Blue
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => changebackdrop('green')}
              sx={{ marginRight: '8px', backgroundColor: '#90EE90', '&:hover': { backgroundColor: '#32CD32' } }}
            >
              Change to Green
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => changebackdrop('purple')}
              sx={{ backgroundColor: '#DDA0DD', '&:hover': { backgroundColor: '#EE82EE' } }}
            >
              Change to Purple
            </Button>
          </Box>
</Box>
    </Box>
    
  );
}

export default Colortest;
