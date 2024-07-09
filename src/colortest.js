import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import "./style.css"; // Assuming you have custom styles
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import colortest from './colortest.png';
import colortest1 from './colortest.png';


function Colortest() {
  const [image, setImage] = useState(null);
  const [cameraImage, setCameraImage] = useState(null);
  const hiddenFileInput = useRef(null);
  const webcamRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const imgname = event.target.files[0].name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = Math.max(img.width, img.height);
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          img,
          (maxSize - img.width) / 2,
          (maxSize - img.height) / 2
        );
        canvas.toBlob(
          (blob) => {
            const file = new File([blob], imgname, {
              type: "image/png",
              lastModified: Date.now(),
            });

            console.log(file);
            setImage(file);
          },
          "image/jpeg",
          0.8
        );
      };
    };
  };

  const handleUploadButtonClick = (file) => {
    var myHeaders = new Headers();
    const token = "adhgsdaksdhk938742937423";
    myHeaders.append("Authorization", `Bearer ${token}`);

    var formdata = new FormData();
    formdata.append("file", file);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch("https://trickuweb.com/upload/profile_pic", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(JSON.parse(result));
        const profileurl = JSON.parse(result);
        setImage(profileurl.img_url);
      })
      .catch((error) => console.log("error", error));
  };

  const handleClick = (event) => {
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
      })
      .catch((error) => console.log("Error capturing image from webcam:", error));
  }, [webcamRef]);

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
            <br /><br/>
            <Typography variant="body1">
              Welcome To try Korean Colortest! Explore and find your perfect style.
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
          <div onClick={handleClick} style={{ cursor: "pointer", marginBottom: '8px', position: 'relative', width: '220px', height: '200px', border: '2px dashed #ccc', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
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
            onClick={() => handleUploadButtonClick(image)}
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
          <div style={{ marginBottom: '8px', position: 'relative', width: '220px', height: '200px', border: '2px dashed #ccc', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
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
                onClick={() => handleUploadButtonClick(cameraImage)}
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
    </Box>
  );
}

export default Colortest;
