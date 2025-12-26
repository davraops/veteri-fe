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
import {
  Edit as EditIcon,
  Vaccines as VaccinesIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
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
          vaccinations: undefined,
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
              vaccinations: foundPet.vaccinations || [],
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
            vaccinations: [],
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

  // Get vaccinations
  const vaccinations = petData.vaccinations || [];

  // Check if any vaccination is due soon (within 30 days)
  const getVaccinationStatus = (nextDueDate?: string) => {
    if (!nextDueDate) return 'unknown';
    const dueDate = new Date(nextDueDate);
    const today = new Date();
    const daysUntilDue = Math.ceil(
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue <= 30) return 'due_soon';
    return 'current';
  };

  // Get recommended vaccinations based on species and best practices
  const getRecommendedVaccinations = (species: string) => {
    const speciesLower = species.toLowerCase();

    if (speciesLower === 'dog') {
      return [
        {
          name: 'DHPP',
          category: 'Core',
          frequency: 'Annual',
          description: 'Distemper, Hepatitis, Parvovirus, Parainfluenza',
        },
        {
          name: 'Rabies',
          category: 'Core',
          frequency: '1-3 years',
          description: 'Required by law in most areas',
        },
        {
          name: 'Bordetella',
          category: 'Non-Core',
          frequency: 'Annual',
          description: 'Kennel cough prevention',
        },
        {
          name: 'Lyme',
          category: 'Non-Core',
          frequency: 'Annual',
          description: 'Recommended in tick-endemic areas',
        },
        {
          name: 'Leptospirosis',
          category: 'Non-Core',
          frequency: 'Annual',
          description: 'Bacterial disease prevention',
        },
        {
          name: 'Canine Influenza',
          category: 'Non-Core',
          frequency: 'Annual',
          description: 'Dog flu prevention',
        },
      ];
    } else if (speciesLower === 'cat') {
      return [
        {
          name: 'FVRCP',
          category: 'Core',
          frequency: 'Annual',
          description:
            'Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia',
        },
        {
          name: 'Rabies',
          category: 'Core',
          frequency: '1-3 years',
          description: 'Required by law in most areas',
        },
        {
          name: 'Feline Leukemia',
          category: 'Non-Core',
          frequency: 'Annual',
          description: 'Recommended for outdoor cats',
        },
        {
          name: 'FIV',
          category: 'Non-Core',
          frequency: 'As needed',
          description: 'Feline Immunodeficiency Virus',
        },
      ];
    }

    return [];
  };

  // Get pending vaccinations (recommended but not administered or expired)
  const getPendingVaccinations = () => {
    const recommended = getRecommendedVaccinations(petData.type);
    const pending: Array<{
      name: string;
      category: string;
      frequency: string;
      description: string;
      reason: string;
    }> = [];

    recommended.forEach((rec) => {
      // Normalize names for comparison (handle variations like "Rabies" vs "Rabies Vaccine")
      const normalizeName = (name: string) => {
        return name
          .toLowerCase()
          .replace(/\s+/g, ' ')
          .replace(/\b(vaccine|vaccination|shot)\b/gi, '')
          .trim();
      };

      const recNameNormalized = normalizeName(rec.name);

      // Check if pet has this vaccination
      const existingVaccination = vaccinations.find((v) => {
        const vacNameNormalized = normalizeName(v.name);
        return vacNameNormalized === recNameNormalized;
      });

      if (!existingVaccination) {
        // Vaccination never administered
        pending.push({
          ...rec,
          reason: 'Not administered',
        });
      } else if (existingVaccination.nextDueDate) {
        // Check if vaccination is expired
        const status = getVaccinationStatus(existingVaccination.nextDueDate);
        if (status === 'overdue') {
          pending.push({
            ...rec,
            reason: 'Overdue - needs booster',
          });
        }
      } else {
        // Vaccination exists but no next due date - might need initial series completion
        // For now, we'll consider it pending if it's a core vaccine without next due date
        if (rec.category === 'Core') {
          pending.push({
            ...rec,
            reason: 'May need booster or completion',
          });
        }
      }
    });

    return pending;
  };

  const pendingVaccinations = getPendingVaccinations();

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

          {/* Vaccinations Section - List Format */}
          {vaccinations.length > 0 && (
            <Paper
              sx={{
                padding: 3,
                backgroundColor: '#ffffff',
                border: '1px solid #d0d7de',
                borderRadius: '8px',
                marginTop: 3,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  marginBottom: 2.5,
                }}
              >
                <VaccinesIcon
                  sx={{
                    color: getOrganizationColor(petData.organization),
                    fontSize: '22px',
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#24292f',
                  }}
                >
                  Vaccinations
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {vaccinations.map((vaccination, index) => {
                  const status = getVaccinationStatus(vaccination.nextDueDate);
                  const isOverdue = status === 'overdue';
                  const isDueSoon = status === 'due_soon';

                  return (
                    <Box key={vaccination.id}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          padding: 2,
                          borderRadius: '6px',
                          backgroundColor: isOverdue
                            ? '#fee2e2'
                            : isDueSoon
                              ? '#fef3c7'
                              : '#f6f8fa',
                          border: `1px solid ${
                            isOverdue
                              ? '#dc2626'
                              : isDueSoon
                                ? '#f59e0b'
                                : '#e1e4e8'
                          }`,
                          '&:hover': {
                            backgroundColor: isOverdue
                              ? '#fecaca'
                              : isDueSoon
                                ? '#fde68a'
                                : '#f0f0f0',
                          },
                        }}
                      >
                        {/* Status Icon */}
                        <Box sx={{ flexShrink: 0 }}>
                          {isOverdue ? (
                            <WarningIcon
                              sx={{ color: '#dc2626', fontSize: '24px' }}
                            />
                          ) : isDueSoon ? (
                            <WarningIcon
                              sx={{ color: '#f59e0b', fontSize: '24px' }}
                            />
                          ) : (
                            <CheckCircleIcon
                              sx={{ color: '#10b981', fontSize: '24px' }}
                            />
                          )}
                        </Box>

                        {/* Vaccination Info */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              marginBottom: 0.5,
                              flexWrap: 'wrap',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '16px',
                                fontWeight: 600,
                                color: '#24292f',
                              }}
                            >
                              {vaccination.name}
                            </Typography>
                            {isOverdue && (
                              <Chip
                                label="Overdue"
                                size="small"
                                sx={{
                                  backgroundColor: '#dc2626',
                                  color: '#ffffff',
                                  fontSize: '10px',
                                  height: '20px',
                                  fontWeight: 600,
                                }}
                              />
                            )}
                            {isDueSoon && !isOverdue && (
                              <Chip
                                label="Due Soon"
                                size="small"
                                sx={{
                                  backgroundColor: '#f59e0b',
                                  color: '#ffffff',
                                  fontSize: '10px',
                                  height: '20px',
                                  fontWeight: 600,
                                }}
                              />
                            )}
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: 2,
                              alignItems: 'center',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '13px',
                                color: '#57606a',
                              }}
                            >
                              <strong>Date:</strong>{' '}
                              {new Date(vaccination.date).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                }
                              )}
                            </Typography>

                            {vaccination.nextDueDate && (
                              <Typography
                                sx={{
                                  fontSize: '13px',
                                  color: isOverdue
                                    ? '#dc2626'
                                    : isDueSoon
                                      ? '#f59e0b'
                                      : '#57606a',
                                  fontWeight:
                                    isOverdue || isDueSoon ? 600 : 400,
                                }}
                              >
                                <strong>Next Due:</strong>{' '}
                                {new Date(
                                  vaccination.nextDueDate
                                ).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </Typography>
                            )}

                            {vaccination.batchNumber && (
                              <Typography
                                sx={{
                                  fontSize: '13px',
                                  color: '#57606a',
                                  fontFamily: 'monospace',
                                }}
                              >
                                <strong>Batch:</strong>{' '}
                                {vaccination.batchNumber}
                              </Typography>
                            )}

                            {vaccination.veterinarian && (
                              <Typography
                                sx={{
                                  fontSize: '13px',
                                  color: '#57606a',
                                }}
                              >
                                <strong>By:</strong> {vaccination.veterinarian}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>
                      {index < vaccinations.length - 1 && (
                        <Divider sx={{ marginY: 1 }} />
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          )}

          {/* Pending Vaccinations Section */}
          {pendingVaccinations.length > 0 && (
            <Paper
              sx={{
                padding: 3,
                backgroundColor: '#ffffff',
                border: '1px solid #d0d7de',
                borderRadius: '8px',
                marginTop: 3,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  marginBottom: 2.5,
                }}
              >
                <WarningIcon
                  sx={{
                    color: '#f59e0b',
                    fontSize: '22px',
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#24292f',
                  }}
                >
                  Pending Vaccinations
                </Typography>
                <Chip
                  label={pendingVaccinations.length}
                  size="small"
                  sx={{
                    backgroundColor: '#fef3c7',
                    color: '#f59e0b',
                    fontWeight: 600,
                    fontSize: '11px',
                    height: '22px',
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {pendingVaccinations.map((vaccination, index) => (
                  <Box key={`pending-${vaccination.name}-${index}`}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        padding: 2,
                        borderRadius: '6px',
                        backgroundColor: '#fef3c7',
                        border: '1px solid #f59e0b',
                      }}
                    >
                      <WarningIcon
                        sx={{
                          color: '#f59e0b',
                          fontSize: '20px',
                          flexShrink: 0,
                          marginTop: 0.5,
                        }}
                      />

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            marginBottom: 0.5,
                            flexWrap: 'wrap',
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '16px',
                              fontWeight: 600,
                              color: '#24292f',
                            }}
                          >
                            {vaccination.name}
                          </Typography>
                          <Chip
                            label={vaccination.category}
                            size="small"
                            sx={{
                              backgroundColor:
                                vaccination.category === 'Core'
                                  ? '#dbeafe'
                                  : '#f3f4f6',
                              color:
                                vaccination.category === 'Core'
                                  ? '#2563eb'
                                  : '#57606a',
                              fontSize: '10px',
                              height: '20px',
                              fontWeight: 500,
                            }}
                          />
                          <Chip
                            label={vaccination.reason}
                            size="small"
                            sx={{
                              backgroundColor: '#fee2e2',
                              color: '#dc2626',
                              fontSize: '10px',
                              height: '20px',
                              fontWeight: 500,
                            }}
                          />
                        </Box>

                        <Typography
                          sx={{
                            fontSize: '13px',
                            color: '#57606a',
                            marginBottom: 0.5,
                          }}
                        >
                          {vaccination.description}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: '12px',
                            color: '#57606a',
                            fontStyle: 'italic',
                          }}
                        >
                          Recommended frequency: {vaccination.frequency}
                        </Typography>
                      </Box>
                    </Box>
                    {index < pendingVaccinations.length - 1 && (
                      <Divider sx={{ marginY: 1 }} />
                    )}
                  </Box>
                ))}
              </Box>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
}
