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
  CalendarToday as CalendarTodayIcon,
  MenuBook as MenuBookIcon,
  Close as CloseIcon,
  Healing as SurgeryIcon,
  Logout as LogoutIcon,
  Inventory2 as InventoryIcon,
  Assignment as ProceduresIcon,
  Vaccines as VaccinesIcon,
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
    {
      text: 'Appointments',
      icon: <CalendarTodayIcon />,
      path: '/appointments',
    },
    { text: 'Surgeries', icon: <SurgeryIcon />, path: '/surgeries' },
    { text: 'Vaccinations', icon: <VaccinesIcon />, path: '/vaccinations' },
    { text: 'Organization', icon: <BusinessIcon />, path: '/organization' },
    { text: 'Treatments', icon: <LocalHospitalIcon />, path: '/treatments' },
    { text: 'Procedures', icon: <ProceduresIcon />, path: '/procedures' },
    { text: 'Vademecum', icon: <MenuBookIcon />, path: '/vademecum' },
    { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 64px)',
          justifyContent: 'space-between',
        }}
      >
        <List sx={{ paddingTop: 2, flexGrow: 1, overflow: 'auto' }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate({ to: item.path });
                  onClose();
                }}
                selected={
                  location.pathname === item.path ||
                  (item.path === '/organization' &&
                    location.pathname.startsWith('/organization')) ||
                  (item.path === '/appointments' &&
                    location.pathname.startsWith('/appointments')) ||
                  (item.path === '/surgeries' &&
                    location.pathname.startsWith('/surgeries')) ||
                  (item.path === '/vaccinations' &&
                    location.pathname.startsWith('/vaccinations')) ||
                  (item.path === '/procedures' &&
                    location.pathname.startsWith('/procedures')) ||
                  (item.path === '/vademecum' &&
                    location.pathname.startsWith('/vademecum')) ||
                  (item.path === '/inventory' &&
                    location.pathname.startsWith('/inventory'))
                }
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

        {/* Logout Button */}
        <Box
          sx={{
            borderTop: '1px solid #d0d7de',
            padding: 0,
            flexShrink: 0,
          }}
        >
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate({ to: '/login' });
                onClose();
              }}
              sx={{
                color: '#ef4444',
                '&:hover': {
                  backgroundColor: '#fef2f2',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#ef4444' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </Box>
      </Box>
    </Drawer>
  );
}
