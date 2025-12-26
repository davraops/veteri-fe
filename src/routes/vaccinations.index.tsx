import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputBase,
} from '@mui/material';
import {
  Add as AddIcon,
  Vaccines as VaccinesIcon,
  Search as SearchIcon,
  CalendarToday as CalendarTodayIcon,
  Pets as PetsIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import {
  mockMedicalHistory,
  MedicalHistoryEntry,
} from '@/data/mockMedicalHistory';
import { mockOrganizations } from '@/data/mockOrganizations';
import { mockPets } from '@/data/mockPets';

export const Route = createFileRoute('/vaccinations/')({
  component: Vaccinations,
});

// Current user ID (in a real app, this would come from auth context)
const currentUserId = 'johndoe';

function Vaccinations() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Map organization slug to data organization identifier
  const getDataOrgId = (orgSlug: string) => {
    if (orgSlug === 'johndoe-org') return 'johndoe';
    return orgSlug;
  };

  // Get organizations where current user is a member
  const userOrganizations = useMemo(
    () =>
      mockOrganizations
        .filter((org) => {
          const userMember = org.members.find(
            (member) => member.userId === currentUserId
          );
          return userMember !== undefined;
        })
        .map((org) => ({
          ...org,
          dataOrgId: getDataOrgId(org.slug),
        })),
    []
  );

  // Initialize selected organization with default value
  const [selectedOrganization, setSelectedOrganization] = useState<string>(
    userOrganizations.length > 0 ? userOrganizations[0].dataOrgId : ''
  );

  // Get organization color
  const getOrganizationColor = (orgSlug: string) => {
    const org = mockOrganizations.find((o) => {
      const dataOrgId = getDataOrgId(o.slug);
      return dataOrgId === orgSlug;
    });
    return org ? org.color : '#57606a';
  };

  // Get all vaccinations from medical history
  const allVaccinations = useMemo(() => {
    const vaccinations: Array<
      MedicalHistoryEntry & {
        pet: (typeof mockPets)[0] | undefined;
        organization: string;
      }
    > = [];

    Object.values(mockMedicalHistory).forEach((entries) => {
      entries.forEach((entry) => {
        if (entry.type === 'vaccination') {
          const pet = mockPets.find((p) => p.id === entry.petId);
          // Get organization from pet
          const organization = pet?.organization || '';
          vaccinations.push({ ...entry, pet, organization });
        }
      });
    });

    return vaccinations.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; // Most recent first
    });
  }, []);

  // Filter vaccinations
  const filteredVaccinations = useMemo(() => {
    if (!selectedOrganization) return [];

    return allVaccinations.filter((vaccination) => {
      // Filter by organization
      if (vaccination.organization !== selectedOrganization) return false;

      // Filter by search
      if (searchValue === '') return true;

      const searchLower = searchValue.toLowerCase();
      return (
        vaccination.title.toLowerCase().includes(searchLower) ||
        vaccination.pet?.name.toLowerCase().includes(searchLower) ||
        vaccination.pet?.lastName.toLowerCase().includes(searchLower) ||
        vaccination.medications?.some((med) =>
          med.name.toLowerCase().includes(searchLower)
        ) ||
        vaccination.professional.name.toLowerCase().includes(searchLower)
      );
    });
  }, [allVaccinations, selectedOrganization, searchValue]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const orgColor = selectedOrganization
    ? getOrganizationColor(selectedOrganization)
    : '#57606a';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar pageTitle="Vaccinations" onToggleSidebar={toggleSidebar} />
      <Sidebar open={sidebarOpen} onClose={toggleSidebar} />

      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: '#f6f8fa',
          padding: 3,
        }}
      >
        <Box
          sx={{
            maxWidth: 1400,
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
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: '#24292f', marginBottom: 1 }}
              >
                Vaccinations
              </Typography>
              <Typography sx={{ color: '#57606a', fontSize: '14px' }}>
                View and manage vaccination records
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                navigate({ to: '/vaccinations/new' });
              }}
              sx={{
                textTransform: 'none',
                backgroundColor: '#10b981',
                '&:hover': {
                  backgroundColor: '#059669',
                },
              }}
            >
              New Vaccination
            </Button>
          </Box>

          {/* Organization Selector and Search */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '300px 1fr' },
              gap: 2,
              marginBottom: 3,
            }}
          >
            {userOrganizations.length > 0 && (
              <FormControl fullWidth>
                <InputLabel>Organization</InputLabel>
                <Select
                  value={selectedOrganization}
                  onChange={(e) => {
                    setSelectedOrganization(e.target.value);
                    setSearchValue('');
                  }}
                  label="Organization"
                  sx={{
                    backgroundColor: '#ffffff',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: orgColor,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: orgColor,
                    },
                  }}
                >
                  {userOrganizations.map((org) => (
                    <MenuItem key={org.organizationId} value={org.dataOrgId}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: org.color,
                          }}
                        />
                        {org.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Paper
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px',
                backgroundColor: '#ffffff',
                border: '1px solid #d0d7de',
                borderRadius: '6px',
              }}
            >
              <SearchIcon sx={{ color: '#57606a', marginRight: 1 }} />
              <InputBase
                placeholder="Search vaccinations..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                sx={{
                  flex: 1,
                  fontSize: '14px',
                  '& .MuiInputBase-input': {
                    '&::placeholder': {
                      color: '#57606a',
                      opacity: 1,
                    },
                  },
                }}
              />
            </Paper>
          </Box>

          {/* Vaccinations List */}
          {filteredVaccinations.length > 0 ? (
            <Box
              sx={{
                display: 'grid',
                gap: 2,
              }}
            >
              {filteredVaccinations.map((vaccination) => (
                <Paper
                  key={vaccination.id}
                  sx={{
                    padding: 3,
                    backgroundColor: '#ffffff',
                    border: '1px solid #d0d7de',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: orgColor,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                  onClick={() => {
                    if (vaccination.pet) {
                      navigate({
                        to: '/pets/$petId',
                        params: { petId: String(vaccination.pet.id) },
                      });
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 2,
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          marginBottom: 1,
                        }}
                      >
                        <VaccinesIcon
                          sx={{ color: '#10b981', fontSize: '20px' }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: '#24292f',
                          }}
                        >
                          {vaccination.title}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          marginTop: 1,
                          flexWrap: 'wrap',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <CalendarTodayIcon
                            sx={{ fontSize: '16px', color: '#57606a' }}
                          />
                          <Typography
                            sx={{ fontSize: '13px', color: '#57606a' }}
                          >
                            {formatDate(vaccination.date)}
                            {vaccination.time && ` • ${vaccination.time}`}
                          </Typography>
                        </Box>
                        {vaccination.pet && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <PetsIcon
                              sx={{ fontSize: '16px', color: '#57606a' }}
                            />
                            <Typography
                              sx={{ fontSize: '13px', color: '#24292f' }}
                            >
                              {vaccination.pet.name} {vaccination.pet.lastName}
                            </Typography>
                            <Chip
                              label={vaccination.pet.type}
                              size="small"
                              sx={{
                                fontSize: '10px',
                                height: 20,
                                backgroundColor: '#f6f8fa',
                                color: '#57606a',
                                marginLeft: 0.5,
                              }}
                            />
                          </Box>
                        )}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <PersonIcon
                            sx={{ fontSize: '16px', color: '#57606a' }}
                          />
                          <Typography
                            sx={{ fontSize: '13px', color: '#57606a' }}
                          >
                            {vaccination.professional.name}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Chip
                      label="Vaccination"
                      size="small"
                      sx={{
                        backgroundColor: '#10b98115',
                        color: '#10b981',
                        fontWeight: 600,
                        fontSize: '11px',
                      }}
                    />
                  </Box>

                  {/* Vaccines Applied */}
                  {vaccination.medications &&
                    vaccination.medications.length > 0 && (
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          sx={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#57606a',
                            textTransform: 'uppercase',
                            marginBottom: 1,
                          }}
                        >
                          Vaccines Applied
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                          }}
                        >
                          {vaccination.medications.map((med, index) => (
                            <Chip
                              key={index}
                              label={`${med.name} - ${med.dosage} (${med.duration})`}
                              size="small"
                              sx={{
                                fontSize: '11px',
                                backgroundColor: '#f0fdf4',
                                color: '#059669',
                                border: '1px solid #bbf7d0',
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                  {/* Notes */}
                  {vaccination.notes && (
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#57606a',
                          textTransform: 'uppercase',
                          marginBottom: 0.5,
                        }}
                      >
                        Notes
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          color: '#24292f',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {vaccination.notes}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              ))}
            </Box>
          ) : (
            <Paper
              sx={{
                padding: 6,
                textAlign: 'center',
                backgroundColor: '#ffffff',
                border: '1px solid #d0d7de',
                borderRadius: '8px',
              }}
            >
              <VaccinesIcon
                sx={{ fontSize: 64, color: '#d0d7de', marginBottom: 2 }}
              />
              <Typography
                variant="h6"
                sx={{ marginBottom: 1, color: '#24292f' }}
              >
                {selectedOrganization
                  ? 'No vaccinations found'
                  : 'Select an organization'}
              </Typography>
              <Typography sx={{ color: '#57606a', marginBottom: 3 }}>
                {selectedOrganization
                  ? 'No vaccination records found for this organization.'
                  : 'Please select an organization to view vaccinations.'}
              </Typography>
              {selectedOrganization && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    navigate({ to: '/vaccinations/new' });
                  }}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: '#10b981',
                    '&:hover': {
                      backgroundColor: '#059669',
                    },
                  }}
                >
                  New Vaccination
                </Button>
              )}
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
}
