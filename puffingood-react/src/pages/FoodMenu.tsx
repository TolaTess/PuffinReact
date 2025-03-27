import { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/slices/cartSlice';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

// Temporary mock data - replace with API call
const mockFoodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Classic Burger',
    description: 'Juicy beef patty with fresh lettuce, tomatoes, and special sauce',
    price: 12.99,
    image: 'https://source.unsplash.com/random/400x300/?burger',
    category: 'Burgers',
  },
  {
    id: '2',
    name: 'Chicken Sandwich',
    description: 'Crispy chicken with lettuce and mayo',
    price: 10.99,
    image: 'https://source.unsplash.com/random/400x300/?sandwich',
    category: 'Sandwiches',
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce, croutons, and parmesan cheese',
    price: 8.99,
    image: 'https://source.unsplash.com/random/400x300/?salad',
    category: 'Salads',
  },
  {
    id: '4',
    name: 'French Fries',
    description: 'Crispy golden fries with sea salt',
    price: 4.99,
    image: 'https://source.unsplash.com/random/400x300/?fries',
    category: 'Sides',
  },
];

const FoodMenu = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const categories = ['all', ...new Set(mockFoodItems.map(item => item.category))];

  const filteredItems = mockFoodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleQuantityChange = (itemId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change),
    }));
  };

  const handleAddToCart = (item: FoodItem) => {
    const quantity = quantities[item.id] || 1;
    if (quantity > 0) {
      dispatch(addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity,
        image: item.image,
      }));
      setSnackbar({
        open: true,
        message: `${quantity} ${item.name}(s) added to cart`,
      });
      setQuantities(prev => ({ ...prev, [item.id]: 0 }));
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Our Menu
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'contained' : 'outlined'}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={4}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={item.image}
                alt={item.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {item.description}
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  ${item.price.toFixed(2)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(item.id, -1)}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography>{quantities[item.id] || 0}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddToCart(item)}
                  disabled={!quantities[item.id]}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FoodMenu; 