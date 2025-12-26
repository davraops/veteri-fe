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
  Language as LanguageIcon,
  People as PeopleIcon,
  CalendarToday as CalendarTodayIcon,
  LocalHospital as LocalHospitalIcon,
  Pets as PetsIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { mockOrganizations } from '@/data/mockOrganizations';
import { mockPets } from '@/data/mockPets';
import { mockOwners } from '@/data/mockOwners';

export const Route = createFileRoute('/organization/$organizationId')({
  component: OrganizationProfile,
});

function OrganizationProfile() {
  const { organizationId } = Route.useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Convert organizationId from URL param (string) to number
  const orgIdNum = parseInt(organizationId, 10);
  const organization = !isNaN(orgIdNum)
    ? mockOrganizations.find((org) => org.organizationId === orgIdNum)
    : null;

  // Map organization slug to data organization identifier
  const getDataOrgId = (orgSlug: string) => {
    // johndoe-org uses 'johndoe' in the data
    if (orgSlug === 'johndoe-org') return 'johndoe';
    return orgSlug;
  };

  const dataOrgId = organization ? getDataOrgId(organization.slug) : '';

  // Filter pets and owners by organization
  const organizationPets = organization
    ? mockPets.filter((pet) => pet.organization === dataOrgId)
    : [];
  const organizationOwners = organization
    ? mockOwners.filter((owner) => owner.organization === dataOrgId)
    : [];

  // Calculate statistics
  const totalPets = organizationPets.length;
  const totalOwners = organizationOwners.length;
  const petsByType = organizationPets.reduce(
    (acc, pet) => {
      acc[pet.type] = (acc[pet.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const petsByGender = organizationPets.reduce(
    (acc, pet) => {
      if (pet.gender) {
        acc[pet.gender] = (acc[pet.gender] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );
  const averagePetsPerOwner =
    totalOwners > 0 ? (totalPets / totalOwners).toFixed(1) : '0';

  if (!organization) {
    return (
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <Topbar
          pageTitle="Organization Not Found"
          onToggleSidebar={toggleSidebar}
        />
        <Sidebar open={sidebarOpen} onClose={toggleSidebar} />
        <Box sx={{ flexGrow: 1, padding: 3, textAlign: 'center' }}>
          <Typography variant="h5">Organization not found</Typography>
        </Box>
      </Box>
    );
  }

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      owner: 'Owner',
      veterinarian: 'Veterinarian',
      veterinary_assistant: 'Veterinary Assistant',
      admin: 'Administrator',
      staff: 'Staff',
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colorMap: Record<string, string> = {
      owner: '#2563eb',
      veterinarian: '#10b981',
      veterinary_assistant: '#f97316',
      admin: '#8b5cf6',
      staff: '#57606a',
    };
    return colorMap[role] || '#57606a';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar pageTitle={organization.name} onToggleSidebar={toggleSidebar} />
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
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: organization.color,
                    fontSize: '32px',
                    borderRadius: '12px',
                  }}
                >
                  {getInitials(organization.name)}
                </Avatar>
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      color: '#24292f',
                      marginBottom: 1,
                    }}
                  >
                    {organization.name}
                  </Typography>
                  {organization.description && (
                    <Typography
                      sx={{
                        fontSize: '16px',
                        color: '#57606a',
                        marginBottom: 2,
                      }}
                    >
                      {organization.description}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={organization.slug}
                      size="small"
                      sx={{
                        backgroundColor: '#f6f8fa',
                        color: '#57606a',
                        fontWeight: 500,
                      }}
                    />
                    {organization.isPersonal && (
                      <Chip
                        label="Personal Organization"
                        size="small"
                        sx={{
                          backgroundColor: '#dbeafe',
                          color: '#1e40af',
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => {
                  navigate({
                    to: '/organization/$organizationId/edit',
                    params: {
                      organizationId: String(organization.organizationId),
                    },
                  });
                }}
                sx={{
                  textTransform: 'none',
                  borderColor: '#d0d7de',
                  color: '#24292f',
                  '&:hover': {
                    borderColor: '#2563eb',
                    backgroundColor: '#f6f8fa',
                  },
                }}
              >
                Edit Organization
              </Button>
            </Box>

            <Divider sx={{ marginY: 3 }} />

            {/* Contact Information */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)',
                },
                gap: 3,
              }}
            >
              {organization.address && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                  }}
                >
                  <LocationIcon
                    sx={{ color: '#57606a', fontSize: '20px', marginTop: 0.5 }}
                  />
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#57606a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: 0.5,
                      }}
                    >
                      Address
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#24292f',
                      }}
                    >
                      {organization.address}
                    </Typography>
                    {organization.city && (
                      <Typography
                        sx={{
                          fontSize: '14px',
                          color: '#24292f',
                        }}
                      >
                        {organization.city}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}

              {organization.phone && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                  }}
                >
                  <PhoneIcon
                    sx={{ color: '#57606a', fontSize: '20px', marginTop: 0.5 }}
                  />
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#57606a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: 0.5,
                      }}
                    >
                      Phone
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#24292f',
                      }}
                    >
                      {organization.phone}
                    </Typography>
                  </Box>
                </Box>
              )}

              {organization.email && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                  }}
                >
                  <EmailIcon
                    sx={{ color: '#57606a', fontSize: '20px', marginTop: 0.5 }}
                  />
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#57606a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: 0.5,
                      }}
                    >
                      Email
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#24292f',
                      }}
                    >
                      {organization.email}
                    </Typography>
                  </Box>
                </Box>
              )}

              {organization.website && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                  }}
                >
                  <LanguageIcon
                    sx={{ color: '#57606a', fontSize: '20px', marginTop: 0.5 }}
                  />
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#57606a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: 0.5,
                      }}
                    >
                      Website
                    </Typography>
                    <Typography
                      component="a"
                      href={organization.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        fontSize: '14px',
                        color: '#2563eb',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {organization.website.replace(/^https?:\/\//, '')}
                    </Typography>
                  </Box>
                </Box>
              )}

              {organization.createdAt && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                  }}
                >
                  <CalendarTodayIcon
                    sx={{ color: '#57606a', fontSize: '20px', marginTop: 0.5 }}
                  />
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#57606a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: 0.5,
                      }}
                    >
                      Created
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#24292f',
                      }}
                    >
                      {new Date(organization.createdAt).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Main Content Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
              gap: 3,
            }}
          >
            {/* Members Section */}
            <Box>
              <Paper
                sx={{
                  padding: 3,
                  backgroundColor: '#ffffff',
                  border: '1px solid #d0d7de',
                  borderRadius: '8px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <PeopleIcon sx={{ color: '#57606a', fontSize: '20px' }} />
                    <Typography
                      sx={{
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#24292f',
                      }}
                    >
                      {organization.isPersonal
                        ? 'Owner'
                        : `Members (${organization.members.length})`}
                    </Typography>
                  </Box>
                </Box>

                {organization.isPersonal && (
                  <Box
                    sx={{
                      padding: 2,
                      backgroundColor: '#dbeafe',
                      border: '1px solid #93c5fd',
                      borderRadius: '6px',
                      marginBottom: 3,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#1e40af',
                        fontWeight: 500,
                      }}
                    >
                      ℹ️ This is a personal organization. Personal organizations
                      are single-user and cannot have additional members. To
                      collaborate with others, create a new shared organization.
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {organization.members.map((member) => (
                    <Box
                      key={member.userId}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        padding: 2,
                        borderRadius: '6px',
                        border: '1px solid #f6f8fa',
                        '&:hover': {
                          backgroundColor: '#f6f8fa',
                          borderColor: '#d0d7de',
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          backgroundColor: organization.color,
                          fontSize: '18px',
                        }}
                      >
                        {getInitials(`${member.firstName} ${member.lastName}`)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#24292f',
                            marginBottom: 0.5,
                          }}
                        >
                          {member.firstName} {member.lastName}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            color: '#57606a',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {member.email}
                        </Typography>
                      </Box>
                      <Chip
                        label={getRoleLabel(member.role)}
                        size="small"
                        sx={{
                          backgroundColor: `${getRoleColor(member.role)}15`,
                          color: getRoleColor(member.role),
                          fontWeight: 600,
                          fontSize: '12px',
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>

            {/* Sidebar Info */}
            <Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Statistics Grid */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                    gap: 2,
                  }}
                >
                  {/* Members Stat Card */}
                  <Paper
                    sx={{
                      padding: 2.5,
                      backgroundColor: '#ffffff',
                      border: '1px solid #d0d7de',
                      borderRadius: '8px',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        borderColor: organization.color,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 60,
                        height: 60,
                        backgroundColor: `${organization.color}15`,
                        borderRadius: '50%',
                        transform: 'translate(20px, -20px)',
                      }}
                    />
                    <Box sx={{ position: 'relative' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          marginBottom: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            padding: 1,
                            backgroundColor: `${organization.color}15`,
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <PeopleIcon
                            sx={{ color: organization.color, fontSize: '20px' }}
                          />
                        </Box>
                        <Typography
                          sx={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#57606a',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          Members
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '32px',
                          fontWeight: 700,
                          color: '#24292f',
                          lineHeight: 1,
                          marginBottom: 0.5,
                        }}
                      >
                        {organization.members.length}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          color: '#57606a',
                        }}
                      >
                        {
                          organization.members.filter(
                            (m) => m.role === 'veterinarian'
                          ).length
                        }{' '}
                        veterinarians
                      </Typography>
                    </Box>
                  </Paper>

                  {/* Pets Stat Card */}
                  <Paper
                    sx={{
                      padding: 2.5,
                      backgroundColor: '#ffffff',
                      border: '1px solid #d0d7de',
                      borderRadius: '8px',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        borderColor: '#10b981',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 60,
                        height: 60,
                        backgroundColor: '#10b98115',
                        borderRadius: '50%',
                        transform: 'translate(20px, -20px)',
                      }}
                    />
                    <Box sx={{ position: 'relative' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          marginBottom: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            padding: 1,
                            backgroundColor: '#10b98115',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <PetsIcon
                            sx={{ color: '#10b981', fontSize: '20px' }}
                          />
                        </Box>
                        <Typography
                          sx={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#57606a',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          Pets
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '32px',
                          fontWeight: 700,
                          color: '#24292f',
                          lineHeight: 1,
                          marginBottom: 0.5,
                        }}
                      >
                        {totalPets}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          color: '#57606a',
                        }}
                      >
                        {Object.keys(petsByType).length} different types
                      </Typography>
                    </Box>
                  </Paper>

                  {/* Owners Stat Card */}
                  <Paper
                    sx={{
                      padding: 2.5,
                      backgroundColor: '#ffffff',
                      border: '1px solid #d0d7de',
                      borderRadius: '8px',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        borderColor: '#2563eb',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 60,
                        height: 60,
                        backgroundColor: '#2563eb15',
                        borderRadius: '50%',
                        transform: 'translate(20px, -20px)',
                      }}
                    />
                    <Box sx={{ position: 'relative' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          marginBottom: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            padding: 1,
                            backgroundColor: '#2563eb15',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <PersonIcon
                            sx={{ color: '#2563eb', fontSize: '20px' }}
                          />
                        </Box>
                        <Typography
                          sx={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#57606a',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          Owners
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '32px',
                          fontWeight: 700,
                          color: '#24292f',
                          lineHeight: 1,
                          marginBottom: 0.5,
                        }}
                      >
                        {totalOwners}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          color: '#57606a',
                        }}
                      >
                        {averagePetsPerOwner} pets/owner avg
                      </Typography>
                    </Box>
                  </Paper>

                  {/* Average Stat Card */}
                  <Paper
                    sx={{
                      padding: 2.5,
                      backgroundColor: '#ffffff',
                      border: '1px solid #d0d7de',
                      borderRadius: '8px',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        borderColor: '#f97316',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 60,
                        height: 60,
                        backgroundColor: '#f9731615',
                        borderRadius: '50%',
                        transform: 'translate(20px, -20px)',
                      }}
                    />
                    <Box sx={{ position: 'relative' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          marginBottom: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            padding: 1,
                            backgroundColor: '#f9731615',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <TrendingUpIcon
                            sx={{ color: '#f97316', fontSize: '20px' }}
                          />
                        </Box>
                        <Typography
                          sx={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#57606a',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          Average
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '32px',
                          fontWeight: 700,
                          color: '#24292f',
                          lineHeight: 1,
                          marginBottom: 0.5,
                        }}
                      >
                        {averagePetsPerOwner}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          color: '#57606a',
                        }}
                      >
                        Pets per owner
                      </Typography>
                    </Box>
                  </Paper>
                </Box>

                {/* Pets Breakdown Card */}
                <Paper
                  sx={{
                    padding: 3,
                    backgroundColor: '#ffffff',
                    border: '1px solid #d0d7de',
                    borderRadius: '8px',
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
                    <Box
                      sx={{
                        padding: 1,
                        backgroundColor: '#10b98115',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PetsIcon sx={{ color: '#10b981', fontSize: '20px' }} />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#24292f',
                      }}
                    >
                      Pets by Type
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                  >
                    {Object.entries(petsByType).map(([type, count]) => {
                      const percentage =
                        totalPets > 0
                          ? ((count / totalPets) * 100).toFixed(0)
                          : '0';
                      return (
                        <Box key={type}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: 1,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '14px',
                                fontWeight: 500,
                                color: '#24292f',
                              }}
                            >
                              {type}
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: '16px',
                                  fontWeight: 700,
                                  color: organization.color,
                                }}
                              >
                                {count}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: '12px',
                                  color: '#57606a',
                                  fontWeight: 500,
                                }}
                              >
                                ({percentage}%)
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              height: 6,
                              backgroundColor: '#f6f8fa',
                              borderRadius: '3px',
                              overflow: 'hidden',
                            }}
                          >
                            <Box
                              sx={{
                                height: '100%',
                                width: `${percentage}%`,
                                backgroundColor: organization.color,
                                borderRadius: '3px',
                                transition: 'width 0.3s ease',
                              }}
                            />
                          </Box>
                        </Box>
                      );
                    })}
                    {Object.keys(petsByType).length === 0 && (
                      <Box
                        sx={{
                          padding: 3,
                          textAlign: 'center',
                          backgroundColor: '#f6f8fa',
                          borderRadius: '6px',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '14px',
                            color: '#57606a',
                            fontStyle: 'italic',
                          }}
                        >
                          No pets yet
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>

                {/* Pets by Gender Card */}
                {Object.keys(petsByGender).length > 0 && (
                  <Paper
                    sx={{
                      padding: 3,
                      backgroundColor: '#ffffff',
                      border: '1px solid #d0d7de',
                      borderRadius: '8px',
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
                      <Box
                        sx={{
                          padding: 1,
                          backgroundColor: '#f9731615',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <LocalHospitalIcon
                          sx={{ color: '#f97316', fontSize: '20px' }}
                        />
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#24292f',
                        }}
                      >
                        Pets by Gender
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 2,
                      }}
                    >
                      {Object.entries(petsByGender).map(([gender, count]) => {
                        const percentage =
                          totalPets > 0
                            ? ((count / totalPets) * 100).toFixed(0)
                            : '0';
                        return (
                          <Box
                            key={gender}
                            sx={{
                              padding: 2,
                              backgroundColor: '#f6f8fa',
                              borderRadius: '6px',
                              textAlign: 'center',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '24px',
                                fontWeight: 700,
                                color: organization.color,
                                marginBottom: 0.5,
                              }}
                            >
                              {count}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '12px',
                                color: '#57606a',
                                fontWeight: 500,
                                marginBottom: 0.5,
                              }}
                            >
                              {gender}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '11px',
                                color: '#57606a',
                              }}
                            >
                              {percentage}%
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Paper>
                )}

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
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    {!organization.isPersonal && (
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                          textTransform: 'none',
                          justifyContent: 'flex-start',
                          borderColor: '#d0d7de',
                          color: '#24292f',
                          '&:hover': {
                            borderColor: '#2563eb',
                            backgroundColor: '#f6f8fa',
                          },
                        }}
                      >
                        Add Member
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        textTransform: 'none',
                        justifyContent: 'flex-start',
                        borderColor: '#d0d7de',
                        color: '#24292f',
                        '&:hover': {
                          borderColor: '#2563eb',
                          backgroundColor: '#f6f8fa',
                        },
                      }}
                    >
                      Manage Settings
                    </Button>
                    {organization.isPersonal && (
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          textTransform: 'none',
                          justifyContent: 'flex-start',
                          backgroundColor: '#10b981',
                          '&:hover': {
                            backgroundColor: '#059669',
                          },
                        }}
                      >
                        Create Shared Organization
                      </Button>
                    )}
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
