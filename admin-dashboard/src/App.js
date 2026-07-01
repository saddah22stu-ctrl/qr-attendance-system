import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  MenuBook as MenuBookIcon,
  Assignment as AssignmentIcon,
  BarChart as BarChartIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import axios from 'axios';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import LecturesPage from './pages/LecturesPage';
import AttendancePage from './pages/AttendancePage';
import ReportsPage from './pages/ReportsPage';

const drawerWidth = 240;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:5000/api/auth/verify-token', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsLoggedIn(true);
        setUserRole(response.data.user.role);
      }
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <List>
      <ListItem button component="a" href="/" onClick={() => setMobileOpen(false)}>
        <ListItemIcon><DashboardIcon /></ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button component="a" href="/users" onClick={() => setMobileOpen(false)}>
        <ListItemIcon><PeopleIcon /></ListItemIcon>
        <ListItemText primary="Users" />
      </ListItem>
      <ListItem button component="a" href="/lectures" onClick={() => setMobileOpen(false)}>
        <ListItemIcon><MenuBookIcon /></ListItemIcon>
        <ListItemText primary="Lectures" />
      </ListItem>
      <ListItem button component="a" href="/attendance" onClick={() => setMobileOpen(false)}>
        <ListItemIcon><AssignmentIcon /></ListItemIcon>
        <ListItemText primary="Attendance" />
      </ListItem>
      <ListItem button component="a" href="/reports" onClick={() => setMobileOpen(false)}>
        <ListItemIcon><BarChartIcon /></ListItemIcon>
        <ListItemText primary="Reports" />
      </ListItem>
    </List>
  );

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Router>
      {isLoggedIn ? (
        <Box sx={{ display: 'flex' }}>
          <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>QR Attendance Admin Dashboard</Typography>
              <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
                Logout
              </Button>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" sx={{ width: drawerWidth, '& .MuiDrawer-paper': { width: drawerWidth } }}>
            <Typography variant="h6" sx={{ p: 2 }}>Admin Panel</Typography>
            {drawer}
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/lectures" element={<LecturesPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Routes>
          </Box>
        </Box>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;