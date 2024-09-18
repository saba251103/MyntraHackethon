import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import background2 from './bg2.png';


const ColorRecommendation = () => {
  const navigate = useNavigate();
  const nav=()=>{
    navigate('/colortest');
  };
return(
  <Box sx={{ flexGrow: 1 }}>
  <Box id="home" sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'Menu', padding: '2%' }}>
          <img
            src={background2}
            alt="A girl wearing new collection clothing in a ruffle purple dress with a sunflower"
            style={{ maxWidth: '100%', marginRight: '5%' }}
          />
          </Box>
          <Button
          
        onClick={nav}
        variant="contained"
        sx={{ backgroundColor:'rgba(0, 0, 0, 0.5)', color: 'white',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
        maxWidth: '100%'  
      }}
        >
          <Typography variant="h5" sx={{ color: 'white' }}>Start Now</Typography>
        </Button>
  </Box>
);
}

export default ColorRecommendation;
