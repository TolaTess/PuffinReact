import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useFoods, useUserOrders } from '../hooks/useFirestore';
import { firebaseService } from '../services/firebase';
import { isAdmin } from '../utils/admin';
import { Food, Order } from '../types';
import UserManagement from '../components/UserManagement';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { foods, loading: foodsLoading, error: foodsError } = useFoods();
  const { orders, loading: ordersLoading, error: ordersError } = useUserOrders(true);
  
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Food | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imagePath: '',
  });

  useEffect(() => {
    if (!user || !isAdmin(user)) {
      navigate('/');
      return;
    }
    setLoading(false);
  }, [user, navigate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (item?: Food) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        category: item.category,
        imagePath: item.imagePath,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        imagePath: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingItem) {
        await firebaseService.updateFood(editingItem.id!, {
          ...formData,
          price: parseFloat(formData.price),
        });
      } else {
        await firebaseService.addFood({
          ...formData,
          price: parseFloat(formData.price),
          isAvailable: true,
          addons: [],
        });
      }
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save menu item. Please try again.');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await firebaseService.deleteFood(id);
    } catch (err) {
      setError('Failed to delete menu item. Please try again.');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await firebaseService.updateOrderStatus(orderId, newStatus);
    } catch (err) {
      setError('Failed to update order status. Please try again.');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading || foodsLoading || ordersLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || foodsError || ordersError) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error || foodsError || ordersError}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Admin Dashboard
          </Typography>
        </Box>

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Orders" />
          <Tab label="Menu Items" />
          <Tab label="Users" />
        </Tabs>

        {activeTab === 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{order.userId}</TableCell>
                    <TableCell>
                      {order.items.map((item, index) => (
                        <div key={`${order.id}-${item.foodId || index}`}>
                          {item.quantity}x {item.name}
                          {item.addons && item.addons.length > 0 && (
                            <div style={{ fontSize: '0.8em', color: '#666' }}>
                              Addons: {item.addons.map(addon => addon.name).join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>${(order.total || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => handleUpdateOrderStatus(order.id!, 'processing')}
                        disabled={order.status !== 'pending'}
                        sx={{ mr: 1 }}
                      >
                        Start Processing
                      </Button>
                      <Button
                        size="small"
                        onClick={() => handleUpdateOrderStatus(order.id!, 'completed')}
                        disabled={order.status !== 'processing'}
                        sx={{ mr: 1 }}
                      >
                        Mark Complete
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleUpdateOrderStatus(order.id!, 'cancelled')}
                        disabled={order.status === 'completed' || order.status === 'cancelled'}
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {activeTab === 1 && (
          <>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Add Menu Item
              </Button>
            </Box>
            <Grid container spacing={3}>
              {foods.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography color="textSecondary">{item.description}</Typography>
                      <Typography variant="h6">${(item.price || 0).toFixed(2)}</Typography>
                    </CardContent>
                    <Box sx={{ p: 2 }}>
                      <IconButton onClick={() => handleOpenDialog(item)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteItem(item.id!)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {activeTab === 2 && <UserManagement />}

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleFormChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Image Path"
              name="imagePath"
              value={formData.imagePath}
              onChange={handleFormChange}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default AdminDashboard; 