import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import "./style.css"; // Assuming you have custom styles
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import colortest1 from './colortest.png';
import autumn from './autumn.png';
import spring from './spring.png';
import summer from './summer.png';
import winter from './winter.png';
import  Grid  from "@mui/material/Grid";

const IMAGE_SIZE = 220; // Fixed size for images and canvas

function Colortest() {
  const [image, setImage] = useState(null);
  const [cameraImage, setCameraImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [resimg,setresimg]=useState(null);
  const [bgRemove, setBgRemove] = useState(null);
  const [pickedColors, setPickedColors] = useState({ skin: null, hair: null, eye: null });
  const [analysisResult, setAnalysisResult] = useState('');
  const [bg, setBackgroundColor] = useState('#ffffff');
  const hiddenFileInput = useRef(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const handleRemoveBackground = async () => {
    const apiKey = "SBRUeAwAfmHigCwYX87zPqtK"
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

    const result = {
    
 
      skinTone,
      hairTone,
      eyeTone,
      jewelryType: getJewelry(skinTone), // Added jewelry type recommendation
      ColorSeason : determineSeason(skinTone, hairTone, eyeTone),
      embraceColors: getEmbraceColors(skinTone),
      avoidColors: getAvoidColors(skinTone),
    };

  
 
    setAnalysisResult(result);
  };


  
  const getJewelry = (skinTone) => {
    return skinTone == 'Warm' ? 'Gold' : 'Silver';
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

  const getSeasonPallette = (season) => {
    if (season === 'Spring') {
      return ['#f1668f', '#f8617c', '#f0dc7b', '#bbe09a', '#fac0b2','#fda67b','#fcbfb2','#d0842e','#3677af','#7c4040','#b3b0b7','#cb1428','#15acb4','#8ca1e0','#faebdf']; 
    } else if(season == 'Autumn') {
      return ['#fea41c', '#da6e1f', '#bfafa0', '#abc6a3', '#b6ae7f','#e0d5c3','#f2ebd9','#b72d26','#f87678','#815b4a','#e0b348','#315471','#5572b6','#e4bf9f','#fc7578']; 
      }
    else if(season == 'Summer'){
      return ['#bd384d', '#2a5285', '#c1d1e4', '#85a8d2', '#eee8c7','#bf163d','#8da5e3','#7eccb3','#169d99','#9cd3e2','#cde3ee','#ebd4dc','#bf478f','#bf163d','#bf163d'];
      }
    else if(season == 'Winter'){
      return ['#cac2b7', '#384d6c', '#5d55a0', '#194fb5', '#ecdec4','#f66b91','#a1274b','#7a3e60','#f5eda4','#1faad5','#158e7b','#dbcde6','#d8e5dd','#d3d9e9','#d5d8e7'];
      }
      else{
        return [];}
   
  };

  const getLipstickShade = (season) => {
    if (season === 'Spring') {
    return ['#ba5e5e','#be121e','#d33e44',' #fc4c4e','#f15278','#fa8075','#e75562','#f62221'];
    } else if(season == 'Autumn') {
      return ['#9f4835','#e76474','#7a282a','#eb574d','#c32025','#9c1003','#a44b45','#ad3419'];
    } else if(season == 'Summer'){
      return ['#d78383','#c56747','#cc3266','#e72878','#ff66ae','#a43c5d','#bb4a76','#d7708e'];
    }
    else if(season == 'Winter'){
      return ['#8d444f','#99002e','#d30015','#cf0170','#e61c66','#f65799','#df1060','#b40c57'];
    }
    else{
      return [];}
  };

  const showimage = (season) => {
    switch (season) {
      case 'Spring':
        return spring
      case 'Summer':
        return summer
      case 'Autumn':
        return autumn
      case 'Winter':
        return winter
      default:
        return '';
    }
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', maxWidth: '800px', backgroundColor: '#fff', borderRadius: '8px', padding: '24px', boxShadow: 3 }}>
  <Box className="box-decoration" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: '16px', width: '48%' }}>
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
  </Box>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  {/* Webcam Capture Section */}
  <Box className="box-decoration" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: '16px', width: '48%' }}>
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
      sx={{ width: '100%',               
        backgroundColor: '#c7b9a6',
        color: 'white',
        marginBottom: cameraImage ? '8px' : '0',
        '&:hover': {
          backgroundColor: '#b67f50', 
        }
      }}
        
    >
      Capture
    </Button>
    {cameraImage && (
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setCameraImage(null)}
        sx={{ width: '100%',               
          backgroundColor: '#c7b9a6',
          color: 'white',
          '&:hover': {
            backgroundColor: '#b67f50',
          }}}
      >
        Retake Image
      </Button>
    )}
  </Box>
</Box>
<br></br>
<div sx={{backgroundColor:'#e4dcd4'}}>
  <br/>
  <Typography variant="body1">
  Your chosen image is shown below. Select your skin, hair, and eye color by clicking on the respective areas
  </Typography>
    

</div>

      <br /><br />
{/* Displaying image */}
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', maxWidth: '800px', backgroundColor: '#fff', borderRadius: '8px', padding: '24px', boxShadow: 3 }}>
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '48%' }}>
    <canvas ref={canvasRef} onClick={pickColor} style={{ width: `${IMAGE_SIZE}px`, height: `${IMAGE_SIZE}px`, border: '1px solid #ccc', cursor: 'crosshair', border: '1px solid black' }} />
    {selectedImage && <img src={selectedImage} alt="selected" style={{ width: `${IMAGE_SIZE}px`, height: `${IMAGE_SIZE}px`, objectFit: 'cover' }} />}
  </Box>
  
  {/* Display Colors and Button */}
  <br/>
  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width: '48%' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', mb: '16px' }}>
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

    <Button variant="contained" color="secondary" onClick={resetColors}             
        sx={{ width: '100%',               
          backgroundColor: '#c7b9a6',
          color: 'white',
          '&:hover': {
            backgroundColor: '#b67f50',
          }}}>
      Edit Colors
    </Button>
    <br/>
    <Button variant="contained" color="secondary" onClick={analyzeColors} 
        sx={{ width: '100%',               
          backgroundColor: '#c7b9a6',
          color: 'white',
          '&:hover': {
            backgroundColor: '#b67f50',
          }}}>
          Analyze 
        </Button>
  </Box>
</Box>
<br/>

<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', maxWidth: '800px', backgroundColor: '#fff', borderRadius: '8px', padding: '24px', boxShadow: 3 }}>
      {/* Analysis Result */}
      {analysisResult && (
        <Box sx={{ flex: '1' }}>
          <Typography variant="h6" sx={{ mb: '8px' }}>
            <br />
            Analysis Result
          </Typography>
          <Typography variant="body1">
            Skin Tone: {analysisResult.skinTone}
          </Typography>
          <Typography variant="body1">
            Hair Tone: {analysisResult.hairTone}
          </Typography>
          <Typography variant="body1">
            Eye Tone: {analysisResult.eyeTone}
          </Typography>
          <Typography variant="body1">
            Jewelry Type: {analysisResult.jewelryType}
          </Typography>
          <Typography variant="body1">
            Season Type: {analysisResult.ColorSeason}
          </Typography>
          <Typography variant="body1" sx={{ mt: '8px' }}>
            Embrace Colors: {analysisResult.embraceColors}
          </Typography>
          <Typography variant="body1" sx={{ mt: '8px' }}>
            Avoid Colors: {analysisResult.avoidColors}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', mt: '8px', flex: '1' }}>
        <Typography variant="body2" sx={{ mb: '4px' }}>
        </Typography>
            <img
              src={showimage(analysisResult.ColorSeason)}
              alt={analysisResult.ColorSeason}
              style={{ width: '95%', height: 'auto',marginLeft:'4%' }} // Setting image to 20% of the container
            />
      </Box>
    </Box>
    <br />
    <Button
        variant="contained"
        color="secondary"
        onClick={handleRemoveBackground}
        sx={{ width: '100%',               
          backgroundColor: '#c7b9a6',
          color: 'white',
          '&:hover': {
            backgroundColor: '#b67f50',
          }}}
      >
        Try On The Colors
      </Button>
      <br/>
      <Box sx={{ display: 'flex', mt: '8px' }}>
      {/* Image and foundation section on the left */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40%', maxWidth: '400px', marginRight: '16px', backgroundColor: bg, borderRadius: '8px', padding: '24px', boxShadow: 3 }}>
        {bgRemove && (
          <Box className="border-2 border-gray-500 rounded-r-lg border-dashed flex justify-center p-2 w-40 lg:w-80" sx={{ marginBottom: '16px' }}>
            <img className="w-90 h-90" src={bgRemove} alt="img" sx={{ height: '100%', width: '100%' }} />
          </Box>
        )}
        <Typography variant="body2" sx={{ mt: '16px', mb: '4px' }}>The Foundation that suits you is:</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: '16px' }}>
          <Box sx={{ backgroundColor: pickedColors.skin || '#ccc', width: '120px', height: '100px' }}></Box>
        </Box>
        <Typography variant="body2" sx={{ textAlign: 'center', mt: '4px' }}>{pickedColors.skin}</Typography>
      </Box>

      {/* Recommendations section on the right */}
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '60%', maxWidth: '800px', backgroundColor: '#fff', borderRadius: '8px', padding: '24px', boxShadow: 3 }}>
        {/* Lipstick and seasonal color palette */}
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: '8px' }}>
          <Typography variant="body2" sx={{ mb: '4px' }}>The Lipstick that suits you are:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {getLipstickShade(analysisResult.ColorSeason).map((color, index) => (
              <Box key={index} sx={{ width: '40px', height: '40px', backgroundColor: color, borderRadius: '4px', border: '1px solid #000', mr: '4px', mb: '4px' }} onClick={() => changebackdrop(color)} />
            ))}
          </Box>
          <br />
          <Typography variant="body2" sx={{ mb: '4px' }}>The Season Palette suggested for you is:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {getSeasonPallette(analysisResult.ColorSeason).map((color, index) => (
              <Button key={index} sx={{ width: '40px', height: '40px', backgroundColor: color, borderRadius: '4px', border: '1px solid #000', mr: '4px', mb: '4px' }} onClick={() => changebackdrop(color)} />
            ))}
          </Box>
          <br />
          <Typography variant="body2" sx={{ mt: '16px', mb: '4px' }}>The Foundation that suits you is:</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: '16px' }}>
            <Box sx={{ backgroundColor: pickedColors.skin || '#ccc', width: '120px', height: '100px' }}></Box>
          </Box>
          <Typography variant="body2" sx={{ textAlign: 'center', mt: '4px' }}>{pickedColors.skin}</Typography>
        </Box>
      </Box>
    </Box> 
</Box>
    
  );
}

export default Colortest;
