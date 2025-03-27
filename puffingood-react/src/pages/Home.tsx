import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
} from '@mui/material';

// Import images
import classicImg from '../assets/puff/classic.png';
import premiumImg from '../assets/puff/premium.png';
import halfHalfImg from '../assets/puff/half-half.png';

const featuredItems = [
  {
    id: '1',
    name: 'Classic Box',
    description: 'Traditional box of Nigerian puff puff with two toppings',
    price: 6.00,
    image: classicImg,
    category: 'Puff Puff',  
    addOns: ['Chocolate', 'Strawberry'],
  },
  {
    id: '2',
    name: 'Premium Box',
    description: 'Traditional box of Nigerian puff puff with three toppings',
    price: 10.00,
    image: premiumImg,
    category: 'Puff Puff',
    addOns: ['Chocolate', 'Strawberry', 'Vanilla'],
  },
  {
    id: '3',
    name: 'Half - Half Box',
    description: 'Traditional box of Nigerian puff puff with four toppings',
    price: 12.00,
    image: halfHalfImg,
    category: 'Puff Puff',
    addOns: ['Chocolate', 'Strawberry', 'Vanilla', 'Lemon'],
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Welcome to PuffinGood
          </Typography>
          <Typography
            variant="h5"
            align="center"
            paragraph
            sx={{ mb: 4 }}
          >
            Delicious food delivered to your doorstep
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/menu')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              Order Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Items */}
      <Container maxWidth="lg">
        <Typography
          component="h2"
          variant="h4"
          align="center"
          gutterBottom
          sx={{ mb: 4 }}
        >
          Featured Items
        </Typography>
        <Grid container spacing={4}>
          {featuredItems.map((item) => (
            <Grid item key={item.id} xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image}
                  alt={item.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {item.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${item.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate('/menu')}
                  >
                    View Menu
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 