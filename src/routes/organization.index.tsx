import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Box, Typography, Paper, Avatar, Chip, Button } from '@mui/material';
import {
  Add as AddIcon,
  People as PeopleIcon,
  Pets as PetsIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { mockOrganizations } from '@/data/mockOrganizations';
import { mockPets } from '@/data/mockPets';
import { mockOwners } from '@/data/mockOwners';

export const Route = createFileRoute('/organization/')({
  component: Organizations,
});

// Current user ID - in a real app this would come from auth context
const CURRENT_USER_ID = 'johndoe';

function Organizations() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Get organizations where current user is a member
  const userOrganizations = mockOrganizations
    .map((org) => {
      const userMember = org.members.find(
        (member) => member.userId === CURRENT_USER_ID
      );
      if (!userMember) return null;

      // Map organization slug to data organization identifier
      const getDataOrgId = (orgSlug: string) => {
        if (orgSlug === 'johndoe-org') return 'johndoe';
        return orgSlug;
      };

      const dataOrgId = getDataOrgId(org.slug);

      // Get stats for this organization
      const organizationPets = mockPets.filter(
        (pet) => pet.organization === dataOrgId
      );
      const organizationOwners = mockOwners.filter(
        (owner) => owner.organization === dataOrgId
      );

      return {
        ...org,
        userRole: userMember.role,
        totalPets: organizationPets.length,
        totalOwners: organizationOwners.length,
        totalMembers: org.members.length,
      };
    })
    .filter((org) => org !== null) as Array<
    (typeof mockOrganizations)[0] & {
      userRole: string;
      totalPets: number;
      totalOwners: number;
      totalMembers: number;
    }
  >;

  // Sort: personal organizations first
  userOrganizations.sort((a, b) => {
    if (a.isPersonal && !b.isPersonal) return -1;
    if (!a.isPersonal && b.isPersonal) return 1;
    return 0;
  });

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
      <Topbar pageTitle="Organizations" onToggleSidebar={toggleSidebar} />
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
              My Organizations
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                // TODO: Navigate to create organization page
              }}
              sx={{
                textTransform: 'none',
                backgroundColor: '#10b981',
                '&:hover': {
                  backgroundColor: '#059669',
                },
              }}
            >
              New Organization
            </Button>
          </Box>

          {/* Organizations Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {userOrganizations.map((organization) => (
              <Paper
                key={organization.id}
                onClick={() => {
                  navigate({
                    to: '/organization/$organizationId',
                    params: {
                      organizationId: String(organization.organizationId),
                    },
                  });
                }}
                sx={{
                  padding: organization.isPersonal ? 3.5 : 3,
                  backgroundColor: organization.isPersonal
                    ? '#f0f9ff'
                    : '#ffffff',
                  border: organization.isPersonal
                    ? `2px solid ${organization.color}`
                    : '1px solid #d0d7de',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: organization.isPersonal
                    ? `0 4px 16px ${organization.color}30`
                    : 'none',
                  '&:hover': {
                    borderColor: organization.color,
                    boxShadow: organization.isPersonal
                      ? `0 6px 20px ${organization.color}40`
                      : '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {/* Decorative circle */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: organization.isPersonal ? 120 : 100,
                    height: organization.isPersonal ? 120 : 100,
                    backgroundColor: organization.isPersonal
                      ? `${organization.color}20`
                      : `${organization.color}10`,
                    borderRadius: '50%',
                  }}
                />
                {/* Personal organization badge */}
                {organization.isPersonal && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      padding: '4px 8px',
                      backgroundColor: organization.color,
                      borderRadius: '4px',
                      zIndex: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#ffffff',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Personal
                    </Typography>
                  </Box>
                )}

                <Box sx={{ position: 'relative' }}>
                  {/* Header with Avatar and Role */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      marginBottom: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: organization.isPersonal ? 64 : 56,
                        height: organization.isPersonal ? 64 : 56,
                        backgroundColor: organization.color,
                        fontSize: organization.isPersonal ? '28px' : '24px',
                        borderRadius: '10px',
                        flexShrink: 0,
                        border: organization.isPersonal
                          ? `3px solid ${organization.color}`
                          : 'none',
                        boxShadow: organization.isPersonal
                          ? `0 2px 8px ${organization.color}40`
                          : 'none',
                      }}
                    >
                      {getInitials(organization.name)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: '#24292f',
                          marginBottom: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {organization.name}
                      </Typography>
                      <Chip
                        label={getRoleLabel(organization.userRole)}
                        size="small"
                        sx={{
                          backgroundColor: `${getRoleColor(organization.userRole)}15`,
                          color: getRoleColor(organization.userRole),
                          fontWeight: 600,
                          fontSize: '11px',
                          height: 22,
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Description */}
                  {organization.description && (
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#57606a',
                        marginBottom: 2.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.5,
                      }}
                    >
                      {organization.description}
                    </Typography>
                  )}

                  {/* Stats */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 2,
                      marginBottom: 2,
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          marginBottom: 0.5,
                        }}
                      >
                        <PeopleIcon
                          sx={{
                            fontSize: '16px',
                            color: '#57606a',
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: '20px',
                            fontWeight: 700,
                            color: '#24292f',
                          }}
                        >
                          {organization.totalMembers}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '11px',
                          color: '#57606a',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Members
                      </Typography>
                    </Box>

                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          marginBottom: 0.5,
                        }}
                      >
                        <PetsIcon
                          sx={{
                            fontSize: '16px',
                            color: '#57606a',
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: '20px',
                            fontWeight: 700,
                            color: '#24292f',
                          }}
                        >
                          {organization.totalPets}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '11px',
                          color: '#57606a',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Pets
                      </Typography>
                    </Box>

                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          marginBottom: 0.5,
                        }}
                      >
                        <PersonIcon
                          sx={{
                            fontSize: '16px',
                            color: '#57606a',
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: '20px',
                            fontWeight: 700,
                            color: '#24292f',
                          }}
                        >
                          {organization.totalOwners}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '11px',
                          color: '#57606a',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Owners
                      </Typography>
                    </Box>
                  </Box>

                  {/* Footer with organization type */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: 2,
                      borderTop: '1px solid #f6f8fa',
                    }}
                  >
                    <Chip
                      label={organization.isPersonal ? 'Personal' : 'Shared'}
                      size="small"
                      sx={{
                        backgroundColor: organization.isPersonal
                          ? '#dbeafe'
                          : '#d1fae5',
                        color: organization.isPersonal ? '#1e40af' : '#065f46',
                        fontWeight: 500,
                        fontSize: '11px',
                        height: 20,
                      }}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: organization.color,
                        fontWeight: 500,
                        fontSize: '13px',
                      }}
                    >
                      View Details
                      <ArrowForwardIcon sx={{ fontSize: '16px' }} />
                    </Box>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>

          {userOrganizations.length === 0 && (
            <Paper
              sx={{
                padding: 6,
                textAlign: 'center',
                backgroundColor: '#ffffff',
                border: '1px solid #d0d7de',
                borderRadius: '8px',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#57606a',
                  marginBottom: 1,
                }}
              >
                No organizations found
              </Typography>
              <Typography
                sx={{
                  color: '#57606a',
                  marginBottom: 3,
                }}
              >
                Create your first organization to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  // TODO: Navigate to create organization page
                }}
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#10b981',
                  '&:hover': {
                    backgroundColor: '#059669',
                  },
                }}
              >
                Create Organization
              </Button>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
}
