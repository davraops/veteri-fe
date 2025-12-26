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
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  CalendarToday as CalendarTodayIcon,
  Person as PersonIcon,
  Pets as PetsIcon,
  Business as BusinessIcon,
  Note as NoteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { mockAppointments } from '@/data/mockAppointments';
import { mockPets } from '@/data/mockPets';
import { mockOwners } from '@/data/mockOwners';
import { mockOrganizations } from '@/data/mockOrganizations';

export const Route = createFileRoute('/appointments/$appointmentId')({
  component: AppointmentDetail,
});

function AppointmentDetail() {
  const { appointmentId } = Route.useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Find appointment in mock data
  const appointmentIdNum = parseInt(appointmentId, 10);
  const appointment =
    !isNaN(appointmentIdNum) &&
    mockAppointments.find((apt) => apt.id === appointmentIdNum);

  if (!appointment) {
    return (
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <Topbar
          pageTitle="Appointment Not Found"
          onToggleSidebar={toggleSidebar}
        />
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
              Appointment not found
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate({ to: '/appointments' })}
              sx={{
                textTransform: 'none',
                backgroundColor: '#2563eb',
                '&:hover': {
                  backgroundColor: '#1d4ed8',
                },
              }}
            >
              Back to Appointments
            </Button>
          </Paper>
        </Box>
      </Box>
    );
  }

  // Get related data
  const pet = mockPets.find((p) => p.id === appointment.petId);
  const owner = pet
    ? mockOwners.find((o) => o.id === appointment.ownerId)
    : null;

  // Map organization slug to data organization identifier
  const getDataOrgId = (orgSlug: string) => {
    if (orgSlug === 'johndoe-org') return 'johndoe';
    return orgSlug;
  };

  const organization = mockOrganizations.find((org) => {
    const dataOrgId = getDataOrgId(org.slug);
    return dataOrgId === appointment.organization;
  });

  // Get assigned members from organization
  const assignedToArray = Array.isArray(appointment.assignedTo)
    ? appointment.assignedTo
    : [appointment.assignedTo];

  const assignedMembers = organization
    ? (assignedToArray
        .map((userId) => organization.members.find((m) => m.userId === userId))
        .filter((member) => member !== undefined) as NonNullable<
        typeof organization
      >['members'])
    : [];

  // Get role label based on appointment type and member role
  const getAssignedRoleLabel = (
    member: NonNullable<typeof organization>['members'][0]
  ) => {
    if (!member) return 'Unknown';

    const appointmentType = appointment.type;
    const memberRole = member.role;

    // For surgeries
    if (appointmentType === 'surgery') {
      if (memberRole === 'veterinarian' || memberRole === 'owner') {
        // Check position of veterinarian in the assigned team
        const veterinarians = assignedMembers
          .filter((m) => m.role === 'veterinarian' || m.role === 'owner')
          .sort((a, b) => {
            // Sort by order in assignedTo array
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
          // Third veterinarian could be anesthesiologist
          return 'Anesthesiologist';
        }
        return 'Surgeon';
      } else if (memberRole === 'veterinary_assistant') {
        return 'Surgery Assistant';
      }
      return 'Assistant';
    }

    // For consultations, checkups, vaccinations, emergencies
    if (
      appointmentType === 'consultation' ||
      appointmentType === 'checkup' ||
      appointmentType === 'vaccination' ||
      appointmentType === 'emergency'
    ) {
      if (memberRole === 'veterinarian' || memberRole === 'owner') {
        return 'Veterinarian';
      } else if (memberRole === 'veterinary_assistant') {
        return 'Veterinary Assistant';
      }
      return 'Assistant';
    }

    // For grooming
    if (appointmentType === 'grooming') {
      if (memberRole === 'veterinarian' || memberRole === 'owner') {
        return 'Supervisor';
      } else if (memberRole === 'veterinary_assistant') {
        return 'Groomer';
      }
      return 'Assistant';
    }

    // Default for other types
    if (memberRole === 'veterinarian' || memberRole === 'owner') {
      return 'Veterinarian';
    } else if (memberRole === 'veterinary_assistant') {
      return 'Veterinary Assistant';
    }
    return 'Assistant';
  };

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

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      consultation: 'Consultation',
      surgery: 'Surgery',
      vaccination: 'Vaccination',
      grooming: 'Grooming',
      checkup: 'Checkup',
      emergency: 'Emergency',
      other: 'Other',
    };
    return typeMap[type] || type;
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

  const startDateTime = formatDateTime(appointment.startTime);
  const endDateTime = formatDateTime(appointment.endTime);

  const orgColor = getOrganizationColor(appointment.organization);
  const statusColor = getStatusColor(appointment.status);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar pageTitle="Appointment Details" onToggleSidebar={toggleSidebar} />
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
          {/* Back Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate({ to: '/appointments' })}
            sx={{
              textTransform: 'none',
              color: '#57606a',
              marginBottom: 3,
              '&:hover': {
                backgroundColor: '#f6f8fa',
              },
            }}
          >
            Back to Appointments
          </Button>

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
                  <Chip
                    label={getTypeLabel(appointment.type)}
                    sx={{
                      backgroundColor: `${orgColor}15`,
                      color: orgColor,
                      fontWeight: 600,
                      fontSize: '12px',
                    }}
                  />
                  <Chip
                    label={appointment.status}
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
                  {appointment.title}
                </Typography>
                {appointment.description && (
                  <Typography
                    sx={{
                      fontSize: '16px',
                      color: '#57606a',
                      marginTop: 1,
                    }}
                  >
                    {appointment.description}
                  </Typography>
                )}
              </Box>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => {
                  // TODO: Navigate to edit appointment
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
                Edit
              </Button>
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
            {/* Left Column - Main Details */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Date & Time */}
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
                    marginBottom: 2,
                  }}
                >
                  <CalendarTodayIcon
                    sx={{ color: orgColor, fontSize: '20px' }}
                  />
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#57606a',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Date & Time
                  </Typography>
                </Box>
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#57606a',
                        marginBottom: 0.5,
                      }}
                    >
                      Start
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#24292f',
                      }}
                    >
                      {startDateTime.date}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#57606a',
                      }}
                    >
                      {startDateTime.time}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#57606a',
                        marginBottom: 0.5,
                      }}
                    >
                      End
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#24292f',
                      }}
                    >
                      {endDateTime.date}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#57606a',
                      }}
                    >
                      {endDateTime.time}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Pet Information */}
              {pet && (
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
                      marginBottom: 2,
                    }}
                  >
                    <PetsIcon sx={{ color: orgColor, fontSize: '20px' }} />
                    <Typography
                      sx={{
                        fontSize: '14px',
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
                        width: 56,
                        height: 56,
                        backgroundColor: orgColor,
                        fontSize: '20px',
                        borderRadius: '8px',
                      }}
                    >
                      {pet.name.charAt(0)}
                      {pet.lastName.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        sx={{
                          fontSize: '18px',
                          fontWeight: 600,
                          color: '#24292f',
                          marginBottom: 0.5,
                        }}
                      >
                        {pet.name} {pet.lastName}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          color: '#57606a',
                        }}
                      >
                        {pet.type} • {pet.breed}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate({
                        to: '/pets/$petId/history',
                        params: { petId: String(pet.id) },
                      });
                    }}
                    sx={{
                      textTransform: 'none',
                      borderColor: '#d0d7de',
                      color: '#24292f',
                      '&:hover': {
                        borderColor: orgColor,
                        backgroundColor: '#f6f8fa',
                      },
                    }}
                  >
                    View History
                  </Button>
                </Paper>
              )}

              {/* Notes */}
              {appointment.notes && (
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
                      marginBottom: 2,
                    }}
                  >
                    <NoteIcon sx={{ color: orgColor, fontSize: '20px' }} />
                    <Typography
                      sx={{
                        fontSize: '14px',
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
                    }}
                  >
                    {appointment.notes}
                  </Typography>
                </Paper>
              )}
            </Box>

            {/* Right Column - Sidebar Info */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Owner Information */}
              {owner && (
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
                      marginBottom: 2,
                    }}
                  >
                    <PersonIcon sx={{ color: orgColor, fontSize: '20px' }} />
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#57606a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Owner
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      marginBottom: 2,
                      cursor: 'pointer',
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
                        fontSize: '16px',
                        borderRadius: '8px',
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
                      {owner.email && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            marginBottom: 0.5,
                          }}
                        >
                          <EmailIcon
                            sx={{ fontSize: '14px', color: '#57606a' }}
                          />
                          <Typography
                            sx={{
                              fontSize: '13px',
                              color: '#57606a',
                            }}
                          >
                            {owner.email}
                          </Typography>
                        </Box>
                      )}
                      {owner.phones && owner.phones.length > 0 && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <PhoneIcon
                            sx={{ fontSize: '14px', color: '#57606a' }}
                          />
                          <Typography
                            sx={{
                              fontSize: '13px',
                              color: '#57606a',
                            }}
                          >
                            {owner.phones[0]}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Paper>
              )}

              {/* Organization */}
              {organization && (
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
                      marginBottom: 2,
                    }}
                  >
                    <BusinessIcon sx={{ color: orgColor, fontSize: '20px' }} />
                    <Typography
                      sx={{
                        fontSize: '14px',
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
                      gap: 2,
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
                        width: 48,
                        height: 48,
                        backgroundColor: orgColor,
                        fontSize: '16px',
                        borderRadius: '8px',
                      }}
                    >
                      {organization.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: 600,
                          color: '#24292f',
                        }}
                      >
                        {organization.name}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              )}

              {/* Assigned To */}
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
                    marginBottom: 2,
                  }}
                >
                  <PersonIcon sx={{ color: orgColor, fontSize: '20px' }} />
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#57606a',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {assignedMembers.length > 1
                      ? 'Assigned Team'
                      : 'Assigned To'}
                  </Typography>
                </Box>
                {assignedMembers.length > 0 ? (
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                  >
                    {assignedMembers.map((member) => (
                      <Box
                        key={member.userId}
                        sx={{
                          padding: 2,
                          backgroundColor: '#f6f8fa',
                          borderRadius: '6px',
                          border: '1px solid #e1e4e8',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '15px',
                            fontWeight: 600,
                            color: '#24292f',
                            marginBottom: 0.5,
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
                          {getAssignedRoleLabel(member)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#24292f',
                    }}
                  >
                    {Array.isArray(appointment.assignedTo)
                      ? appointment.assignedTo.join(', ')
                      : appointment.assignedTo}
                  </Typography>
                )}
              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
