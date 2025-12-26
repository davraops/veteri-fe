import {
  createFileRoute,
  useNavigate,
  Outlet,
  useMatchRoute,
} from '@tanstack/react-router';
import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Divider,
  Button,
  Chip,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { mockPets } from '@/data/mockPets';
import { mockOwners } from '@/data/mockOwners';
import { mockOrganizations } from '@/data/mockOrganizations';

export const Route = createFileRoute('/pets/$petId')({
  component: PetProfile,
  validateSearch: (
    search: Record<string, unknown>
  ): {
    name?: string;
    lastName?: string;
    organization?: string;
    ownerId?: string;
    type?: string;
    breed?: string;
    gender?: string;
    birthDate?: string;
    birthDateUnknown?: boolean;
    color?: string;
    microchip?: string;
    notes?: string;
  } => {
    return {
      name: (search.name as string) || undefined,
      lastName: (search.lastName as string) || undefined,
      organization: (search.organization as string) || undefined,
      ownerId: (search.ownerId as string) || undefined,
      type: (search.type as string) || undefined,
      breed: (search.breed as string) || undefined,
      gender: (search.gender as string) || undefined,
      birthDate: (search.birthDate as string) || undefined,
      birthDateUnknown: search.birthDateUnknown === true ? true : undefined,
      color: (search.color as string) || undefined,
      microchip: (search.microchip as string) || undefined,
      notes: (search.notes as string) || undefined,
    };
  },
});

function PetProfile() {
  const { petId } = Route.useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const search = Route.useSearch();
  const matchRoute = useMatchRoute();

  // Check if we're on a child route (like /history)
  const isHistoryRoute = matchRoute({ to: '/pets/$petId/history' });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // If we're on a child route, render the outlet
  if (isHistoryRoute) {
    return <Outlet />;
  }

  // Use data from search params if available (from verification page)
  // Otherwise, try to find pet in mock data by ID
  // In a real app, you'd fetch this from an API
  const petData =
    search && Object.keys(search).length > 0 && search.name
      ? {
          id: petId,
          name: (search.name as string) || '',
          lastName: (search.lastName as string) || '',
          organization: (search.organization as string) || '',
          assignedTo: (search.organization as string) || '',
          ownerId: search.ownerId ? parseInt(search.ownerId as string, 10) : 0,
          type: (search.type as string) || '',
          breed: (search.breed as string) || '',
          gender: (search.gender as string) || '',
          birthDate: (search.birthDate as string) || '',
          birthDateUnknown: (search.birthDateUnknown as boolean) || false,
          color: (search.color as string) || '',
          microchip: (search.microchip as string) || '',
          notes: (search.notes as string) || '',
        }
      : (() => {
          // Try to find pet in mock data
          // petId can be a number string (from mock pets) or a generated ID (from new pet creation)
          const petIdNum = parseInt(petId, 10);
          const foundPet = !isNaN(petIdNum)
            ? mockPets.find((p) => p.id === petIdNum)
            : null;

          if (foundPet) {
            return {
              id: petId,
              name: foundPet.name,
              lastName: foundPet.lastName,
              organization: foundPet.organization,
              ownerId: foundPet.ownerId,
              type: foundPet.type,
              breed: foundPet.breed,
              gender: foundPet.gender || '',
              birthDate: foundPet.birthDate || '',
              birthDateUnknown: foundPet.birthDateUnknown || false,
              color: foundPet.color || '',
              microchip: foundPet.microchip || '',
              notes: foundPet.notes || '',
            };
          }

          // Default fallback
          return {
            id: petId,
            name: 'Max',
            lastName: 'Rodriguez',
            organization: 'johndoe',
            type: 'Dog',
            breed: 'Golden Retriever',
            gender: 'Male',
            birthDate: '2020-05-15',
            birthDateUnknown: false,
            color: 'Golden',
            microchip: '123456789012345',
            notes: 'Friendly and energetic dog. Loves playing fetch.',
          };
        })();

  const getOrganizationInitials = (org: string) => {
    if (org === 'johndoe') return 'JD';
    if (org === 'mr-pet') return 'MP';
    if (org === 'vete-amigos') return 'VA';
    return org.substring(0, 2).toUpperCase();
  };

  const getOrganizationColor = (org: string) => {
    if (org === 'johndoe') return '#2563eb';
    if (org === 'mr-pet') return '#10b981';
    if (org === 'vete-amigos') return '#f97316';
    return '#57606a';
  };

  // Map organization slug to organizationId
  const getOrganizationId = (orgSlug: string): number | null => {
    // johndoe uses johndoe-org in organizations
    if (orgSlug === 'johndoe') {
      const org = mockOrganizations.find((o) => o.slug === 'johndoe-org');
      return org ? org.organizationId : null;
    }
    const org = mockOrganizations.find((o) => o.slug === orgSlug);
    return org ? org.organizationId : null;
  };

  const calculateAge = (birthDate: string | null, unknown: boolean) => {
    if (unknown || !birthDate) return 'Unknown';
    const birth = new Date(birthDate);
    const today = new Date();
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    if (months < 0) {
      return `${years - 1} years, ${12 + months} months`;
    }
    return `${years} years, ${months} months`;
  };

  // Get owner information
  const owner =
    petData.ownerId && petData.ownerId > 0
      ? mockOwners.find((o) => o.id === petData.ownerId)
      : null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar pageTitle="Pet Profile" onToggleSidebar={toggleSidebar} />
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
            maxWidth: 1000,
            margin: '0 auto',
          }}
        >
          {/* Profile Header */}
          <Paper
            sx={{
              padding: 4,
              backgroundColor: '#ffffff',
              border: '1px solid #d0d7de',
              borderRadius: '8px',
              marginBottom: 3,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                marginBottom: 3,
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: '#10b981',
                  fontSize: '32px',
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {petData.name.charAt(0).toUpperCase()}
                {petData.lastName.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flexGrow: 1, minWidth: 0, overflow: 'hidden' }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    color: '#24292f',
                    marginBottom: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '100%',
                  }}
                >
                  {petData.name} {petData.lastName}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip
                    label={`${petData.type} - ${petData.breed}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: '#d0d7de',
                      color: '#57606a',
                    }}
                  />
                </Box>
              </Box>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => {
                  // TODO: Navigate to edit page
                  console.log('Edit pet');
                }}
                sx={{
                  textTransform: 'none',
                  borderColor: '#d0d7de',
                  color: '#24292f',
                  '&:hover': {
                    borderColor: '#57606a',
                    backgroundColor: '#f6f8fa',
                  },
                }}
              >
                Edit
              </Button>
            </Box>
          </Paper>

          {/* Profile Details */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
              gap: 3,
            }}
          >
            {/* Main Details */}
            <Paper
              sx={{
                padding: 4,
                backgroundColor: '#ffffff',
                border: '1px solid #d0d7de',
                borderRadius: '8px',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#24292f',
                  marginBottom: 3,
                }}
              >
                Basic Information
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Type and Breed */}
                <Box>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#57606a',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: 1,
                    }}
                  >
                    Type & Breed
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#24292f',
                    }}
                  >
                    {petData.type} - {petData.breed}
                  </Typography>
                </Box>

                <Divider />

                {/* Gender */}
                <Box>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#57606a',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: 1,
                    }}
                  >
                    Gender
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#24292f',
                    }}
                  >
                    {petData.gender || 'Not specified'}
                  </Typography>
                </Box>

                <Divider />

                {/* Birth Date and Age */}
                <Box>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#57606a',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: 1,
                    }}
                  >
                    Birth Date
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#24292f',
                      marginBottom: 0.5,
                    }}
                  >
                    {petData.birthDateUnknown
                      ? 'Unknown'
                      : petData.birthDate
                        ? new Date(petData.birthDate).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }
                          )
                        : 'Not specified'}
                  </Typography>
                  {!petData.birthDateUnknown && petData.birthDate && (
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#57606a',
                      }}
                    >
                      Age: {calculateAge(petData.birthDate, false)}
                    </Typography>
                  )}
                </Box>

                {petData.color && (
                  <>
                    <Divider />
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#57606a',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: 1,
                        }}
                      >
                        Color
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: 500,
                          color: '#24292f',
                        }}
                      >
                        {petData.color}
                      </Typography>
                    </Box>
                  </>
                )}

                {petData.microchip && (
                  <>
                    <Divider />
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#57606a',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: 1,
                        }}
                      >
                        Microchip Number
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: 500,
                          color: '#24292f',
                          fontFamily: 'monospace',
                        }}
                      >
                        {petData.microchip}
                      </Typography>
                    </Box>
                  </>
                )}

                {petData.notes && (
                  <>
                    <Divider />
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#57606a',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: 1,
                        }}
                      >
                        Notes
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: 400,
                          color: '#24292f',
                          lineHeight: 1.6,
                        }}
                      >
                        {petData.notes}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </Paper>

            {/* Sidebar Info */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Owner Card */}
              {owner && (
                <Paper
                  sx={{
                    padding: 3,
                    backgroundColor: '#ffffff',
                    border: '1px solid #d0d7de',
                    borderRadius: '8px',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#57606a',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: 2,
                    }}
                  >
                    Owner
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.8,
                      },
                    }}
                    onClick={() => {
                      navigate({
                        to: '/owners/$ownerId',
                        params: { ownerId: String(owner.id) },
                        search: {},
                      });
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        backgroundColor: '#2563eb',
                        fontSize: '18px',
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {owner.firstName.charAt(0).toUpperCase()}
                      {owner.lastName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, minWidth: 0, overflow: 'hidden' }}>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: 500,
                          color: '#24292f',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          width: '100%',
                        }}
                      >
                        {owner.firstName} {owner.lastName}
                      </Typography>
                      {owner.email && (
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
                          {owner.email}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Paper>
              )}

              {/* Organization Card */}
              <Paper
                onClick={() => {
                  const orgId = getOrganizationId(petData.organization);
                  if (orgId) {
                    navigate({
                      to: '/organization/$organizationId',
                      params: { organizationId: String(orgId) },
                    });
                  }
                }}
                sx={{
                  padding: 3,
                  backgroundColor: '#ffffff',
                  border: '1px solid #d0d7de',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: getOrganizationColor(petData.organization),
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#57606a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: 2,
                  }}
                >
                  Organization
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      backgroundColor: getOrganizationColor(
                        petData.organization
                      ),
                      fontSize: '18px',
                      borderRadius: '8px',
                      flexShrink: 0,
                    }}
                  >
                    {getOrganizationInitials(petData.organization)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1, minWidth: 0, overflow: 'hidden' }}>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: 500,
                        color: '#24292f',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%',
                      }}
                    >
                      {petData.organization}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Quick Actions */}
              <Paper
                sx={{
                  padding: 3,
                  backgroundColor: '#ffffff',
                  border: '1px solid #d0d7de',
                  borderRadius: '8px',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#57606a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: 2,
                  }}
                >
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      textTransform: 'none',
                      justifyContent: 'flex-start',
                      borderColor: '#d0d7de',
                      color: '#24292f',
                      '&:hover': {
                        borderColor: '#57606a',
                        backgroundColor: '#f6f8fa',
                      },
                    }}
                  >
                    Add Treatment
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      textTransform: 'none',
                      justifyContent: 'flex-start',
                      borderColor: '#d0d7de',
                      color: '#24292f',
                      '&:hover': {
                        borderColor: '#57606a',
                        backgroundColor: '#f6f8fa',
                      },
                    }}
                  >
                    Schedule Appointment
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      console.log('Navigating to history with petId:', petId);
                      const targetPath = `/pets/${petId}/history`;
                      console.log('Target path:', targetPath);
                      navigate({
                        to: '/pets/$petId/history',
                        params: { petId: String(petId) },
                        replace: false,
                      })
                        .then(() => {
                          console.log('Navigation promise resolved');
                        })
                        .catch((error) => {
                          console.error('Navigation error:', error);
                          // Fallback: try direct navigation
                          window.location.href = targetPath;
                        });
                    }}
                    sx={{
                      textTransform: 'none',
                      justifyContent: 'flex-start',
                      borderColor: '#d0d7de',
                      color: '#24292f',
                      '&:hover': {
                        borderColor: '#57606a',
                        backgroundColor: '#f6f8fa',
                      },
                    }}
                  >
                    View History
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
