import { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Pets as PetsIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  LocalHospital as LocalHospitalIcon,
} from '@mui/icons-material';
import logo from '@/assets/logo.png';

interface TopbarProps {
  pageTitle: string;
  onToggleSidebar: () => void;
}

export function Topbar({ pageTitle, onToggleSidebar }: TopbarProps) {
  const navigate = useNavigate();
  const [createMenuAnchor, setCreateMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  const handleCreateMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setCreateMenuAnchor(event.currentTarget);
  };

  const handleCreateMenuClose = () => {
    setCreateMenuAnchor(null);
  };

  const searchSuggestions = [
    { label: 'Pets', icon: <PetsIcon fontSize="small" /> },
    { label: 'Owners', icon: <PeopleIcon fontSize="small" /> },
    { label: 'Inventory', icon: <BusinessIcon fontSize="small" /> },
    { label: 'Vademecum', icon: <LocalHospitalIcon fontSize="small" /> },
  ];

  return (
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
          onClick={onToggleSidebar}
          sx={{
            color: '#24292f',
            '&:hover': {
              backgroundColor: '#f6f8fa',
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo and Page Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            component="img"
            src={logo}
            alt="Veteri"
            onClick={() => navigate({ to: '/' })}
            sx={{
              height: 32,
              width: 'auto',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          />
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#24292f',
            }}
          >
            {pageTitle}
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
          <MenuItem
            onClick={() => {
              handleCreateMenuClose();
              navigate({ to: '/pets/new' });
            }}
          >
            New Pet
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleCreateMenuClose();
              navigate({ to: '/owners/new' });
            }}
          >
            New Owner
          </MenuItem>
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
  );
}
