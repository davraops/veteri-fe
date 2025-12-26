import { createFileRoute, useNavigate } from '@tanstack/react-router';
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
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { mockOwners } from '@/data/mockOwners';
import { mockPets } from '@/data/mockPets';

export const Route = createFileRoute('/owners/$ownerId')({
  component: OwnerProfile,
  validateSearch: (
    search: Record<string, unknown>
  ): {
    firstName?: string;
    lastName?: string;
    email?: string;
    phones?: string[];
    nationalId?: string;
    nationality?: string;
    address?: string;
    city?: string;
    organization?: string;
  } => {
    return {
      firstName: (search.firstName as string) || undefined,
      lastName: (search.lastName as string) || undefined,
      email: (search.email as string) || undefined,
      phones: Array.isArray(search.phones)
        ? (search.phones as string[])
        : undefined,
      nationalId: (search.nationalId as string) || undefined,
      nationality: (search.nationality as string) || undefined,
      address: (search.address as string) || undefined,
      city: (search.city as string) || undefined,
      organization: (search.organization as string) || undefined,
    };
  },
});

function OwnerProfile() {
  const { ownerId } = Route.useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const search = Route.useSearch();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Use data from search params if available (from verification page)
  // Otherwise, try to find owner in mock data
  const ownerData =
    search && Object.keys(search).length > 0 && search.firstName
      ? {
          id: ownerId,
          firstName: (search.firstName as string) || '',
          lastName: (search.lastName as string) || '',
          email: (search.email as string) || '',
          phones: Array.isArray(search.phones)
            ? (search.phones as string[])
            : [],
          nationalId: (search.nationalId as string) || '',
          nationality: (search.nationality as string) || '',
          address: (search.address as string) || '',
          city: (search.city as string) || '',
          organization: (search.organization as string) || '',
          pets: [] as number[],
        }
      : (() => {
          const ownerIdNum = parseInt(ownerId, 10);
          const foundOwner = !isNaN(ownerIdNum)
            ? mockOwners.find((o) => o.id === ownerIdNum)
            : null;
          return foundOwner;
        })();

  if (!ownerData) {
    return (
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <Topbar pageTitle="Owner Not Found" onToggleSidebar={toggleSidebar} />
        <Sidebar open={sidebarOpen} onClose={toggleSidebar} />
        <Box sx={{ flexGrow: 1, padding: 3, textAlign: 'center' }}>
          <Typography variant="h5">Owner not found</Typography>
        </Box>
      </Box>
    );
  }

  const owner = ownerData;

  // Get owner's pets
  const ownerPets =
    owner.pets.length > 0
      ? mockPets.filter((pet) => owner.pets.includes(pet.id))
      : [];

  const getOrganizationColor = (org: string) => {
    if (org === 'johndoe') return '#2563eb';
    if (org === 'mr-pet') return '#10b981';
    if (org === 'vete-amigos') return '#f97316';
    return '#57606a';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar pageTitle="Owner Profile" onToggleSidebar={toggleSidebar} />
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      color: '#24292f',
                      marginBottom: 1,
                    }}
                  >
                    {owner.firstName} {owner.lastName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip
                      label={`${ownerPets.length} ${ownerPets.length === 1 ? 'pet' : 'pets'}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: '#d0d7de',
                        color: '#57606a',
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => {
                  // TODO: Navigate to edit page
                  console.log('Edit owner');
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
                Contact Information
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Email */}
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      marginBottom: 1,
                    }}
                  >
                    <EmailIcon sx={{ fontSize: '18px', color: '#57606a' }} />
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#57606a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Email
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#24292f',
                    }}
                  >
                    {owner.email}
                  </Typography>
                </Box>

                <Divider />

                {/* Phones */}
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      marginBottom: 1,
                    }}
                  >
                    <PhoneIcon sx={{ fontSize: '18px', color: '#57606a' }} />
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#57606a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Phone
                    </Typography>
                  </Box>
                  {owner.phones &&
                  owner.phones.length > 0 &&
                  owner.phones[0] ? (
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: 500,
                        color: '#24292f',
                      }}
                    >
                      {owner.phones[0]}
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
                  {owner.phones && owner.phones.length > 1 && (
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
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                        }}
                      >
                        {owner.phones.slice(1).map((phone, index) => (
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
                      {owner.nationalId}
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
                      {owner.nationality}
                    </Typography>
                  </Box>
                </Box>

                {owner.address && (
                  <>
                    <Divider />
                    {/* Address */}
                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          marginBottom: 1,
                        }}
                      >
                        <LocationIcon
                          sx={{ fontSize: '18px', color: '#57606a' }}
                        />
                        <Typography
                          sx={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#57606a',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          Address
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: 500,
                          color: '#24292f',
                          marginBottom: 0.5,
                        }}
                      >
                        {owner.address}
                      </Typography>
                      {owner.city && (
                        <Typography
                          sx={{
                            fontSize: '14px',
                            color: '#57606a',
                          }}
                        >
                          {owner.city}
                        </Typography>
                      )}
                    </Box>
                  </>
                )}
              </Box>
            </Paper>

            {/* Sidebar Info */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Organization Card */}
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
                  Organization
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      backgroundColor: getOrganizationColor(owner.organization),
                      fontSize: '18px',
                      borderRadius: '8px',
                    }}
                  >
                    {owner.organization === 'johndoe'
                      ? 'JD'
                      : owner.organization === 'mr-pet'
                        ? 'MP'
                        : 'VA'}
                  </Avatar>
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#24292f',
                    }}
                  >
                    {owner.organization}
                  </Typography>
                </Box>
              </Paper>

              {/* Pets Card */}
              {ownerPets.length > 0 && (
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
                    Pets ({ownerPets.length})
                  </Typography>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    {ownerPets.map((pet) => (
                      <Box
                        key={pet.id}
                        onClick={() => {
                          navigate({
                            to: '/pets/$petId',
                            params: { petId: String(pet.id) },
                            search: {},
                          });
                        }}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          padding: 1,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: '#f6f8fa',
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: '#10b981',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          {pet.name.charAt(0)}
                          {pet.lastName.charAt(0)}
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
                            {pet.type} - {pet.breed}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
