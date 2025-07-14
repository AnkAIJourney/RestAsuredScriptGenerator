import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Avatar,
  Grid,
  Divider,
  Paper,
  Container,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person,
  Edit,
  Save,
  Cancel,
  Email,
  Badge,
  CalendarToday,
  Security,
  Visibility,
  VisibilityOff,
  PhotoCamera,
  Delete,
  CloudUpload,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = ({ showNotification }) => {
  const { user, updateProfile, uploadProfilePicture, deleteProfilePicture, getProfilePictureUrl } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profilePictureLoading, setProfilePictureLoading] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePasswordChange = (field) => (event) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username
      });

      if (result.success) {
        setIsEditing(false);
        showNotification('Profile updated successfully!', 'success');
      } else {
        showNotification(result.message, 'error');
        if (result.errors) {
          const errorObj = {};
          result.errors.forEach(err => {
            errorObj[err.field || err.param] = err.message || err.msg;
          });
          setErrors(errorObj);
        }
      }
    } catch (error) {
      showNotification('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
      email: user?.email || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  // Profile picture handling functions
  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showNotification('Please select a valid image file (JPEG, PNG, GIF, WebP)', 'error');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('File size must be less than 5MB', 'error');
      return;
    }

    setProfilePictureLoading(true);
    try {
      const result = await uploadProfilePicture(file);
      if (result.success) {
        showNotification('Profile picture updated successfully!', 'success');
      } else {
        showNotification(result.message, 'error');
      }
    } catch (error) {
      showNotification('Failed to upload profile picture', 'error');
    } finally {
      setProfilePictureLoading(false);
    }
  };

  const handleProfilePictureDelete = async () => {
    setProfilePictureLoading(true);
    try {
      const result = await deleteProfilePicture();
      if (result.success) {
        showNotification('Profile picture removed successfully!', 'success');
      } else {
        showNotification(result.message, 'error');
      }
    } catch (error) {
      showNotification('Failed to remove profile picture', 'error');
    } finally {
      setProfilePictureLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!validatePassword()) return;

    // Note: Password update would need a separate API endpoint
    // For now, we'll just show a message
    showNotification('Password update feature coming soon!', 'info');
    setPasswordDialog(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setErrors({});
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            mb: 1
          }}
        >
          👤 My Profile
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          textAlign="center"
        >
          Manage your account information and preferences
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Overview Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 3,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              }
            }}
          >
            <CardContent sx={{ pt: 4 }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  src={user?.profilePicture ? getProfilePictureUrl(user.profilePicture) : undefined}
                  sx={{
                    width: 100,
                    height: 100,
                    margin: '0 auto',
                    bgcolor: 'primary.main',
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                    border: '3px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {!user?.profilePicture && user?.firstName?.[0]?.toUpperCase()}{!user?.profilePicture && user?.lastName?.[0]?.toUpperCase()}
                </Avatar>
                
                {/* Profile Picture Upload Button */}
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="profile-picture-upload"
                  type="file"
                  onChange={handleProfilePictureUpload}
                  disabled={profilePictureLoading}
                />
                <label htmlFor="profile-picture-upload">
                  <IconButton
                    color="primary"
                    component="span"
                    disabled={profilePictureLoading}
                    sx={{
                      position: 'absolute',
                      bottom: -5,
                      right: -5,
                      bgcolor: 'background.paper',
                      boxShadow: 2,
                      '&:hover': {
                        bgcolor: 'background.paper',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <PhotoCamera fontSize="small" />
                  </IconButton>
                </label>
                
                {/* Profile Picture Delete Button - only show if user has a profile picture */}
                {user?.profilePicture && (
                  <IconButton
                    color="error"
                    onClick={handleProfilePictureDelete}
                    disabled={profilePictureLoading}
                    sx={{
                      position: 'absolute',
                      top: -5,
                      right: -5,
                      bgcolor: 'background.paper',
                      boxShadow: 2,
                      width: 32,
                      height: 32,
                      '&:hover': {
                        bgcolor: 'background.paper',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                )}
              </Box>
              
              <Typography variant="h5" gutterBottom fontWeight="600">
                {user?.firstName} {user?.lastName}
              </Typography>
              
              <Chip
                label={`@${user?.username}`}
                color="primary"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>
              
              <Chip
                label={user?.role === 'admin' ? '👑 Admin' : '👤 User'}
                color={user?.role === 'admin' ? 'secondary' : 'default'}
                size="small"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card sx={{ mt: 3, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary" fontWeight="600">
                📊 Account Statistics
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography variant="body2" fontWeight="500">
                    {formatDate(user?.createdAt)}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Security sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Last Login
                  </Typography>
                  <Typography variant="body2" fontWeight="500">
                    {formatDate(user?.lastLogin)}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Badge sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Account Status
                  </Typography>
                  <Chip
                    label={user?.isActive ? 'Active' : 'Inactive'}
                    color={user?.isActive ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Form */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="600" color="primary">
                  ✏️ Profile Information
                </Typography>
                
                {!isEditing ? (
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => setIsEditing(true)}
                    sx={{ borderRadius: 2 }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                      disabled={loading}
                      sx={{ borderRadius: 2 }}
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      sx={{ borderRadius: 2 }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange('firstName')}
                    disabled={!isEditing}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange('lastName')}
                    disabled={!isEditing}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={formData.username}
                    onChange={handleInputChange('username')}
                    disabled={!isEditing}
                    error={!!errors.username}
                    helperText={errors.username || 'This will be your unique identifier'}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    value={formData.email}
                    disabled={true} // Email cannot be changed for security
                    variant="outlined"
                    helperText="Email cannot be changed for security reasons"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              {/* Profile Picture Section */}
              <Box mb={4}>
                <Typography variant="h6" gutterBottom fontWeight="600" color="primary">
                  📸 Profile Picture
                </Typography>
                
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                  Upload a profile picture to personalize your account. Supported formats: JPEG, PNG, GIF, WebP (max 5MB).
                </Alert>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="profile-picture-upload-button"
                    type="file"
                    onChange={handleProfilePictureUpload}
                    disabled={profilePictureLoading}
                  />
                  <label htmlFor="profile-picture-upload-button">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={profilePictureLoading ? <CloudUpload /> : <PhotoCamera />}
                      disabled={profilePictureLoading}
                      sx={{ borderRadius: 2 }}
                    >
                      {profilePictureLoading ? 'Uploading...' : 'Upload Picture'}
                    </Button>
                  </label>

                  {user?.profilePicture && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={handleProfilePictureDelete}
                      disabled={profilePictureLoading}
                      sx={{ borderRadius: 2 }}
                    >
                      Remove Picture
                    </Button>
                  )}
                </Box>

                {user?.profilePicture && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Current picture: {user.profilePictureOriginalName || 'profile-picture'}
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Security Section */}
              <Box>
                <Typography variant="h6" gutterBottom fontWeight="600" color="primary">
                  🔒 Security Settings
                </Typography>
                
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                  Keep your account secure by using a strong password and updating it regularly.
                </Alert>
                
                <Button
                  variant="outlined"
                  startIcon={<Security />}
                  onClick={() => setPasswordDialog(true)}
                  sx={{ borderRadius: 2 }}
                >
                  Change Password
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Password Change Dialog */}
      <Dialog 
        open={passwordDialog} 
        onClose={() => setPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
            backdropFilter: 'blur(20px)',
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight="600">
            🔒 Change Password
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Current Password"
              type={showPasswords.current ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={handlePasswordChange('currentPassword')}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => togglePasswordVisibility('current')}
                    edge="end"
                  >
                    {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            
            <TextField
              fullWidth
              label="New Password"
              type={showPasswords.new ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={handlePasswordChange('newPassword')}
              error={!!errors.newPassword}
              helperText={errors.newPassword || 'Minimum 6 characters'}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => togglePasswordVisibility('new')}
                    edge="end"
                  >
                    {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => togglePasswordVisibility('confirm')}
                    edge="end"
                  >
                    {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => {
              setPasswordDialog(false);
              setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
              setErrors({});
            }}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePasswordUpdate}
            sx={{ borderRadius: 2 }}
          >
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
