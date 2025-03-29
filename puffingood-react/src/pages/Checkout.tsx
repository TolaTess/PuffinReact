import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import { RootState } from '../store';
import { clearCart } from '../store/slices/cartSlice';
import { firebaseService } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

const steps = ['Delivery Details', 'Review Order', 'Payment'];

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);
  const [activeStep, setActiveStep] = useState(0);
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    instructions: '',
  });
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleDeliveryDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryDetails({
      ...deliveryDetails,
      [e.target.name]: e.target.value,
    });
  };

  const validateDeliveryDetails = () => {
    const requiredFields = ['name', 'address', 'city', 'state', 'zipCode', 'phone'];
    const missingFields = requiredFields.filter(field => !deliveryDetails[field as keyof typeof deliveryDetails]);
    
    if (missingFields.length > 0) {
      setError('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateDeliveryDetails()) {
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePlaceOrder = async () => {
    try {
      if (!user) {
        setError('Please sign in to place an order');
        return;
      }

      const orderData = {
        userId: user.uid,
        items: items.map(item => ({
          foodId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          addons: item.addons || []  // Include addons from cart item
        })),
        total: total + 2.99, // Including delivery fee
        city: deliveryDetails.city,
        deliveryFee: 2.99,
        status: 'pending' as const,
        createdAt: new Date()
      };

      await firebaseService.createOrder(orderData);
      dispatch(clearCart());
      navigate('/orders');
    } catch (err) {
      setError('Failed to place order. Please try again.');
    }
  };

  const renderDeliveryDetails = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Full Name"
          name="name"
          value={deliveryDetails.name}
          onChange={handleDeliveryDetailsChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Delivery Address"
          name="address"
          value={deliveryDetails.address}
          onChange={handleDeliveryDetailsChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="City"
          name="city"
          value={deliveryDetails.city}
          onChange={handleDeliveryDetailsChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="State"
          name="state"
          value={deliveryDetails.state}
          onChange={handleDeliveryDetailsChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="ZIP Code"
          name="zipCode"
          value={deliveryDetails.zipCode}
          onChange={handleDeliveryDetailsChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Phone Number"
          name="phone"
          value={deliveryDetails.phone}
          onChange={handleDeliveryDetailsChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Delivery Instructions (Optional)"
          name="instructions"
          multiline
          rows={3}
          value={deliveryDetails.instructions}
          onChange={handleDeliveryDetailsChange}
        />
      </Grid>
    </Grid>
  );

  const renderOrderReview = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Items
      </Typography>
      {items.map((item) => (
        <Box key={item.id} sx={{ mb: 2 }}>
          <Typography variant="subtitle1">
            {item.name} x {item.quantity}
          </Typography>
          {item.addons && item.addons.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              Add-ons: {item.addons.map(addon => addon.name).join(', ')}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
          €{(item.price * item.quantity).toFixed(2)}
          </Typography>
        </Box>
      ))}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Subtotal</Typography>
        <Typography>${total.toFixed(2)}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Delivery Fee</Typography>
        <Typography>€2.99</Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Total</Typography>
        <Typography variant="h6">
        €{(total + 2.99).toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );

  const renderPayment = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment Details
      </Typography>
      {/* TODO: Add payment form integration (e.g., Stripe) */}
      <Typography variant="body1" color="text.secondary">
        Payment integration will be implemented here.
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          {activeStep === 0 && renderDeliveryDetails()}
          {activeStep === 1 && renderOrderReview()}
          {activeStep === 2 && renderPayment()}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep > 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            {activeStep < steps.length - 1 ? (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button variant="contained" onClick={handlePlaceOrder}>
                Place Order
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Checkout; 