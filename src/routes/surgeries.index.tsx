import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Card,
  CardContent,
  Grid,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  LocalHospital as SurgeryIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { mockAppointments, Appointment } from '@/data/mockAppointments';
import { mockOrganizations } from '@/data/mockOrganizations';
import { mockPets } from '@/data/mockPets';
import { mockOwners } from '@/data/mockOwners';

export const Route = createFileRoute('/surgeries/')({
  component: Surgeries,
});

// Current user ID (in a real app, this would come from auth context)
const currentUserId = 'johndoe';

function Surgeries() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Map organization slug to data organization identifier
  const getDataOrgId = (orgSlug: string) => {
    if (orgSlug === 'johndoe-org') return 'johndoe';
    return orgSlug;
  };

  // Filter only surgery appointments that involve the current user
  const surgeryAppointments = mockAppointments.filter((apt) => {
    // Only surgeries
    if (apt.type !== 'surgery') return false;

    // Check if appointment is in an organization where user is a member
    const aptOrg = mockOrganizations.find((org) => {
      const dataOrgId = getDataOrgId(org.slug);
      return dataOrgId === apt.organization;
    });

    if (!aptOrg) return false;

    // Check if user is a member of this organization
    const userMember = aptOrg.members.find(
      (member) => member.userId === currentUserId
    );
    if (!userMember) return false;

    // For personal organizations, show all appointments
    if (aptOrg.isPersonal) {
      return true;
    } else {
      // Shared organizations: only show appointments assigned to the user
      const assignedToArray = Array.isArray(apt.assignedTo)
        ? apt.assignedTo
        : [apt.assignedTo];
      return assignedToArray.includes(currentUserId);
    }
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
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    };
  };

  const getAppointmentInfo = (appointment: Appointment) => {
    const pet = mockPets.find((p) => p.id === appointment.petId);
    const owner = pet
      ? mockOwners.find((o) => o.id === appointment.ownerId)
      : null;
    const organization = mockOrganizations.find((org) => {
      const dataOrgId = getDataOrgId(org.slug);
      return dataOrgId === appointment.organization;
    });
    return { pet, owner, organization };
  };

  // Get assigned team members
  const getAssignedTeam = (appointment: Appointment) => {
    const organization = mockOrganizations.find((org) => {
      const dataOrgId = getDataOrgId(org.slug);
      return dataOrgId === appointment.organization;
    });

    if (!organization) return [];

    const assignedToArray = Array.isArray(appointment.assignedTo)
      ? appointment.assignedTo
      : [appointment.assignedTo];

    return assignedToArray
      .map((userId) => organization.members.find((m) => m.userId === userId))
      .filter((member) => member !== undefined);
  };

  const getRoleLabel = (
    member: NonNullable<(typeof mockOrganizations)[0]['members'][0]>
  ) => {
    if (member.role === 'veterinarian' || member.role === 'owner') {
      return 'Surgeon';
    } else if (member.role === 'veterinary_assistant') {
      return 'Surgery Assistant';
    }
    return 'Assistant';
  };

  // Sort appointments by start time (upcoming first)
  const sortedSurgeries = [...surgeryAppointments].sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  // Group by status
  const upcomingSurgeries = sortedSurgeries.filter(
    (apt) =>
      new Date(apt.startTime) >= new Date() &&
      apt.status !== 'completed' &&
      apt.status !== 'cancelled'
  );
  const completedSurgeries = sortedSurgeries.filter(
    (apt) => apt.status === 'completed'
  );

  // All surgeries list (for complete listing)
  const allSurgeries = sortedSurgeries;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar pageTitle="Surgeries" onToggleSidebar={toggleSidebar} />
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
                Surgeries
              </Typography>
              <Typography sx={{ color: '#57606a', fontSize: '14px' }}>
                Manage and track all surgical procedures
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                // TODO: Navigate to new surgery page
              }}
              sx={{
                textTransform: 'none',
                backgroundColor: '#dc2626',
                '&:hover': {
                  backgroundColor: '#b91c1c',
                },
              }}
            >
              New Surgery
            </Button>
          </Box>

          {/* Statistics */}
          <Grid container spacing={3} sx={{ marginBottom: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
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
                  <Box
                    sx={{
                      padding: 1,
                      backgroundColor: '#fef2f215',
                      borderRadius: '6px',
                    }}
                  >
                    <SurgeryIcon sx={{ color: '#dc2626', fontSize: '24px' }} />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#57606a',
                        textTransform: 'uppercase',
                      }}
                    >
                      Total
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#24292f',
                      }}
                    >
                      {surgeryAppointments.length}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
                  <Box
                    sx={{
                      padding: 1,
                      backgroundColor: '#e3f2fd15',
                      borderRadius: '6px',
                    }}
                  >
                    <CalendarTodayIcon
                      sx={{ color: '#2563eb', fontSize: '24px' }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#57606a',
                        textTransform: 'uppercase',
                      }}
                    >
                      Upcoming
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#24292f',
                      }}
                    >
                      {upcomingSurgeries.length}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
                  <Box
                    sx={{
                      padding: 1,
                      backgroundColor: '#e6ffed15',
                      borderRadius: '6px',
                    }}
                  >
                    <TimeIcon sx={{ color: '#10b981', fontSize: '24px' }} />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#57606a',
                        textTransform: 'uppercase',
                      }}
                    >
                      Completed
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#24292f',
                      }}
                    >
                      {completedSurgeries.length}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
                  <Box
                    sx={{
                      padding: 1,
                      backgroundColor: '#fef3c715',
                      borderRadius: '6px',
                    }}
                  >
                    <TimeIcon sx={{ color: '#f97316', fontSize: '24px' }} />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#57606a',
                        textTransform: 'uppercase',
                      }}
                    >
                      In Progress
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#24292f',
                      }}
                    >
                      {
                        sortedSurgeries.filter(
                          (apt) => apt.status === 'in_progress'
                        ).length
                      }
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* All Surgeries List */}
          {allSurgeries.length > 0 && (
            <Box sx={{ marginBottom: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#24292f',
                  marginBottom: 2,
                }}
              >
                All Surgeries ({allSurgeries.length})
              </Typography>
              <Paper
                sx={{
                  border: '1px solid #d0d7de',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      md: '200px 1fr 150px 120px 150px',
                    },
                    gap: 2,
                    padding: 2,
                    backgroundColor: '#f6f8fa',
                    borderBottom: '1px solid #d0d7de',
                    fontWeight: 600,
                    fontSize: '12px',
                    color: '#57606a',
                    textTransform: 'uppercase',
                  }}
                >
                  <Box>Date & Time</Box>
                  <Box>Surgery Details</Box>
                  <Box>Pet</Box>
                  <Box>Status</Box>
                  <Box>Organization</Box>
                </Box>
                {allSurgeries.map((appointment) => {
                  const { pet } = getAppointmentInfo(appointment);
                  const orgColor = getOrganizationColor(
                    appointment.organization
                  );
                  const statusColor = getStatusColor(appointment.status);
                  const dateTime = formatDateTime(appointment.startTime);
                  const assignedTeam = getAssignedTeam(appointment);

                  return (
                    <Box
                      key={appointment.id}
                      onClick={() => {
                        navigate({
                          to: '/surgeries/$surgeryId',
                          params: { surgeryId: String(appointment.id) },
                        });
                      }}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: '1fr',
                          md: '200px 1fr 150px 120px 150px',
                        },
                        gap: 2,
                        padding: 2,
                        borderBottom: '1px solid #f6f8fa',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: '#f6f8fa',
                        },
                        '&:last-child': {
                          borderBottom: 'none',
                        },
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#24292f',
                            marginBottom: 0.5,
                          }}
                        >
                          {dateTime.date}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '13px',
                            color: '#57606a',
                          }}
                        >
                          {dateTime.time}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: '15px',
                            fontWeight: 600,
                            color: '#24292f',
                            marginBottom: 0.5,
                          }}
                        >
                          {appointment.title}
                        </Typography>
                        {appointment.description && (
                          <Typography
                            sx={{
                              fontSize: '13px',
                              color: '#57606a',
                              marginBottom: 1,
                            }}
                          >
                            {appointment.description}
                          </Typography>
                        )}
                        {assignedTeam.length > 0 && (
                          <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                          >
                            {assignedTeam.map((member) => (
                              <Chip
                                key={member.userId}
                                label={`${member.firstName} ${member.lastName} (${getRoleLabel(member)})`}
                                size="small"
                                sx={{
                                  fontSize: '10px',
                                  height: 20,
                                  backgroundColor: '#f6f8fa',
                                  color: '#24292f',
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>
                      <Box>
                        {pet ? (
                          <>
                            <Typography
                              sx={{
                                fontSize: '14px',
                                fontWeight: 600,
                                color: '#24292f',
                                marginBottom: 0.5,
                              }}
                            >
                              {pet.name} {pet.lastName}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '12px',
                                color: '#57606a',
                              }}
                            >
                              {pet.type} • {pet.breed}
                            </Typography>
                          </>
                        ) : (
                          <Typography
                            sx={{ fontSize: '13px', color: '#57606a' }}
                          >
                            Pet not found
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        <Chip
                          label={appointment.status}
                          size="small"
                          sx={{
                            backgroundColor: `${statusColor}15`,
                            color: statusColor,
                            fontWeight: 600,
                            fontSize: '11px',
                            textTransform: 'capitalize',
                          }}
                        />
                      </Box>
                      <Box>
                        {organization ? (
                          <Chip
                            label={organization.name}
                            size="small"
                            sx={{
                              backgroundColor: `${orgColor}15`,
                              color: orgColor,
                              fontSize: '11px',
                            }}
                          />
                        ) : (
                          <Typography
                            sx={{ fontSize: '13px', color: '#57606a' }}
                          >
                            Unknown
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Paper>
            </Box>
          )}

          {/* Upcoming Surgeries */}
          {upcomingSurgeries.length > 0 && (
            <Box sx={{ marginBottom: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#24292f',
                  marginBottom: 2,
                }}
              >
                Upcoming Surgeries
              </Typography>
              <Grid container spacing={2}>
                {upcomingSurgeries.map((appointment) => {
                  const { pet } = getAppointmentInfo(appointment);
                  const orgColor = getOrganizationColor(
                    appointment.organization
                  );
                  const statusColor = getStatusColor(appointment.status);
                  const dateTime = formatDateTime(appointment.startTime);
                  const assignedTeam = getAssignedTeam(appointment);

                  return (
                    <Grid item xs={12} md={6} key={appointment.id}>
                      <Card
                        sx={{
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
                          navigate({
                            to: '/surgeries/$surgeryId',
                            params: { surgeryId: String(appointment.id) },
                          });
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              marginBottom: 2,
                            }}
                          >
                            <Box>
                              <Chip
                                label="Surgery"
                                size="small"
                                sx={{
                                  backgroundColor: `${orgColor}15`,
                                  color: orgColor,
                                  fontWeight: 600,
                                  fontSize: '11px',
                                  marginBottom: 1,
                                }}
                              />
                              <Chip
                                label={appointment.status}
                                size="small"
                                sx={{
                                  backgroundColor: `${statusColor}15`,
                                  color: statusColor,
                                  fontWeight: 600,
                                  fontSize: '11px',
                                  marginLeft: 1,
                                  textTransform: 'capitalize',
                                }}
                              />
                            </Box>
                            {organization && (
                              <Chip
                                label={organization.name}
                                size="small"
                                sx={{
                                  backgroundColor: `${orgColor}15`,
                                  color: orgColor,
                                  fontSize: '11px',
                                }}
                              />
                            )}
                          </Box>

                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: '#24292f',
                              marginBottom: 1.5,
                            }}
                          >
                            {appointment.title}
                          </Typography>

                          {appointment.description && (
                            <Typography
                              sx={{
                                fontSize: '14px',
                                color: '#57606a',
                                marginBottom: 2,
                              }}
                            >
                              {appointment.description}
                            </Typography>
                          )}

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              marginBottom: 2,
                            }}
                          >
                            <CalendarTodayIcon
                              sx={{ fontSize: '18px', color: '#57606a' }}
                            />
                            <Typography
                              sx={{ fontSize: '14px', color: '#24292f' }}
                            >
                              {dateTime.date}
                            </Typography>
                            <TimeIcon
                              sx={{
                                fontSize: '18px',
                                color: '#57606a',
                                marginLeft: 1,
                              }}
                            />
                            <Typography
                              sx={{ fontSize: '14px', color: '#24292f' }}
                            >
                              {dateTime.time}
                            </Typography>
                          </Box>

                          {pet && (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                marginBottom: 2,
                                padding: 1.5,
                                backgroundColor: '#f6f8fa',
                                borderRadius: '6px',
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
                                {pet.name.charAt(0)}
                                {pet.lastName.charAt(0)}
                              </Avatar>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography
                                  sx={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#24292f',
                                  }}
                                >
                                  {pet.name} {pet.lastName}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: '12px',
                                    color: '#57606a',
                                  }}
                                >
                                  {pet.type} • {pet.breed}
                                </Typography>
                              </Box>
                            </Box>
                          )}

                          {assignedTeam.length > 0 && (
                            <Box>
                              <Typography
                                sx={{
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  color: '#57606a',
                                  textTransform: 'uppercase',
                                  marginBottom: 1,
                                }}
                              >
                                Surgical Team
                              </Typography>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 1,
                                }}
                              >
                                {assignedTeam.map((member) => (
                                  <Chip
                                    key={member.userId}
                                    label={`${member.firstName} ${member.lastName} - ${getRoleLabel(member)}`}
                                    size="small"
                                    sx={{
                                      fontSize: '11px',
                                      backgroundColor: '#f6f8fa',
                                      color: '#24292f',
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}

          {/* Completed Surgeries */}
          {completedSurgeries.length > 0 && (
            <Box sx={{ marginBottom: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#24292f',
                  marginBottom: 2,
                }}
              >
                Completed Surgeries
              </Typography>
              <Grid container spacing={2}>
                {completedSurgeries.map((appointment) => {
                  const { pet } = getAppointmentInfo(appointment);
                  const orgColor = getOrganizationColor(
                    appointment.organization
                  );
                  const dateTime = formatDateTime(appointment.startTime);

                  return (
                    <Grid item xs={12} md={6} key={appointment.id}>
                      <Card
                        sx={{
                          border: '1px solid #d0d7de',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          opacity: 0.8,
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            borderColor: orgColor,
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            opacity: 1,
                          },
                        }}
                        onClick={() => {
                          navigate({
                            to: '/surgeries/$surgeryId',
                            params: { surgeryId: String(appointment.id) },
                          });
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              marginBottom: 2,
                            }}
                          >
                            <Chip
                              label="Surgery"
                              size="small"
                              sx={{
                                backgroundColor: `${orgColor}15`,
                                color: orgColor,
                                fontWeight: 600,
                                fontSize: '11px',
                              }}
                            />
                            <Chip
                              label="Completed"
                              size="small"
                              sx={{
                                backgroundColor: '#57606a15',
                                color: '#57606a',
                                fontWeight: 600,
                                fontSize: '11px',
                              }}
                            />
                          </Box>

                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: '#24292f',
                              marginBottom: 1,
                            }}
                          >
                            {appointment.title}
                          </Typography>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              marginTop: 1.5,
                            }}
                          >
                            <CalendarTodayIcon
                              sx={{ fontSize: '16px', color: '#57606a' }}
                            />
                            <Typography
                              sx={{ fontSize: '13px', color: '#57606a' }}
                            >
                              {dateTime.date} at {dateTime.time}
                            </Typography>
                          </Box>

                          {pet && (
                            <Typography
                              sx={{
                                fontSize: '13px',
                                color: '#57606a',
                                marginTop: 1,
                              }}
                            >
                              {pet.name} {pet.lastName}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}

          {/* Empty State */}
          {surgeryAppointments.length === 0 && (
            <Paper
              sx={{
                padding: 6,
                textAlign: 'center',
                backgroundColor: '#ffffff',
                border: '1px solid #d0d7de',
                borderRadius: '8px',
              }}
            >
              <SurgeryIcon
                sx={{ fontSize: 64, color: '#d0d7de', marginBottom: 2 }}
              />
              <Typography
                variant="h6"
                sx={{ marginBottom: 1, color: '#24292f' }}
              >
                No surgeries scheduled
              </Typography>
              <Typography sx={{ color: '#57606a', marginBottom: 3 }}>
                Get started by scheduling a new surgical procedure
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  // TODO: Navigate to new surgery page
                }}
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#dc2626',
                  '&:hover': {
                    backgroundColor: '#b91c1c',
                  },
                }}
              >
                New Surgery
              </Button>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
}
