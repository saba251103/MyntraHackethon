import React, { useState, useEffect } from 'react';
import { Box, Typography, Button} from '@mui/material';
import styled from '@mui/material/styles/styled';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import './App.css';

// Import your images
import image1 from './front.png';
import image2 from './image2.png'; 
import image3 from './image3.png';
import image4 from './image4.png';
import image5 from './image5.png';
import image6 from './image6.png';
import image7 from './image7.png';
import image8 from './image.png';

const Container = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  width: '100%',
});

const MainContent = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f5f5f5',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  margin: '20px auto',
  maxWidth: '800px',
});


const MainImage = styled('img')({
  width: '400px',
  height: '500px',
  borderRadius: '10px',
  marginRight: '20px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const ProductDetails = styled(Box)({
  textAlign: 'left',
  padding: '20px',
});

const Price = styled(Typography)({
 
  color: 'red',
  fontWeight: 'bold',
  fontSize: '1.5rem',
  marginBottom: '10px',
});


export default function NextPage() {
  const [currentImage, setCurrentImage] = useState(image1);

  const images = [image1, image2, image3, image4, image5, image6, image7, image8];

  useEffect(() => {
    const imageId = localStorage.getItem('imageId');
    if (imageId) {
      setCurrentImage(images[imageId - 1]);
    }
  }, [images]);


  return (
    <Box sx={{ flexGrow: 1, textAlign: 'center', justifyContent: 'center' }}>
      <MainContent>
        <Container>
          <MainImage src={currentImage} alt="" />
          <div sx={{ backgroundColor: '#D9D9D2'}} className='Buy'>
          <ProductDetails>
            <Price>₹534</Price>
            <Typography variant="body1" style={{ textDecoration: 'line-through' }}>₹2099</Typography>
            <Typography variant="body2">(Rs. 1565 OFF)</Typography>
            <Typography variant="body2">inclusive of all taxes</Typography>
            
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<ShoppingCartIcon />} 
              sx={{ marginTop: '10px', marginRight: '10px' }}
            >
              Add to Bag
            </Button>
            <Button 
              variant="outlined" 
              color="secondary" 
              startIcon={<FavoriteIcon />} 
              sx={{ marginTop: '10px' }}
            >
              Wishlist
            </Button>
          </ProductDetails>
          </div>
        </Container>
      </MainContent>
    </Box>
  );
}