import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Box, Typography, Paper, Avatar, Button, Chip } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarTodayIcon,
  Person as PersonIcon,
  Pets as PetsIcon,
  Business as BusinessIcon,
  Note as NoteIcon,
  Phone as PhoneIcon,
  LocalHospital as SurgeryIcon,
} from '@mui/icons-material';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { mockAppointments } from '@/data/mockAppointments';
import { mockPets } from '@/data/mockPets';
import { mockOwners } from '@/data/mockOwners';
import { mockOrganizations } from '@/data/mockOrganizations';

export const Route = createFileRoute('/surgeries/$surgeryId')({
  component: SurgeryDetail,
});

function SurgeryDetail() {
  const { surgeryId } = Route.useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Find surgery in mock data
  const surgeryIdNum = parseInt(surgeryId, 10);
  const surgery =
    !isNaN(surgeryIdNum) &&
    mockAppointments.find(
      (apt) => apt.id === surgeryIdNum && apt.type === 'surgery'
    );

  if (!surgery) {
    return (
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <Topbar pageTitle="Surgery Not Found" onToggleSidebar={toggleSidebar} />
        <Sidebar open={sidebarOpen} onClose={toggleSidebar} />
        <Box
          sx={{
            flexGrow: 1,
            backgroundColor: '#f6f8fa',
            padding: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Paper
            sx={{
              padding: 4,
              textAlign: 'center',
              maxWidth: 500,
            }}
          >
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              Surgery not found
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate({ to: '/surgeries' })}
              sx={{
                textTransform: 'none',
                backgroundColor: '#dc2626',
                '&:hover': {
                  backgroundColor: '#b91c1c',
                },
              }}
            >
              Back to Surgeries
            </Button>
          </Paper>
        </Box>
      </Box>
    );
  }

  // Map organization slug to data organization identifier
  const getDataOrgId = (orgSlug: string) => {
    if (orgSlug === 'johndoe-org') return 'johndoe';
    return orgSlug;
  };

  // Get related data
  const pet = mockPets.find((p) => p.id === surgery.petId);
  const owner = pet ? mockOwners.find((o) => o.id === surgery.ownerId) : null;

  const organization = mockOrganizations.find((org) => {
    const dataOrgId = getDataOrgId(org.slug);
    return dataOrgId === surgery.organization;
  });

  const getOrganizationColor = (orgSlug: string) => {
    const org = mockOrganizations.find((o) => {
      const dataOrgId = getDataOrgId(o.slug);
      return dataOrgId === orgSlug;
    });
    return org ? org.color : '#57606a';
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      scheduled: '#2563eb',
      confirmed: '#10b981',
      in_progress: '#f97316',
      completed: '#57606a',
      cancelled: '#dc2626',
    };
    return colorMap[status] || '#57606a';
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    };
  };

  const startDateTime = formatDateTime(surgery.startTime);
  const endDateTime = formatDateTime(surgery.endTime);

  const orgColor = getOrganizationColor(surgery.organization);
  const statusColor = getStatusColor(surgery.status);

  // Get assigned team members
  const assignedToArray = Array.isArray(surgery.assignedTo)
    ? surgery.assignedTo
    : [surgery.assignedTo];

  const assignedTeam = organization
    ? (assignedToArray
        .map((userId) => organization.members.find((m) => m.userId === userId))
        .filter((member) => member !== undefined) as NonNullable<
        (typeof mockOrganizations)[0]
      >['members'])
    : [];

  // Get role label based on position in team
  const getRoleLabel = (
    member: NonNullable<(typeof mockOrganizations)[0]>['members'][0],
    _index: number
  ) => {
    if (!member) return 'Unknown';

    const memberRole = member.role;

    if (memberRole === 'veterinarian' || memberRole === 'owner') {
      const veterinarians = assignedTeam
        .filter((m) => m.role === 'veterinarian' || m.role === 'owner')
        .sort((a, b) => {
          const aIndex = assignedToArray.indexOf(a.userId);
          const bIndex = assignedToArray.indexOf(b.userId);
          return aIndex - bIndex;
        });
      const memberIndex = veterinarians.findIndex(
        (m) => m.userId === member.userId
      );
      if (memberIndex === 0) {
        return 'Primary Surgeon';
      } else if (memberIndex === 1) {
        return 'Secondary Surgeon';
      } else if (memberIndex === 2 && veterinarians.length > 2) {
        return 'Anesthesiologist';
      }
      return 'Surgeon';
    } else if (memberRole === 'veterinary_assistant') {
      return 'Surgery Assistant';
    }
    return 'Assistant';
  };

  // Calculate duration
  const start = new Date(surgery.startTime);
  const end = new Date(surgery.endTime);
  const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
  const durationHours = Math.floor(durationMinutes / 60);
  const durationMins = Math.round(durationMinutes % 60);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar pageTitle="Surgery Details" onToggleSidebar={toggleSidebar} />
      <Sidebar open={sidebarOpen} onClose={toggleSidebar} />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: '#f6f8fa',
          padding: 3,
          width: '100%',
        }}
      >
        <Box
          sx={{
            width: '100%',
          }}
        >
          {/* Header */}
          <Paper
            sx={{
              padding: 3,
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
                marginBottom: 2,
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    marginBottom: 2,
                  }}
                >
                  <SurgeryIcon sx={{ color: '#dc2626', fontSize: '32px' }} />
                  <Chip
                    label="Surgery"
                    sx={{
                      backgroundColor: '#dc262615',
                      color: '#dc2626',
                      fontWeight: 600,
                      fontSize: '12px',
                    }}
                  />
                  <Chip
                    label={surgery.status}
                    sx={{
                      backgroundColor: `${statusColor}15`,
                      color: statusColor,
                      fontWeight: 600,
                      fontSize: '12px',
                      textTransform: 'capitalize',
                    }}
                  />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    color: '#24292f',
                    marginBottom: 1,
                  }}
                >
                  {surgery.title}
                </Typography>
                {surgery.description && (
                  <Typography
                    sx={{
                      fontSize: '16px',
                      color: '#57606a',
                      marginTop: 1,
                    }}
                  >
                    {surgery.description}
                  </Typography>
                )}
              </Box>
              <Button
                variant="contained"
                onClick={() => {
                  navigate({
                    to: '/appointments/$appointmentId',
                    params: { appointmentId: String(surgery.id) },
                  });
                }}
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#2563eb',
                  '&:hover': {
                    backgroundColor: '#1d4ed8',
                  },
                }}
              >
                View Full Appointment
              </Button>
            </Box>
          </Paper>

          {/* Main Content Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
              gap: 2,
              width: '100%',
            }}
          >
            {/* First Row: Schedule (larger) and Organization (smaller) */}
            <Box sx={{ display: 'flex' }}>
              <Paper
                sx={{
                  padding: 2.5,
                  backgroundColor: '#ffffff',
                  border: '1px solid #d0d7de',
                  borderRadius: '8px',
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
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
                  <CalendarTodayIcon
                    sx={{ color: orgColor, fontSize: '18px' }}
                  />
                  <Typography
                    sx={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#57606a',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Schedule
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          color: '#57606a',
                          marginBottom: 0.5,
                        }}
                      >
                        Start
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '15px',
                          fontWeight: 600,
                          color: '#24292f',
                        }}
                      >
                        {startDateTime.date}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '13px',
                          color: '#57606a',
                        }}
                      >
                        {startDateTime.time}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: '#57606a',
                        marginBottom: 0.5,
                      }}
                    >
                      End
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#24292f',
                      }}
                    >
                      {endDateTime.date}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '13px',
                        color: '#57606a',
                      }}
                    >
                      {endDateTime.time}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: '#57606a',
                        marginBottom: 0.5,
                      }}
                    >
                      Duration
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#24292f',
                      }}
                    >
                      {durationHours > 0
                        ? `${durationHours} hour${durationHours > 1 ? 's' : ''} ${durationMins > 0 ? `and ${durationMins} minute${durationMins > 1 ? 's' : ''}` : ''}`
                        : `${durationMins} minute${durationMins > 1 ? 's' : ''}`}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>

            <Box sx={{ display: 'flex' }}>
              {organization && (
                <Paper
                  sx={{
                    padding: 2,
                    backgroundColor: '#ffffff',
                    border: '1px solid #d0d7de',
                    borderRadius: '8px',
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      marginBottom: 1.5,
                    }}
                  >
                    <BusinessIcon sx={{ color: orgColor, fontSize: '16px' }} />
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#57606a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Organization
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      navigate({
                        to: '/organization/$organizationId',
                        params: {
                          organizationId: String(organization.organizationId),
                        },
                      });
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: orgColor,
                        fontSize: '16px',
                        borderRadius: '6px',
                      }}
                    >
                      {organization.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#24292f',
                          marginBottom: 0.25,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {organization.name}
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
                        {organization.city}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              )}
            </Box>

            {/* Second Row: Surgical Team - Full Width */}
            <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
              <Paper
                sx={{
                  padding: 2.5,
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
                    marginBottom: 1.5,
                  }}
                >
                  <PersonIcon sx={{ color: orgColor, fontSize: '18px' }} />
                  <Typography
                    sx={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#57606a',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Surgical Team ({assignedTeam.length} member
                    {assignedTeam.length !== 1 ? 's' : ''})
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                    },
                    gap: 2,
                  }}
                >
                  {assignedTeam.map((member, index) => (
                    <Box key={member.userId}>
                      <Box
                        sx={{
                          padding: 2,
                          backgroundColor: '#f6f8fa',
                          borderRadius: '6px',
                          border: '1px solid #e1e4e8',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            marginBottom: 1,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              backgroundColor: orgColor,
                              fontSize: '16px',
                            }}
                          >
                            {member.firstName.charAt(0)}
                            {member.lastName.charAt(0)}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography
                              sx={{
                                fontSize: '15px',
                                fontWeight: 600,
                                color: '#24292f',
                              }}
                            >
                              {member.firstName} {member.lastName}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '13px',
                                fontWeight: 500,
                                color: orgColor,
                              }}
                            >
                              {getRoleLabel(member, index)}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography
                          sx={{
                            fontSize: '12px',
                            color: '#57606a',
                          }}
                        >
                          {member.email}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>

            {/* Third Row: Pet and Owner Information */}
            {pet && (
              <Box sx={{ display: 'flex', gridColumn: { xs: '1', md: '1' } }}>
                <Paper
                  sx={{
                    padding: 2.5,
                    backgroundColor: '#ffffff',
                    border: '1px solid #d0d7de',
                    borderRadius: '8px',
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
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
                    <PetsIcon sx={{ color: orgColor, fontSize: '18px' }} />
                    <Typography
                      sx={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#57606a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Pet Information
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      cursor: 'pointer',
                      marginBottom: 2,
                    }}
                    onClick={() => {
                      navigate({
                        to: '/pets/$petId',
                        params: { petId: String(pet.id) },
                      });
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        backgroundColor: orgColor,
                        fontSize: '18px',
                        borderRadius: '6px',
                      }}
                    >
                      {pet.name.charAt(0)}
                      {pet.lastName.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: 600,
                          color: '#24292f',
                          marginBottom: 0.5,
                        }}
                      >
                        {pet.name} {pet.lastName}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '13px',
                          color: '#57606a',
                        }}
                      >
                        {pet.type} • {pet.breed}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            )}

            {owner && (
              <Box sx={{ display: 'flex', gridColumn: { xs: '1', md: '2' } }}>
                <Paper
                  sx={{
                    padding: 2.5,
                    backgroundColor: '#ffffff',
                    border: '1px solid #d0d7de',
                    borderRadius: '8px',
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
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
                    <PersonIcon sx={{ color: orgColor, fontSize: '18px' }} />
                    <Typography
                      sx={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#57606a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Owner Information
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      cursor: 'pointer',
                      marginBottom: 2,
                    }}
                    onClick={() => {
                      navigate({
                        to: '/owners/$ownerId',
                        params: { ownerId: String(owner.id) },
                      });
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        backgroundColor: orgColor,
                        fontSize: '18px',
                        borderRadius: '6px',
                      }}
                    >
                      {owner.firstName.charAt(0)}
                      {owner.lastName.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: 600,
                          color: '#24292f',
                          marginBottom: 0.5,
                        }}
                      >
                        {owner.firstName} {owner.lastName}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '13px',
                          color: '#57606a',
                        }}
                      >
                        {owner.email}
                      </Typography>
                    </Box>
                  </Box>
                  {owner.phones.length > 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <PhoneIcon sx={{ fontSize: '16px', color: '#57606a' }} />
                      <Typography
                        sx={{
                          fontSize: '14px',
                          color: '#57606a',
                        }}
                      >
                        {owner.phones[0]}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Box>
            )}

            {/* Fourth Row: Notes - Full Width */}
            {surgery.notes && (
              <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                <Paper
                  sx={{
                    padding: 2.5,
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
                      marginBottom: 1.5,
                    }}
                  >
                    <NoteIcon sx={{ color: orgColor, fontSize: '18px' }} />
                    <Typography
                      sx={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#57606a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Notes
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: '#24292f',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.6,
                    }}
                  >
                    {surgery.notes}
                  </Typography>
                </Paper>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
