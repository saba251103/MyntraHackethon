import React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InstagramIcon from '@mui/icons-material/Instagram';
import SearchIcon from '@mui/icons-material/Search';
import FacebookIcon from '@mui/icons-material/Facebook';
import Button from '@mui/material/Button';
import logo from './logo.png';
import './App.css';
import front from './front2.png';
import divider from './divider1.png';
import image1 from './front.png';
import image2 from './image2.png';
import image3 from './image3.png';
import image4 from './image4.png';
import divider1 from './divider2.png';
import image5 from './image5.png';
import image6 from './image6.png';
import image7 from './image7.png';
import image8 from './image.png';
import { useNavigate } from 'react-router-dom';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  alignItems: 'center',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(2),
  backgroundColor: 'Menu',
  '@media all': {
    minHeight: 50,
  },
}));

const MenuButton = styled(Button)(({ theme }) => ({
  color: 'black',
  marginRight: theme.spacing(3),
}));

const ContactContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(4),
  textAlign: 'center',
  marginTop: theme.spacing(4),
}));

const ContactInfo = styled(Box)(({ theme }) => ({
  margin: '0 auto',
  maxWidth: '600px',
  textAlign: 'left',
}));

const ContactTitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'Atteron',
  marginBottom: theme.spacing(2),
}));

const ContactText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Anahaw',
  marginBottom: theme.spacing(1),
}));

export default function Home() {
    const navigate = useNavigate(); 
  const openInstagram = () => {
    window.open('https://www.instagram.com', '_blank');
  };

  const openFacebook = () => {
    window.open('https://www.facebook.com', '_blank');
  };

  const navigateToNextPage = (id) => {
    localStorage.setItem('imageId', id);
    navigate('/nextpage'); // Navigate to NextPage
  };

  const clickcolortest = () => {
    console.log('clicked');
    navigate('./colortest');
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <StyledToolbar>
            <IconButton size="large" aria-label="search">
              <SearchIcon />
            </IconButton>

            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}
            >
              <img src={logo} alt="displaying logo That Trifecta Muse" width={200} />
            </Typography>

            <IconButton size="large" aria-label="instagram" onClick={openInstagram}>
              <InstagramIcon />
            </IconButton>
            <IconButton size="large" aria-label="Facebook" onClick={openFacebook}>
              <FacebookIcon />
            </IconButton>
          </StyledToolbar>
        </AppBar>

        <AppBar position="static" sx={{ marginTop: 2 }}>
          <StyledToolbar sx={{ justifyContent: 'center' }}>
            <MenuButton href="#home" title="Home">Home</MenuButton>
            <MenuButton href="#about" title="About Us">About Us</MenuButton>
            <MenuButton href="#contact" title="Contact Us">Contact Us</MenuButton>
            <MenuButton title="Color Test" onClick={clickcolortest}>Color Test</MenuButton>
          </StyledToolbar>
        </AppBar>

        <Box id="home" sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'Menu', padding: '2%' }}>
          <img
            src={front}
            alt="A girl wearing new collection clothing in a ruffle purple dress with a sunflower"
            style={{ maxWidth: '45%', marginRight: '5%' }}
          />
          <Box sx={{ textAlign: 'left', justifyContent: 'center', justifyItems: 'left', maxWidth: '50%' }}>
            <Typography variant="body2" sx={{ textAlign: 'center', fontFamily: 'Anahaw' }}>
              Let's Shop
            </Typography>
            <Typography className='new-arrival' variant="h3" sx={{ marginBottom: '1%', textAlign: 'center', fontFamily: 'Atteron' }}>
              New <br />
              Arrivals<br />
              _________
            </Typography>
            <br />
            <Typography variant="body1">
              Welcome to That Trifecta Muse! Explore our latest collection and find your perfect style.
            </Typography>
            <br />
            <Button
              variant="outlined"
              id='1'
              sx={{ color: 'black', borderColor: 'black', display: 'block', mx: 'auto' }}
              onClick={() => navigateToNextPage(1)} // Handle button click
            >
              Shop Now
            </Button>
          </Box>
        </Box>

      </Box>
      <img
        src={divider}
        alt="Dividing components"
        style={{ maxWidth: '100%', marginLeft: 0 }}
      />
      <Box sx={{ textAlign: 'left', justifyContent: 'center', justifyItems: 'left', backgroundColor: 'Menu' }}>
        <br />
        <Typography className='new-arrival' variant="h3" sx={{ marginBottom: '1%', textAlign: 'center', fontFamily: 'Atteron' }}>
          Shop New
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
          {[image1, image2, image3, image4].map((image, index) => (
            <Box key={index} sx={{ maxWidth: '22%', textAlign: 'center' }}>
              <img
                id={`${index + 1}`}
                src={image}
                alt={`Shop New Item ${index + 1}`}
                style={{ width: '100%', cursor: 'pointer' }}
                onClick={() => navigateToNextPage(index + 1)} // Handle image click
              />
              <Typography variant="body2"></Typography>
            </Box>
          ))}
        </Box>
        <br />
      </Box>
      <img
        src={divider1}
        alt="Shop by collection"
        style={{ maxWidth: '100%', marginLeft: 0 }}
      />
      <Box id="about" sx={{ textAlign: 'left', justifyContent: 'center', justifyItems: 'left', backgroundColor: 'Menu' }}>
        <br />
        <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
          {[image5, image6, image7].map((image, index) => (
            <Box key={index} sx={{ maxWidth: '30%', textAlign: 'center' }}>
              <img
                id={`${index + 4}`}
                src={image}
                alt={`Shop Collection Item ${index + 1}`}
                style={{ width: '100%', cursor: 'pointer' }}
                onClick={() => navigateToNextPage(index + 5)} // Handle image click
              />
              <Typography className='new-arrival' variant="h3" sx={{ marginBottom: '1%', textAlign: 'center', fontFamily: 'Atteron' }}>
                {index === 0 ? 'New' : index === 1 ? 'Loved' : 'Sale'}
              </Typography>
            </Box>
          ))}
        </Box>
        <br />
        <img
          src={divider}
          alt="Shop by collection"
          style={{ maxWidth: '100%', marginLeft: 0 }}
        />
        <br />
        <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'Menu', padding: '2%' }}>
          <img
            src={image8}
            alt="A girl wearing new collection clothing in a ruffle purple dress with a sunflower"
            style={{ maxWidth: '55%', marginLeft: '5%' }}
          />
          <Box sx={{ textAlign: 'justify', justifyContent: 'center', justifyItems: 'left', maxWidth: '60%', marginLeft: '5%', marginRight: '3%' }}>
            <Typography className='new-arrival' variant="h3" sx={{ marginBottom: '1%', textAlign: 'center', fontFamily: 'Atteron' }}>
              About <br />
              Us
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center', fontFamily: 'Anahaw' }}>
              Trifecta: Where Code Meets Couture
            </Typography>
            <br />
            <Typography variant="body2">
              We are Trifecta, a team of 3 passionate students fueled by a love for coding and a desire to revolutionize the fashion experience. The Myntra Hackathon is more than just a competition; it's an opportunity to learn, collaborate, and contribute to the future of fashion. We are excited to share our ideas with the Myntra community and see how technology can shape the way we shop, style, and express ourselves through fashion.
            </Typography>
            <br />
          </Box>
        </Box>
        <br />
        <ContactContainer id="contact">
          <footer className="footer">
          <ContactInfo>
          <ContactTitle variant="h4">Contact Us</ContactTitle>
          <ContactText variant="body1">Email: support@thattrifectamuse.com</ContactText>
          <ContactText variant="body1">Phone: +123-456-7890</ContactText>
          <ContactText variant="body1">Address: 123 Fashion St, Trendy City, Fashionland</ContactText>
        </ContactInfo>

          </footer>
          <Box sx={{ marginTop: 4 }}>
            <Typography variant="body2">&copy; 2024 Trifecta. All rights reserved.</Typography>
          </Box>
        </ContactContainer>
      </Box>
    </div>
  );
}