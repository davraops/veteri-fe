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
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { mockPets } from '@/data/mockPets';

export const Route = createFileRoute('/pets/')({
  component: Pets,
});

function Pets() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [organizationFilter, setOrganizationFilter] = useState<string>('all');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const pets = mockPets;

  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      pet.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchValue.toLowerCase());

    const matchesOrganization =
      organizationFilter === 'all' || pet.organization === organizationFilter;

    return matchesSearch && matchesOrganization;
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar pageTitle="Pets" onToggleSidebar={toggleSidebar} />
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
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, color: '#24292f', marginBottom: 3 }}
          >
            All Pets
          </Typography>

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
                placeholder="Search pets by name or breed..."
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

          {/* Pets Grid */}
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
            {filteredPets.map((pet) => (
              <Box
                key={pet.id}
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #d0d7de',
                  padding: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: '#2563eb',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  },
                }}
                onClick={() => {
                  navigate({
                    to: '/pets/$petId',
                    params: { petId: String(pet.id) },
                    search: {},
                  });
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    marginBottom: 1.5,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor:
                        pet.organization === 'johndoe'
                          ? '#2563eb'
                          : pet.organization === 'mr-pet'
                            ? '#10b981'
                            : '#f97316',
                      fontSize: '14px',
                    }}
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
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#24292f',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {pet.name} {pet.lastName}
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
                      {pet.assignedTo}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#57606a',
                    marginTop: 1,
                  }}
                >
                  {pet.type} - {pet.breed}
                </Typography>
              </Box>
            ))}
          </Box>

          {filteredPets.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                padding: 4,
                color: '#57606a',
              }}
            >
              <Typography>No pets found matching your search.</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
