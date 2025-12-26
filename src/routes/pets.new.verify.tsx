import {
  createFileRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useState } from 'react';
import { Box, Typography, Button, Paper, Divider, Avatar } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { mockOwners, Owner } from '@/data/mockOwners';

export const Route = createFileRoute('/pets/new/verify')({
  component: VerifyPet,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      name: (search.name as string) || '',
      lastName: (search.lastName as string) || '',
      organization: (search.organization as string) || '',
      ownerId: (search.ownerId as string) || '',
      type: (search.type as string) || '',
      breed: (search.breed as string) || '',
      gender: (search.gender as string) || '',
      birthDate: (search.birthDate as string) || '',
      birthDateUnknown: (search.birthDateUnknown as boolean) || false,
      color: (search.color as string) || '',
      microchip: (search.microchip as string) || '',
      notes: (search.notes as string) || '',
      newOwnerData: (search.newOwnerData as Owner) || null,
    };
  },
});

function VerifyPet() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/pets/new/verify' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleConfirm = () => {
    // TODO: Submit to API
    console.log('Creating pet with data:', search);
    // Generate a temporary ID for the new pet (in real app, this would come from API)
    const newPetId = `pet-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    // Navigate to pet profile page with form data as search params
    navigate({
      to: '/pets/$petId',
      params: { petId: newPetId },
      search: {
        name: search.name,
        lastName: search.lastName,
        organization: search.organization,
        ownerId: search.ownerId,
        type: search.type,
        breed: search.breed,
        gender: search.gender,
        birthDate: search.birthDate,
        birthDateUnknown: search.birthDateUnknown,
        color: search.color,
        microchip: search.microchip,
        notes: search.notes,
      },
    });
  };

  const handleEdit = () => {
    // Navigate back to form with data
    navigate({
      to: '/pets/new',
      search: search,
    });
  };

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar pageTitle="Verify Pet" onToggleSidebar={toggleSidebar} />
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
            maxWidth: 800,
            margin: '0 auto',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: '#24292f',
              marginBottom: 3,
            }}
          >
            Verify Pet Information
          </Typography>

          <Paper
            sx={{
              padding: 4,
              backgroundColor: '#ffffff',
              border: '1px solid #d0d7de',
              borderRadius: '8px',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Organization */}
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
                  Organization
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: getOrganizationColor(
                        search.organization
                      ),
                      fontSize: '14px',
                    }}
                  >
                    {getOrganizationInitials(search.organization)}
                  </Avatar>
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#24292f',
                    }}
                  >
                    {search.organization}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              {/* Owner */}
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
                  Owner
                </Typography>
                {search.ownerId ? (
                  (() => {
                    const owner = mockOwners.find(
                      (o) => o.id === parseInt(search.ownerId, 10)
                    );
                    return owner ? (
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: 500,
                          color: '#24292f',
                        }}
                      >
                        {owner.firstName} {owner.lastName}
                      </Typography>
                    ) : (
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: 500,
                          color: '#57606a',
                          fontStyle: 'italic',
                        }}
                      >
                        Owner not found
                      </Typography>
                    );
                  })()
                ) : (
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#57606a',
                      fontStyle: 'italic',
                    }}
                  >
                    No owner assigned
                  </Typography>
                )}
              </Box>

              <Divider />

              {/* Name and Last Name */}
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
                  Name
                </Typography>
                <Typography
                  sx={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#24292f',
                  }}
                >
                  {search.name} {search.lastName}
                </Typography>
              </Box>

              <Divider />

              {/* Type and Breed */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 3,
                }}
              >
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
                    Type
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#24292f',
                    }}
                  >
                    {search.type || 'Not specified'}
                  </Typography>
                </Box>
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
                    Breed
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#24292f',
                    }}
                  >
                    {search.breed || 'Not specified'}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              {/* Gender and Birth Date */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 3,
                }}
              >
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
                    {search.gender || 'Not specified'}
                  </Typography>
                </Box>
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
                    }}
                  >
                    {search.birthDateUnknown
                      ? 'Unknown'
                      : search.birthDate
                        ? new Date(search.birthDate).toLocaleDateString()
                        : 'Not specified'}
                  </Typography>
                </Box>
              </Box>

              {(search.color || search.microchip) && (
                <>
                  <Divider />
                  {/* Color and Microchip */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                      gap: 3,
                    }}
                  >
                    {search.color && (
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
                          {search.color}
                        </Typography>
                      </Box>
                    )}
                    {search.microchip && (
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
                          }}
                        >
                          {search.microchip}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </>
              )}

              {search.notes && (
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
                      {search.notes}
                    </Typography>
                  </Box>
                </>
              )}

              <Divider />

              {/* Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 2,
                  marginTop: 2,
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
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
                <Button
                  variant="contained"
                  startIcon={<CheckCircleIcon />}
                  onClick={handleConfirm}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: '#10b981',
                    '&:hover': {
                      backgroundColor: '#059669',
                    },
                  }}
                >
                  Confirm & Create
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
