import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  IconButton,
} from '@mui/material';
import {
  Home as HomeIcon,
  Pets as PetsIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  LocalHospital as LocalHospitalIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from '@tanstack/react-router';
import logo from '@/assets/logo.png';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Pets', icon: <PetsIcon />, path: '/pets' },
    { text: 'Owners', icon: <PeopleIcon />, path: '/owners' },
    { text: 'Organization', icon: <BusinessIcon />, path: '/organization' },
    { text: 'Treatments', icon: <LocalHospitalIcon />, path: '/treatments' },
  ];

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 260,
          boxSizing: 'border-box',
          borderRight: '1px solid #d0d7de',
          backgroundColor: '#ffffff',
        },
      }}
    >
      <Toolbar
        sx={{
          borderBottom: '1px solid #d0d7de',
          minHeight: '64px !important',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="Veteri"
          sx={{
            height: 32,
            width: 'auto',
          }}
        />
        <IconButton
          onClick={onClose}
          sx={{
            color: '#24292f',
            '&:hover': {
              backgroundColor: '#f6f8fa',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Toolbar>
      <List sx={{ paddingTop: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate({ to: item.path });
                onClose();
              }}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#f6f8fa',
                  borderLeft: '3px solid #2563eb',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
