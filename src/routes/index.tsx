import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  Typography,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Home as HomeIcon,
  Pets as PetsIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  LocalHospital as LocalHospitalIcon,
  Check as CheckIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import logo from '@/assets/logo.png';

export const Route = createFileRoute('/')({
  component: Dashboard,
});

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createMenuAnchor, setCreateMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [currentDashboard, setCurrentDashboard] = useState('personal');
  const [petSearchValue, setPetSearchValue] = useState('');
  const searchRef = React.useRef<HTMLDivElement>(null);

  // Mock pets data
  const pets = [
    {
      id: 1,
      name: 'Max',
      organization: 'johndoe',
      assignedTo: 'johndoe',
      type: 'Dog',
      breed: 'Golden Retriever',
    },
    {
      id: 2,
      name: 'Luna',
      organization: 'johndoe',
      assignedTo: 'johndoe',
      type: 'Cat',
      breed: 'Persian',
    },
    {
      id: 3,
      name: 'Bella',
      organization: 'johndoe',
      assignedTo: 'johndoe',
      type: 'Dog',
      breed: 'Labrador',
    },
    {
      id: 4,
      name: 'Charlie',
      organization: 'johndoe',
      assignedTo: 'johndoe',
      type: 'Dog',
      breed: 'Beagle',
    },
    {
      id: 5,
      name: 'Milo',
      organization: 'johndoe',
      assignedTo: 'johndoe',
      type: 'Cat',
      breed: 'Siamese',
    },
    {
      id: 6,
      name: 'Daisy',
      organization: 'johndoe',
      assignedTo: 'johndoe',
      type: 'Dog',
      breed: 'Bulldog',
    },
    {
      id: 7,
      name: 'Rocky',
      organization: 'mr-pet',
      assignedTo: 'mr-pet',
      type: 'Dog',
      breed: 'German Shepherd',
    },
    {
      id: 8,
      name: 'Coco',
      organization: 'mr-pet',
      assignedTo: 'mr-pet',
      type: 'Dog',
      breed: 'Poodle',
    },
    {
      id: 9,
      name: 'Simba',
      organization: 'vete-amigos',
      assignedTo: 'vete-amigos',
      type: 'Cat',
      breed: 'Maine Coon',
    },
    {
      id: 10,
      name: 'Oreo',
      organization: 'vete-amigos',
      assignedTo: 'vete-amigos',
      type: 'Cat',
      breed: 'British Shorthair',
    },
  ];

  const filteredPets = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(petSearchValue.toLowerCase()) ||
      pet.breed.toLowerCase().includes(petSearchValue.toLowerCase())
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCreateMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setCreateMenuAnchor(event.currentTarget);
  };

  const handleCreateMenuClose = () => {
    setCreateMenuAnchor(null);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleDashboardSelect = (dashboard: string) => {
    setCurrentDashboard(dashboard);
    handleUserMenuClose();
  };

  const searchSuggestions = [
    { label: 'Pets', icon: <PetsIcon fontSize="small" /> },
    { label: 'Owners', icon: <PeopleIcon fontSize="small" /> },
    { label: 'Inventory', icon: <BusinessIcon fontSize="small" /> },
    { label: 'Vademecum', icon: <LocalHospitalIcon fontSize="small" /> },
  ];

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Pets', icon: <PetsIcon />, path: '/pets' },
    { text: 'Owners', icon: <PeopleIcon />, path: '/owners' },
    { text: 'Organization', icon: <BusinessIcon />, path: '/organization' },
    { text: 'Treatments', icon: <LocalHospitalIcon />, path: '/treatments' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Topbar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #d0d7de',
          color: '#24292f',
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          {/* Hamburger Menu */}
          <IconButton
            edge="start"
            onClick={toggleSidebar}
            sx={{
              color: '#24292f',
              '&:hover': {
                backgroundColor: '#f6f8fa',
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo and Dashboard Text */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              component="img"
              src={logo}
              alt="Veteri"
              sx={{
                height: 32,
                width: 'auto',
              }}
            />
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#24292f',
              }}
            >
              Dashboard
            </Typography>
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Search Bar */}
          <Box
            ref={searchRef}
            sx={{
              position: 'relative',
              marginRight: 2,
            }}
          >
            <Box
              sx={{
                position: 'relative',
                borderRadius: '6px',
                backgroundColor: searchFocused ? '#ffffff' : '#f6f8fa',
                border: '1px solid',
                borderColor: searchFocused ? '#2563eb' : '#d0d7de',
                display: 'flex',
                alignItems: 'center',
                width: searchFocused ? 400 : 200,
                transition: 'width 0.2s ease-in-out',
                boxShadow: searchFocused
                  ? '0 0 0 3px rgba(37, 99, 235, 0.1)'
                  : 'none',
                '&:hover': {
                  borderColor: '#2563eb',
                  backgroundColor: '#ffffff',
                },
              }}
            >
              <Box
                sx={{
                  padding: '0 8px',
                  height: '100%',
                  position: 'absolute',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#57606a',
                }}
              >
                <SearchIcon fontSize="small" />
              </Box>
              <InputBase
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={(e) => {
                  // Delay to allow clicking on suggestions
                  setTimeout(() => {
                    if (!searchRef.current?.contains(e.relatedTarget as Node)) {
                      setSearchFocused(false);
                    }
                  }, 200);
                }}
                sx={{
                  color: '#24292f',
                  padding: '8px 8px 8px 40px',
                  width: '100%',
                  fontSize: '14px',
                  '& .MuiInputBase-input': {
                    '&::placeholder': {
                      color: '#57606a',
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>

            {/* Search Suggestions Dropdown */}
            {searchFocused && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: 1,
                  backgroundColor: '#ffffff',
                  border: '1px solid #d0d7de',
                  borderRadius: '6px',
                  boxShadow: '0 8px 24px rgba(140, 149, 159, 0.2)',
                  zIndex: 1000,
                  maxHeight: 300,
                  overflow: 'auto',
                }}
                onMouseDown={(e) => e.preventDefault()}
              >
                <Box sx={{ padding: 1 }}>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#57606a',
                      padding: '8px 12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Suggestions
                  </Typography>
                  {searchSuggestions.map((suggestion) => (
                    <Box
                      key={suggestion.label}
                      onClick={() => {
                        setSearchValue(suggestion.label);
                        setSearchFocused(false);
                      }}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        padding: '8px 12px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        '&:hover': {
                          backgroundColor: '#f6f8fa',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          color: '#57606a',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {suggestion.icon}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          color: '#24292f',
                        }}
                      >
                        {suggestion.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          {/* Create New Menu */}
          <IconButton
            onClick={handleCreateMenuOpen}
            sx={{
              color: '#24292f',
              '&:hover': {
                backgroundColor: '#f6f8fa',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AddIcon />
              <ArrowDropDownIcon fontSize="small" />
            </Box>
          </IconButton>
          <Menu
            anchorEl={createMenuAnchor}
            open={Boolean(createMenuAnchor)}
            onClose={handleCreateMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleCreateMenuClose}>New Pet</MenuItem>
            <MenuItem onClick={handleCreateMenuClose}>New Owner</MenuItem>
            <MenuItem onClick={handleCreateMenuClose}>New Appointment</MenuItem>
            <MenuItem onClick={handleCreateMenuClose}>New Treatment</MenuItem>
          </Menu>

          {/* Notifications */}
          <IconButton
            sx={{
              color: '#24292f',
              '&:hover': {
                backgroundColor: '#f6f8fa',
              },
            }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile Avatar */}
          <IconButton
            sx={{
              padding: 0,
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: '#2563eb',
                fontSize: '14px',
              }}
            >
              U
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={toggleSidebar}
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
        </Toolbar>
        <List sx={{ paddingTop: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                sx={{
                  paddingY: 1.5,
                  paddingX: 3,
                  '&:hover': {
                    backgroundColor: '#f6f8fa',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#f6f8fa',
                    borderLeft: '3px solid #2563eb',
                    paddingLeft: '21px',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: '#57606a',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#24292f',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#f6f8fa',
          paddingTop: 0,
          paddingLeft: 0,
          paddingRight: 3,
          paddingBottom: 3,
          display: 'flex',
          gap: 3,
        }}
      >
        {/* Left Panel - User Info */}
        <Box
          sx={{
            width: 280,
            backgroundColor: '#ffffff',
            border: '1px solid #d0d7de',
            borderTop: 'none',
            borderLeft: 'none',
            borderTopLeftRadius: 0,
            borderTopRightRadius: '6px',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: '6px',
            padding: 3,
            height: '100%',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: '#2563eb',
              }}
              src="/api/placeholder/32/32"
              alt="johndoe"
            >
              JD
            </Avatar>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
              onClick={handleUserMenuOpen}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: '#24292f' }}
              >
                johndoe
              </Typography>
              <ArrowDropDownIcon sx={{ color: '#57606a', fontSize: '20px' }} />
            </Box>
          </Box>
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            sx={{
              '& .MuiPaper-root': {
                marginTop: 1,
                minWidth: 200,
              },
            }}
          >
            <Box
              sx={{
                padding: '8px 16px',
                borderBottom: '1px solid #d0d7de',
              }}
            >
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#57606a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Go to organization dashboard
              </Typography>
            </Box>
            <MenuItem
              onClick={() => handleDashboardSelect('personal')}
              selected={currentDashboard === 'personal'}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#f6f8fa',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  gap: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: '#2563eb',
                      fontSize: '12px',
                    }}
                    src="/api/placeholder/24/24"
                    alt="johndoe"
                  >
                    JD
                  </Avatar>
                  <Typography sx={{ fontSize: '14px' }}>johndoe</Typography>
                </Box>
                {currentDashboard === 'personal' && (
                  <CheckIcon sx={{ fontSize: '18px', color: '#2563eb' }} />
                )}
              </Box>
            </MenuItem>
            <MenuItem
              onClick={() => handleDashboardSelect('mr-pet')}
              selected={currentDashboard === 'mr-pet'}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#f6f8fa',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  gap: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: '#10b981',
                      fontSize: '12px',
                    }}
                    src="/api/placeholder/24/24"
                    alt="mr-pet"
                  >
                    MP
                  </Avatar>
                  <Typography sx={{ fontSize: '14px' }}>mr-pet</Typography>
                </Box>
                {currentDashboard === 'mr-pet' && (
                  <CheckIcon sx={{ fontSize: '18px', color: '#2563eb' }} />
                )}
              </Box>
            </MenuItem>
            <MenuItem
              onClick={() => handleDashboardSelect('vete-amigos')}
              selected={currentDashboard === 'vete-amigos'}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#f6f8fa',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  gap: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: '#f97316',
                      fontSize: '12px',
                    }}
                    src="/api/placeholder/24/24"
                    alt="vete-amigos"
                  >
                    VA
                  </Avatar>
                  <Typography sx={{ fontSize: '14px' }}>vete-amigos</Typography>
                </Box>
                {currentDashboard === 'vete-amigos' && (
                  <CheckIcon sx={{ fontSize: '18px', color: '#2563eb' }} />
                )}
              </Box>
            </MenuItem>
            <Divider />
            <Box sx={{ padding: '8px' }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<SettingsIcon />}
                onClick={() => {
                  handleUserMenuClose();
                  // TODO: Navigate to manage organizations
                }}
                sx={{
                  fontSize: '14px',
                  textTransform: 'none',
                  borderColor: '#d0d7de',
                  color: '#24292f',
                  mb: 1,
                  '&:hover': {
                    borderColor: '#2563eb',
                    backgroundColor: '#f6f8fa',
                  },
                }}
              >
                Manage organizations
              </Button>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  handleUserMenuClose();
                  // TODO: Navigate to create organization
                }}
                sx={{
                  fontSize: '14px',
                  textTransform: 'none',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#059669',
                  },
                }}
              >
                Create organization
              </Button>
            </Box>
          </Menu>

          {/* Top Pets Section */}
          <Box sx={{ mt: 4 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: '#24292f', fontSize: '16px' }}
              >
                Top Pets
              </Typography>
              <Button
                size="small"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  // TODO: Navigate to new pet
                }}
                sx={{
                  fontSize: '12px',
                  textTransform: 'none',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  padding: '4px 12px',
                  minWidth: 'auto',
                  '&:hover': {
                    backgroundColor: '#059669',
                  },
                }}
              >
                New
              </Button>
            </Box>

            {/* Pet Search Bar */}
            <Box
              sx={{
                position: 'relative',
                borderRadius: '6px',
                backgroundColor: '#f6f8fa',
                border: '1px solid #d0d7de',
                marginBottom: 2,
                display: 'flex',
                alignItems: 'center',
                '&:hover': {
                  borderColor: '#2563eb',
                },
                '&:focus-within': {
                  borderColor: '#2563eb',
                  backgroundColor: '#ffffff',
                },
              }}
            >
              <Box
                sx={{
                  padding: '0 8px',
                  height: '100%',
                  position: 'absolute',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#57606a',
                }}
              >
                <SearchIcon fontSize="small" />
              </Box>
              <InputBase
                placeholder="Find a pet..."
                value={petSearchValue}
                onChange={(e) => setPetSearchValue(e.target.value)}
                sx={{
                  color: '#24292f',
                  padding: '6px 8px 6px 32px',
                  width: '100%',
                  fontSize: '14px',
                  '& .MuiInputBase-input': {
                    '&::placeholder': {
                      color: '#57606a',
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>

            {/* Pets List */}
            <Box sx={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'auto' }}>
              {filteredPets.map((pet) => (
                <Box
                  key={pet.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    padding: '8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    mb: 0.5,
                    '&:hover': {
                      backgroundColor: '#f6f8fa',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor:
                        pet.organization === 'johndoe'
                          ? '#2563eb'
                          : pet.organization === 'mr-pet'
                            ? '#10b981'
                            : '#f97316',
                      fontSize: '10px',
                    }}
                    src={
                      pet.organization === 'johndoe'
                        ? '/api/placeholder/20/20'
                        : pet.organization === 'mr-pet'
                          ? '/api/placeholder/20/20'
                          : '/api/placeholder/20/20'
                    }
                  >
                    {pet.organization === 'johndoe'
                      ? 'JD'
                      : pet.organization === 'mr-pet'
                        ? 'MP'
                        : 'VA'}
                  </Avatar>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#24292f',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {pet.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: '#57606a',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {pet.type} - {pet.breed}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '11px',
                        color: '#57606a',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        mt: 0.25,
                      }}
                    >
                      {pet.assignedTo}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Right Panel - Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            backgroundColor: '#ffffff',
            border: '1px solid #d0d7de',
            borderRadius: '6px',
            padding: 3,
            minHeight: '400px',
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, color: '#24292f', mb: 2 }}
          >
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: '#57606a' }}>
            Welcome to Veteri Dashboard
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
