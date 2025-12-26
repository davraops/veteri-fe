import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import {
  Box,
  Typography,
  InputBase,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { mockOwners } from '@/data/mockOwners';

export const Route = createFileRoute('/owners/')({
  component: Owners,
});

function Owners() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [organizationFilter, setOrganizationFilter] = useState<string>('all');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const owners = mockOwners;

  const filteredOwners = owners.filter((owner) => {
    const matchesSearch =
      owner.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
      owner.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      owner.phones.some((phone) =>
        phone.toLowerCase().includes(searchValue.toLowerCase())
      );

    const matchesOrganization =
      organizationFilter === 'all' || owner.organization === organizationFilter;

    return matchesSearch && matchesOrganization;
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar pageTitle="Owners" onToggleSidebar={toggleSidebar} />
      <Sidebar open={sidebarOpen} onClose={toggleSidebar} />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: '#f6f8fa',
          padding: 3,
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            margin: '0 auto',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 3,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#24292f' }}>
              All Owners
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                navigate({ to: '/owners/new' });
              }}
              sx={{
                textTransform: 'none',
                backgroundColor: '#10b981',
                '&:hover': {
                  backgroundColor: '#059669',
                },
              }}
            >
              New Owner
            </Button>
          </Box>

          {/* Filters */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              marginBottom: 3,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            {/* Organization Filter */}
            <FormControl
              sx={{
                minWidth: { xs: '100%', sm: 200 },
              }}
            >
              <InputLabel>Organization</InputLabel>
              <Select
                value={organizationFilter}
                onChange={(e) => setOrganizationFilter(e.target.value)}
                label="Organization"
                sx={{
                  backgroundColor: '#ffffff',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2563eb',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2563eb',
                  },
                }}
              >
                <MenuItem value="all">All Organizations</MenuItem>
                <MenuItem value="johndoe">johndoe</MenuItem>
                <MenuItem value="mr-pet">mr-pet</MenuItem>
                <MenuItem value="vete-amigos">vete-amigos</MenuItem>
              </Select>
            </FormControl>

            {/* Search Bar */}
            <Box
              sx={{
                position: 'relative',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                border: '1px solid #d0d7de',
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                '&:hover': {
                  borderColor: '#2563eb',
                },
                '&:focus-within': {
                  borderColor: '#2563eb',
                  boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
                },
              }}
            >
              <Box
                sx={{
                  padding: '0 12px',
                  height: '100%',
                  position: 'absolute',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#57606a',
                }}
              >
                <SearchIcon />
              </Box>
              <InputBase
                placeholder="Search owners by name, email or phone..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                sx={{
                  color: '#24292f',
                  padding: '12px 12px 12px 48px',
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
          </Box>

          {/* Owners Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 2,
            }}
          >
            {filteredOwners.map((owner) => (
              <Box
                key={owner.id}
                onClick={() => {
                  navigate({
                    to: '/owners/$ownerId',
                    params: { ownerId: String(owner.id) },
                    search: {},
                  });
                }}
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #d0d7de',
                  padding: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  overflow: 'hidden',
                  '&:hover': {
                    borderColor: '#2563eb',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    marginBottom: 1.5,
                    minWidth: 0,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor:
                        owner.organization === 'johndoe'
                          ? '#2563eb'
                          : owner.organization === 'mr-pet'
                            ? '#10b981'
                            : '#f97316',
                      fontSize: '10px',
                      borderRadius: '6px',
                      flexShrink: 0,
                    }}
                  >
                    {owner.organization === 'johndoe'
                      ? 'JD'
                      : owner.organization === 'mr-pet'
                        ? 'MP'
                        : 'VA'}
                  </Avatar>
                  <Box sx={{ flexGrow: 1, minWidth: 0, overflow: 'hidden' }}>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#24292f',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%',
                      }}
                    >
                      {owner.firstName} {owner.lastName}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: '#57606a',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%',
                      }}
                    >
                      {owner.organization}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ marginTop: 1.5, minWidth: 0, overflow: 'hidden' }}>
                  <Typography
                    sx={{
                      fontSize: '13px',
                      color: '#57606a',
                      marginBottom: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%',
                    }}
                  >
                    {owner.email}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '13px',
                      color: '#57606a',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%',
                    }}
                  >
                    {owner.phones[0] || 'No phone'}
                  </Typography>
                  {owner.pets.length > 0 && (
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: '#2563eb',
                        marginTop: 1,
                        fontWeight: 500,
                      }}
                    >
                      {owner.pets.length}{' '}
                      {owner.pets.length === 1 ? 'pet' : 'pets'}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>

          {filteredOwners.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                padding: 4,
                color: '#57606a',
              }}
            >
              <Typography>No owners found matching your search.</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
