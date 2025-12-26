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

export const Route = createFileRoute('/owners/new/verify')({
  component: VerifyOwner,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      firstName: (search.firstName as string) || '',
      lastName: (search.lastName as string) || '',
      email: (search.email as string) || '',
      phones: Array.isArray(search.phones) ? (search.phones as string[]) : [],
      nationalId: (search.nationalId as string) || '',
      nationality: (search.nationality as string) || '',
      address: (search.address as string) || '',
      city: (search.city as string) || '',
      organization: (search.organization as string) || '',
    };
  },
});

function VerifyOwner() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/owners/new/verify' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleConfirm = () => {
    // TODO: Submit to API
    console.log('Creating owner with data:', search);
    // Generate a temporary ID for the new owner (in real app, this would come from API)
    const newOwnerId = `owner-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    // Navigate to owner profile page with form data as search params
    navigate({
      to: '/owners/$ownerId',
      params: { ownerId: newOwnerId },
      search: {
        firstName: search.firstName,
        lastName: search.lastName,
        email: search.email,
        phones: search.phones,
        nationalId: search.nationalId,
        nationality: search.nationality,
        address: search.address,
        city: search.city,
        organization: search.organization,
      },
    });
  };

  const handleEdit = () => {
    // Navigate back to form with data
    navigate({
      to: '/owners/new',
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
      <Topbar pageTitle="Verify Owner" onToggleSidebar={toggleSidebar} />
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
            Verify Owner Information
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
                      borderRadius: '8px',
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

              {/* Name */}
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
                  {search.firstName} {search.lastName}
                </Typography>
              </Box>

              <Divider />

              {/* Email */}
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
                  Email
                </Typography>
                <Typography
                  sx={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#24292f',
                  }}
                >
                  {search.email}
                </Typography>
              </Box>

              <Divider />

              {/* Phones */}
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
                  Phone
                </Typography>
                {search.phones &&
                search.phones.length > 0 &&
                search.phones[0] ? (
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#24292f',
                    }}
                  >
                    {search.phones[0]}
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
                    No phone number provided
                  </Typography>
                )}

                {/* Additional Contact Numbers */}
                {search.phones && search.phones.length > 1 && (
                  <>
                    <Box sx={{ marginTop: 3, marginBottom: 1 }}>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#57606a',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Additional Contact Numbers
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                    >
                      {search.phones.slice(1).map((phone, index) => (
                        <Typography
                          key={index + 1}
                          sx={{
                            fontSize: '16px',
                            fontWeight: 500,
                            color: '#24292f',
                          }}
                        >
                          {phone}
                        </Typography>
                      ))}
                    </Box>
                  </>
                )}
              </Box>

              <Divider />

              {/* National ID and Nationality */}
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
                    National ID
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#24292f',
                      fontFamily: 'monospace',
                    }}
                  >
                    {search.nationalId}
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
                    Nationality
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#24292f',
                    }}
                  >
                    {search.nationality}
                  </Typography>
                </Box>
              </Box>

              {(search.address || search.city) && (
                <>
                  <Divider />
                  {/* Address */}
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
                      Address
                    </Typography>
                    {search.address && (
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: 500,
                          color: '#24292f',
                          marginBottom: 0.5,
                        }}
                      >
                        {search.address}
                      </Typography>
                    )}
                    {search.city && (
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: 500,
                          color: '#24292f',
                        }}
                      >
                        {search.city}
                      </Typography>
                    )}
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
