import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  CalendarToday as CalendarTodayIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
  ViewModule as ViewModuleIcon,
  List as ListIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { mockAppointments, Appointment } from '@/data/mockAppointments';
import { mockOrganizations } from '@/data/mockOrganizations';
import { mockPets } from '@/data/mockPets';
import { mockOwners } from '@/data/mockOwners';

export const Route = createFileRoute('/appointments/')({
  component: Appointments,
});

type ViewType = 'agenda' | 'day' | 'week' | 'month';

function Appointments() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewType, setViewType] = useState<ViewType>('week');
  const [organizationFilter, setOrganizationFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  // Initialize to a date that has appointments (January 15, 2026)
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const date = new Date(2026, 0, 15); // January 15, 2026 (month is 0-indexed)
    return date;
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Navigation functions
  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const goToPrevious = () => {
    const newDate = new Date(selectedDate);
    if (viewType === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (viewType === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setSelectedDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(selectedDate);
    if (viewType === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewType === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  // Format date based on view type
  const getDateLabel = () => {
    if (viewType === 'day') {
      return selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } else if (viewType === 'week') {
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${startOfWeek.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
        })} - ${endOfWeek.toLocaleDateString('en-US', {
          day: 'numeric',
          year: 'numeric',
        })}`;
      } else {
        return `${startOfWeek.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })} - ${endOfWeek.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}`;
      }
    } else if (viewType === 'month') {
      return selectedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      });
    }
    return '';
  };

  // Map organization slug to data organization identifier
  const getDataOrgId = (orgSlug: string) => {
    if (orgSlug === 'johndoe-org') return 'johndoe';
    return orgSlug;
  };

  // Current user ID (in a real app, this would come from auth context)
  const currentUserId = 'johndoe';

  // Filter appointments by organization, type, and user involvement
  const filteredAppointments = mockAppointments.filter((apt) => {
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
      // Personal org: show all appointments (user is owner)
    } else {
      // Shared organizations: only show appointments assigned to the user
      const assignedToArray = Array.isArray(apt.assignedTo)
        ? apt.assignedTo
        : [apt.assignedTo];
      if (!assignedToArray.includes(currentUserId)) return false;
    }

    // Filter by organization (if filter is set)
    if (organizationFilter !== 'all') {
      const org = mockOrganizations.find(
        (o) => o.organizationId === parseInt(organizationFilter, 10)
      );
      if (!org) return false;

      const dataOrgId = getDataOrgId(org.slug);
      if (apt.organization !== dataOrgId) return false;
    }

    // Filter by type
    if (typeFilter !== 'all') {
      if (apt.type !== typeFilter) return false;
    }

    return true;
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

  // Get unique appointment types from mock data
  const appointmentTypes = Array.from(
    new Set(mockAppointments.map((apt) => apt.type))
  ).sort();

  // Calculate week summary
  const getWeekStart = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const getWeekEnd = (date: Date) => {
    const end = new Date(date);
    end.setDate(date.getDate() - date.getDay() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  };

  const weekStart = getWeekStart(selectedDate);
  const weekEnd = getWeekEnd(selectedDate);

  // Get appointments for the current week
  const weekAppointments = filteredAppointments.filter((apt) => {
    const aptDate = new Date(apt.startTime);
    return aptDate >= weekStart && aptDate <= weekEnd;
  });

  // Calculate week statistics
  const weekStats = {
    total: weekAppointments.length,
    byType: appointmentTypes.reduce(
      (acc, type) => {
        acc[type] = weekAppointments.filter((apt) => apt.type === type).length;
        return acc;
      },
      {} as Record<string, number>
    ),
    byStatus: {
      scheduled: weekAppointments.filter((apt) => apt.status === 'scheduled')
        .length,
      confirmed: weekAppointments.filter((apt) => apt.status === 'confirmed')
        .length,
      in_progress: weekAppointments.filter(
        (apt) => apt.status === 'in_progress'
      ).length,
      completed: weekAppointments.filter((apt) => apt.status === 'completed')
        .length,
      cancelled: weekAppointments.filter((apt) => apt.status === 'cancelled')
        .length,
    },
    upcoming: weekAppointments
      .filter((apt) => {
        const aptDate = new Date(apt.startTime);
        return aptDate > new Date();
      })
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      )
      .slice(0, 3),
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get pet and owner info for appointment
  const getAppointmentInfo = (appointment: Appointment) => {
    const pet = mockPets.find((p) => p.id === appointment.petId);
    const owner = pet
      ? mockOwners.find((o) => o.id === appointment.ownerId)
      : null;
    return { pet, owner };
  };

  // Helper function to check if two dates are on the same day
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Helper function to check if two appointments overlap
  const appointmentsOverlap = (
    apt1: Appointment,
    apt2: Appointment
  ): boolean => {
    const start1 = new Date(apt1.startTime).getTime();
    const end1 = new Date(apt1.endTime).getTime();
    const start2 = new Date(apt2.startTime).getTime();
    const end2 = new Date(apt2.endTime).getTime();
    return start1 < end2 && end1 > start2;
  };

  // Function to assign columns to appointments to avoid overlapping
  const assignColumns = (appointments: Appointment[]): Map<number, number> => {
    const columnMap = new Map<number, number>();
    const columns: Appointment[][] = [];

    // Sort appointments by start time
    const sorted = [...appointments].sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    for (const apt of sorted) {
      // Find the first column where this appointment doesn't overlap
      let columnIndex = 0;
      while (columnIndex < columns.length) {
        const columnAppointments = columns[columnIndex];
        const hasOverlap = columnAppointments.some((existingApt) =>
          appointmentsOverlap(apt, existingApt)
        );
        if (!hasOverlap) {
          break;
        }
        columnIndex++;
      }

      // If no suitable column found, create a new one
      if (columnIndex >= columns.length) {
        columns.push([]);
      }

      columns[columnIndex].push(apt);
      columnMap.set(apt.id, columnIndex);
    }

    return columnMap;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar pageTitle="Appointments" onToggleSidebar={toggleSidebar} />
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
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#24292f' }}>
              Appointments
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                // TODO: Navigate to new appointment page
              }}
              sx={{
                textTransform: 'none',
                backgroundColor: '#10b981',
                '&:hover': {
                  backgroundColor: '#059669',
                },
              }}
            >
              New Appointment
            </Button>
          </Box>

          {/* Week Summary */}
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
                alignItems: 'center',
                gap: 1.5,
                marginBottom: 3,
              }}
            >
              <DateRangeIcon sx={{ color: '#2563eb', fontSize: '24px' }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#24292f',
                }}
              >
                Week Summary
              </Typography>
              <Typography
                sx={{
                  fontSize: '14px',
                  color: '#57606a',
                  marginLeft: 1,
                }}
              >
                {weekStart.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                -{' '}
                {weekEnd.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)',
                },
                gap: 2,
                marginBottom: 3,
              }}
            >
              {/* Total Appointments */}
              <Paper
                sx={{
                  padding: 2.5,
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '8px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 60,
                    height: 60,
                    backgroundColor: '#2563eb20',
                    borderRadius: '50%',
                    transform: 'translate(20px, -20px)',
                  }}
                />
                <Box sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      marginBottom: 1,
                    }}
                  >
                    <CalendarTodayIcon
                      sx={{ color: '#2563eb', fontSize: '20px' }}
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
                      Total
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '32px',
                      fontWeight: 700,
                      color: '#2563eb',
                      lineHeight: 1,
                    }}
                  >
                    {weekStats.total}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      color: '#57606a',
                      marginTop: 0.5,
                    }}
                  >
                    Appointments
                  </Typography>
                </Box>
              </Paper>

              {/* Confirmed */}
              <Paper
                sx={{
                  padding: 2.5,
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '8px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 60,
                    height: 60,
                    backgroundColor: '#10b98120',
                    borderRadius: '50%',
                    transform: 'translate(20px, -20px)',
                  }}
                />
                <Box sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      marginBottom: 1,
                    }}
                  >
                    <CheckCircleIcon
                      sx={{ color: '#10b981', fontSize: '20px' }}
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
                      Confirmed
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '32px',
                      fontWeight: 700,
                      color: '#10b981',
                      lineHeight: 1,
                    }}
                  >
                    {weekStats.byStatus.confirmed}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      color: '#57606a',
                      marginTop: 0.5,
                    }}
                  >
                    Ready to go
                  </Typography>
                </Box>
              </Paper>

              {/* Scheduled */}
              <Paper
                sx={{
                  padding: 2.5,
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 60,
                    height: 60,
                    backgroundColor: '#2563eb20',
                    borderRadius: '50%',
                    transform: 'translate(20px, -20px)',
                  }}
                />
                <Box sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      marginBottom: 1,
                    }}
                  >
                    <ScheduleIcon sx={{ color: '#2563eb', fontSize: '20px' }} />
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#57606a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Scheduled
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '32px',
                      fontWeight: 700,
                      color: '#2563eb',
                      lineHeight: 1,
                    }}
                  >
                    {weekStats.byStatus.scheduled}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      color: '#57606a',
                      marginTop: 0.5,
                    }}
                  >
                    Pending confirmation
                  </Typography>
                </Box>
              </Paper>

              {/* Most Common Type */}
              <Paper
                sx={{
                  padding: 2.5,
                  backgroundColor: '#fff7ed',
                  border: '1px solid #fed7aa',
                  borderRadius: '8px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 60,
                    height: 60,
                    backgroundColor: '#f9731620',
                    borderRadius: '50%',
                    transform: 'translate(20px, -20px)',
                  }}
                />
                <Box sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      marginBottom: 1,
                    }}
                  >
                    <TrendingUpIcon
                      sx={{ color: '#f97316', fontSize: '20px' }}
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
                      Top Type
                    </Typography>
                  </Box>
                  {(() => {
                    const topType = Object.entries(weekStats.byType).sort(
                      (a, b) => b[1] - a[1]
                    )[0];
                    return topType && topType[1] > 0 ? (
                      <>
                        <Typography
                          sx={{
                            fontSize: '24px',
                            fontWeight: 700,
                            color: '#f97316',
                            lineHeight: 1,
                          }}
                        >
                          {topType[1]}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '12px',
                            color: '#57606a',
                            marginTop: 0.5,
                          }}
                        >
                          {getTypeLabel(topType[0])}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography
                          sx={{
                            fontSize: '24px',
                            fontWeight: 700,
                            color: '#f97316',
                            lineHeight: 1,
                          }}
                        >
                          0
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '12px',
                            color: '#57606a',
                            marginTop: 0.5,
                          }}
                        >
                          No data
                        </Typography>
                      </>
                    );
                  })()}
                </Box>
              </Paper>
            </Box>

            {/* Summary by Type */}
            <Box sx={{ marginTop: 3 }}>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#24292f',
                  marginBottom: 2,
                }}
              >
                Summary by Type
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)',
                  },
                  gap: 2,
                }}
              >
                {appointmentTypes.map((type) => {
                  const count = weekStats.byType[type] || 0;
                  if (count === 0) return null;

                  const typeColors: Record<
                    string,
                    { bg: string; border: string; text: string }
                  > = {
                    consultation: {
                      bg: '#eff6ff',
                      border: '#bfdbfe',
                      text: '#2563eb',
                    },
                    surgery: {
                      bg: '#fef2f2',
                      border: '#fecaca',
                      text: '#dc2626',
                    },
                    vaccination: {
                      bg: '#f0fdf4',
                      border: '#bbf7d0',
                      text: '#10b981',
                    },
                    grooming: {
                      bg: '#fef3c7',
                      border: '#fde68a',
                      text: '#d97706',
                    },
                    checkup: {
                      bg: '#f0f9ff',
                      border: '#bae6fd',
                      text: '#0284c7',
                    },
                    emergency: {
                      bg: '#fef2f2',
                      border: '#fecaca',
                      text: '#ef4444',
                    },
                    other: {
                      bg: '#f3f4f6',
                      border: '#d1d5db',
                      text: '#6b7280',
                    },
                  };

                  const colors = typeColors[type] || typeColors.other;

                  return (
                    <Paper
                      key={type}
                      sx={{
                        padding: 2,
                        backgroundColor: colors.bg,
                        border: `1px solid ${colors.border}`,
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#57606a',
                            marginBottom: 0.5,
                          }}
                        >
                          {getTypeLabel(type)}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '20px',
                            fontWeight: 700,
                            color: colors.text,
                            lineHeight: 1,
                          }}
                        >
                          {count}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '8px',
                          backgroundColor: `${colors.text}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '18px',
                            fontWeight: 700,
                            color: colors.text,
                          }}
                        >
                          {count}
                        </Typography>
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            </Box>

            {/* Upcoming Appointments */}
            {weekStats.upcoming.length > 0 && (
              <Box>
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#24292f',
                    marginBottom: 2,
                  }}
                >
                  Upcoming This Week
                </Typography>
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
                >
                  {weekStats.upcoming.map((appointment: Appointment) => {
                    const { pet } = getAppointmentInfo(appointment);
                    const orgColor = getOrganizationColor(
                      appointment.organization
                    );
                    const aptDate = new Date(appointment.startTime);
                    return (
                      <Box
                        key={appointment.id}
                        onClick={() => {
                          navigate({
                            to: '/appointments/$appointmentId',
                            params: { appointmentId: String(appointment.id) },
                          });
                        }}
                        sx={{
                          padding: 2,
                          backgroundColor: '#f6f8fa',
                          border: '1px solid #e1e4e8',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            borderColor: orgColor,
                            backgroundColor: '#ffffff',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                          }}
                        >
                          <Box sx={{ flexGrow: 1 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                marginBottom: 1,
                              }}
                            >
                              <Chip
                                label={getTypeLabel(appointment.type)}
                                size="small"
                                sx={{
                                  backgroundColor: `${orgColor}15`,
                                  color: orgColor,
                                  fontWeight: 600,
                                  fontSize: '11px',
                                }}
                              />
                              <Chip
                                label={appointment.status}
                                size="small"
                                sx={{
                                  backgroundColor: `${getStatusColor(
                                    appointment.status
                                  )}15`,
                                  color: getStatusColor(appointment.status),
                                  fontWeight: 600,
                                  fontSize: '11px',
                                  textTransform: 'capitalize',
                                }}
                              />
                            </Box>
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
                            {pet && (
                              <Typography
                                sx={{
                                  fontSize: '13px',
                                  color: '#57606a',
                                }}
                              >
                                {pet.name} {pet.lastName}
                              </Typography>
                            )}
                          </Box>
                          <Box
                            sx={{
                              textAlign: 'right',
                              minWidth: 100,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#24292f',
                              }}
                            >
                              {aptDate.toLocaleDateString('en-US', {
                                weekday: 'short',
                              })}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '13px',
                                color: '#57606a',
                              }}
                            >
                              {formatTime(appointment.startTime)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}
          </Paper>

          {/* Filters and View Tabs */}
          <Paper
            sx={{
              padding: 2,
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
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              {/* Filters */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {/* Organization Filter */}
                <FormControl
                  sx={{
                    minWidth: 200,
                  }}
                >
                  <InputLabel>Organization</InputLabel>
                  <Select
                    value={organizationFilter}
                    onChange={(e) => setOrganizationFilter(e.target.value)}
                    label="Organization"
                    sx={{
                      backgroundColor: '#ffffff',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2563eb',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2563eb',
                      },
                    }}
                  >
                    <MenuItem value="all">All Organizations</MenuItem>
                    {mockOrganizations.map((org) => (
                      <MenuItem key={org.id} value={String(org.organizationId)}>
                        {org.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Type Filter */}
                <FormControl
                  sx={{
                    minWidth: 200,
                  }}
                >
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    label="Type"
                    sx={{
                      backgroundColor: '#ffffff',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2563eb',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2563eb',
                      },
                    }}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    {appointmentTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {getTypeLabel(type)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* View Type Tabs */}
              <Tabs
                value={viewType}
                onChange={(_, newValue) => setViewType(newValue as ViewType)}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    minWidth: 100,
                    fontSize: '14px',
                    fontWeight: 500,
                  },
                  '& .Mui-selected': {
                    color: '#2563eb',
                  },
                }}
              >
                <Tab
                  icon={<ListIcon />}
                  iconPosition="start"
                  label="Agenda"
                  value="agenda"
                />
                <Tab
                  icon={<TodayIcon />}
                  iconPosition="start"
                  label="Day"
                  value="day"
                />
                <Tab
                  icon={<DateRangeIcon />}
                  iconPosition="start"
                  label="Week"
                  value="week"
                />
                <Tab
                  icon={<ViewModuleIcon />}
                  iconPosition="start"
                  label="Month"
                  value="month"
                />
              </Tabs>
            </Box>
          </Paper>

          {/* Calendar View Content */}
          <Paper
            sx={{
              padding: 3,
              backgroundColor: '#ffffff',
              border: '1px solid #d0d7de',
              borderRadius: '8px',
              minHeight: 600,
            }}
          >
            {viewType === 'agenda' && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#24292f',
                    }}
                  >
                    Agenda View
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={goToToday}
                      startIcon={<CalendarTodayIcon />}
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
                      Today
                    </Button>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {filteredAppointments
                    .sort(
                      (a, b) =>
                        new Date(a.startTime).getTime() -
                        new Date(b.startTime).getTime()
                    )
                    .map((appointment) => {
                      const { pet, owner } = getAppointmentInfo(appointment);
                      const orgColor = getOrganizationColor(
                        appointment.organization
                      );
                      return (
                        <Box
                          key={appointment.id}
                          onClick={() => {
                            navigate({
                              to: '/appointments/$appointmentId',
                              params: { appointmentId: String(appointment.id) },
                            });
                          }}
                          sx={{
                            padding: 2,
                            border: '1px solid #d0d7de',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              borderColor: orgColor,
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                minWidth: 120,
                                paddingRight: 2,
                                borderRight: '1px solid #f6f8fa',
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: '14px',
                                  fontWeight: 600,
                                  color: '#24292f',
                                }}
                              >
                                {formatDate(appointment.startTime)}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: '13px',
                                  color: '#57606a',
                                  marginTop: 0.5,
                                }}
                              >
                                {formatTime(appointment.startTime)} -{' '}
                                {formatTime(appointment.endTime)}
                              </Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1.5,
                                  marginBottom: 1,
                                }}
                              >
                                <Chip
                                  label={getTypeLabel(appointment.type)}
                                  size="small"
                                  sx={{
                                    backgroundColor: `${orgColor}15`,
                                    color: orgColor,
                                    fontWeight: 600,
                                    fontSize: '11px',
                                  }}
                                />
                                <Chip
                                  label={appointment.status}
                                  size="small"
                                  sx={{
                                    backgroundColor: `${getStatusColor(
                                      appointment.status
                                    )}15`,
                                    color: getStatusColor(appointment.status),
                                    fontWeight: 600,
                                    fontSize: '11px',
                                    textTransform: 'capitalize',
                                  }}
                                />
                              </Box>
                              <Typography
                                sx={{
                                  fontSize: '16px',
                                  fontWeight: 600,
                                  color: '#24292f',
                                  marginBottom: 0.5,
                                }}
                              >
                                {appointment.title}
                              </Typography>
                              {pet && owner && (
                                <Typography
                                  sx={{
                                    fontSize: '14px',
                                    color: '#57606a',
                                    marginBottom: 0.5,
                                  }}
                                >
                                  {pet.name} {pet.lastName} - {owner.firstName}{' '}
                                  {owner.lastName}
                                </Typography>
                              )}
                              {appointment.description && (
                                <Typography
                                  sx={{
                                    fontSize: '14px',
                                    color: '#57606a',
                                  }}
                                >
                                  {appointment.description}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  {filteredAppointments.length === 0 && (
                    <Box
                      sx={{
                        padding: 6,
                        textAlign: 'center',
                        color: '#57606a',
                      }}
                    >
                      <CalendarTodayIcon
                        sx={{ fontSize: 48, color: '#d0d7de', marginBottom: 2 }}
                      />
                      <Typography variant="h6" sx={{ marginBottom: 1 }}>
                        No appointments found
                      </Typography>
                      <Typography>
                        {organizationFilter === 'all'
                          ? 'No appointments scheduled'
                          : 'No appointments for this organization'}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            {viewType === 'day' && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={goToPrevious}
                      sx={{
                        minWidth: 40,
                        padding: '6px 8px',
                        borderColor: '#d0d7de',
                        color: '#24292f',
                        '&:hover': {
                          borderColor: '#2563eb',
                          backgroundColor: '#f6f8fa',
                        },
                      }}
                    >
                      <ChevronLeftIcon />
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={goToNext}
                      sx={{
                        minWidth: 40,
                        padding: '6px 8px',
                        borderColor: '#d0d7de',
                        color: '#24292f',
                        '&:hover': {
                          borderColor: '#2563eb',
                          backgroundColor: '#f6f8fa',
                        },
                      }}
                    >
                      <ChevronRightIcon />
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={goToToday}
                      startIcon={<CalendarTodayIcon />}
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
                      Today
                    </Button>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#24292f',
                        marginLeft: 2,
                      }}
                    >
                      {getDateLabel()}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr',
                    gap: 2,
                    overflow: 'hidden',
                  }}
                >
                  {/* Time slots */}
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i;
                      return (
                        <Box
                          key={hour}
                          sx={{
                            height: 60,
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-end',
                            paddingRight: 2,
                            paddingTop: 0.5,
                            flexShrink: 0,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '12px',
                              color: '#57606a',
                            }}
                          >
                            {hour.toString().padStart(2, '0')}:00
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                  {/* Appointments column */}
                  <Box
                    sx={{
                      position: 'relative',
                      height: 1440,
                      overflow: 'hidden',
                    }}
                  >
                    {(() => {
                      // Get all appointments for the selected date
                      const dayAppointments = filteredAppointments.filter(
                        (apt) => {
                          const aptDate = new Date(apt.startTime);
                          return isSameDay(aptDate, selectedDate);
                        }
                      );

                      // Assign columns to avoid overlapping
                      const columnMap = assignColumns(dayAppointments);
                      const maxColumns = Math.max(
                        1,
                        Math.max(...Array.from(columnMap.values())) + 1
                      );

                      return dayAppointments.map((appointment) => {
                        const { pet } = getAppointmentInfo(appointment);
                        const orgColor = getOrganizationColor(
                          appointment.organization
                        );
                        const start = new Date(appointment.startTime);
                        const end = new Date(appointment.endTime);
                        const duration =
                          (end.getTime() - start.getTime()) / (1000 * 60);
                        const startHour = start.getHours();
                        const startMinutes = start.getMinutes();
                        const totalMinutes = startHour * 60 + startMinutes;
                        const topPosition = (totalMinutes / 1440) * 100;
                        const heightPercent = (duration / 1440) * 100;

                        const column = columnMap.get(appointment.id) || 0;
                        const columnWidth = 100 / maxColumns;
                        const leftPercent = column * columnWidth;
                        const rightPercent = 100 - (column + 1) * columnWidth;

                        return (
                          <Box
                            key={appointment.id}
                            onClick={() => {
                              navigate({
                                to: '/appointments/$appointmentId',
                                params: {
                                  appointmentId: String(appointment.id),
                                },
                              });
                            }}
                            sx={{
                              position: 'absolute',
                              top: `${topPosition}%`,
                              left: `${leftPercent + 0.5}%`,
                              right: `${rightPercent + 0.5}%`,
                              height: `${Math.max(heightPercent, 1)}%`,
                              minHeight: 20,
                              backgroundColor: `${orgColor}15`,
                              borderLeft: `3px solid ${orgColor}`,
                              borderRadius: '4px',
                              padding: 1,
                              cursor: 'pointer',
                              overflow: 'hidden',
                              '&:hover': {
                                backgroundColor: `${orgColor}25`,
                                zIndex: 10,
                              },
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#24292f',
                                lineHeight: 1.2,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {formatTime(appointment.startTime)} -{' '}
                              {appointment.title}
                            </Typography>
                            {pet && (
                              <Typography
                                sx={{
                                  fontSize: '11px',
                                  color: '#57606a',
                                  marginTop: 0.25,
                                  lineHeight: 1.2,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {pet.name} {pet.lastName}
                              </Typography>
                            )}
                          </Box>
                        );
                      });
                    })()}
                  </Box>
                </Box>
              </Box>
            )}

            {viewType === 'week' && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={goToPrevious}
                      sx={{
                        minWidth: 40,
                        padding: '6px 8px',
                        borderColor: '#d0d7de',
                        color: '#24292f',
                        '&:hover': {
                          borderColor: '#2563eb',
                          backgroundColor: '#f6f8fa',
                        },
                      }}
                    >
                      <ChevronLeftIcon />
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={goToNext}
                      sx={{
                        minWidth: 40,
                        padding: '6px 8px',
                        borderColor: '#d0d7de',
                        color: '#24292f',
                        '&:hover': {
                          borderColor: '#2563eb',
                          backgroundColor: '#f6f8fa',
                        },
                      }}
                    >
                      <ChevronRightIcon />
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={goToToday}
                      startIcon={<CalendarTodayIcon />}
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
                      Today
                    </Button>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#24292f',
                        marginLeft: 2,
                      }}
                    >
                      {getDateLabel()}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '120px repeat(7, 1fr)',
                    gap: 1,
                    border: '1px solid #d0d7de',
                    borderRadius: '6px',
                    overflow: 'visible', // Allow appointments to extend across cells
                    position: 'relative',
                  }}
                >
                  {/* Header */}
                  <Box
                    sx={{
                      padding: 2,
                      backgroundColor: '#f6f8fa',
                      borderRight: '1px solid #d0d7de',
                    }}
                  />
                  {Array.from({ length: 7 }, (_, i) => {
                    const date = new Date(selectedDate);
                    date.setDate(
                      selectedDate.getDate() - selectedDate.getDay() + i
                    );
                    return (
                      <Box
                        key={i}
                        sx={{
                          padding: 2,
                          backgroundColor:
                            date.toDateString() === new Date().toDateString()
                              ? '#dbeafe'
                              : '#f6f8fa',
                          borderRight: i < 6 ? '1px solid #d0d7de' : 'none',
                          textAlign: 'center',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#57606a',
                            textTransform: 'uppercase',
                            marginBottom: 0.5,
                          }}
                        >
                          {date.toLocaleDateString('en-US', {
                            weekday: 'short',
                          })}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '18px',
                            fontWeight: 600,
                            color: '#24292f',
                          }}
                        >
                          {date.getDate()}
                        </Typography>
                      </Box>
                    );
                  })}

                  {/* Time slots */}
                  <Box sx={{ gridColumn: '1', gridRow: '2 / -1' }}>
                    {Array.from({ length: 24 }, (_, hour) => (
                      <Box
                        key={hour}
                        sx={{
                          height: 60,
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'flex-end',
                          paddingRight: 2,
                          paddingTop: 0.5,
                          borderTop: '1px solid #d0d7de',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '11px',
                            color: '#57606a',
                          }}
                        >
                          {hour.toString().padStart(2, '0')}:00
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Day columns with appointments */}
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const date = new Date(selectedDate);
                    date.setDate(
                      selectedDate.getDate() - selectedDate.getDay() + dayIndex
                    );

                    // Get all appointments for this day
                    const dayAppointments = filteredAppointments.filter(
                      (apt) => {
                        const aptDate = new Date(apt.startTime);
                        return isSameDay(aptDate, date);
                      }
                    );

                    // Assign columns to avoid overlapping
                    const columnMap = assignColumns(dayAppointments);
                    const maxColumns = Math.max(
                      1,
                      Math.max(...Array.from(columnMap.values()), -1) + 1
                    );

                    return (
                      <Box
                        key={`day-${dayIndex}`}
                        sx={{
                          gridColumn: `${dayIndex + 2}`,
                          gridRow: '2 / -1',
                          position: 'relative',
                          height: 1440, // 24 hours * 60px
                          borderRight:
                            dayIndex < 6 ? '1px solid #d0d7de' : 'none',
                        }}
                      >
                        {/* Hour dividers */}
                        {Array.from({ length: 24 }, (_, hour) => (
                          <Box
                            key={hour}
                            sx={{
                              height: 60,
                              borderTop: '1px solid #f6f8fa',
                              position: 'relative',
                            }}
                          />
                        ))}

                        {/* Appointments */}
                        {dayAppointments.map((appointment) => {
                          const { pet } = getAppointmentInfo(appointment);
                          const orgColor = getOrganizationColor(
                            appointment.organization
                          );
                          const start = new Date(appointment.startTime);
                          const end = new Date(appointment.endTime);
                          const duration =
                            (end.getTime() - start.getTime()) / (1000 * 60);
                          const startHour = start.getHours();
                          const startMinutes = start.getMinutes();
                          const totalMinutes = startHour * 60 + startMinutes;
                          const topPosition = (totalMinutes / 1440) * 100;
                          const heightPercent = (duration / 1440) * 100;

                          const column = columnMap.get(appointment.id) || 0;
                          const columnWidth = 100 / maxColumns;
                          const leftPercent = column * columnWidth;
                          const rightPercent = 100 - (column + 1) * columnWidth;

                          return (
                            <Box
                              key={appointment.id}
                              onClick={() => {
                                navigate({
                                  to: '/appointments/$appointmentId',
                                  params: {
                                    appointmentId: String(appointment.id),
                                  },
                                });
                              }}
                              sx={{
                                position: 'absolute',
                                top: `${topPosition}%`,
                                left: `${leftPercent + 0.5}%`,
                                right: `${rightPercent + 0.5}%`,
                                height: `${Math.max(heightPercent, 1)}%`,
                                minHeight: 20,
                                backgroundColor: `${orgColor}15`,
                                borderLeft: `3px solid ${orgColor}`,
                                borderRadius: '4px',
                                padding: 0.75,
                                cursor: 'pointer',
                                overflow: 'hidden',
                                zIndex: 1,
                                '&:hover': {
                                  backgroundColor: `${orgColor}25`,
                                  zIndex: 10,
                                },
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  color: '#24292f',
                                  lineHeight: 1.2,
                                }}
                              >
                                {formatTime(appointment.startTime)}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: '10px',
                                  color: '#57606a',
                                  lineHeight: 1.2,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {appointment.title}
                              </Typography>
                              {pet && (
                                <Typography
                                  sx={{
                                    fontSize: '9px',
                                    color: '#57606a',
                                    lineHeight: 1.2,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {pet.name}
                                </Typography>
                              )}
                            </Box>
                          );
                        })}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}

            {viewType === 'month' && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={goToPrevious}
                      sx={{
                        minWidth: 40,
                        padding: '6px 8px',
                        borderColor: '#d0d7de',
                        color: '#24292f',
                        '&:hover': {
                          borderColor: '#2563eb',
                          backgroundColor: '#f6f8fa',
                        },
                      }}
                    >
                      <ChevronLeftIcon />
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={goToNext}
                      sx={{
                        minWidth: 40,
                        padding: '6px 8px',
                        borderColor: '#d0d7de',
                        color: '#24292f',
                        '&:hover': {
                          borderColor: '#2563eb',
                          backgroundColor: '#f6f8fa',
                        },
                      }}
                    >
                      <ChevronRightIcon />
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={goToToday}
                      startIcon={<CalendarTodayIcon />}
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
                      Today
                    </Button>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#24292f',
                        marginLeft: 2,
                      }}
                    >
                      {getDateLabel()}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: 1,
                    border: '1px solid #d0d7de',
                    borderRadius: '6px',
                    overflow: 'hidden',
                  }}
                >
                  {/* Day headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                    (day) => (
                      <Box
                        key={day}
                        sx={{
                          padding: 2,
                          backgroundColor: '#f6f8fa',
                          textAlign: 'center',
                          borderBottom: '1px solid #d0d7de',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#57606a',
                            textTransform: 'uppercase',
                          }}
                        >
                          {day}
                        </Typography>
                      </Box>
                    )
                  )}

                  {/* Calendar days */}
                  {(() => {
                    const year = selectedDate.getFullYear();
                    const month = selectedDate.getMonth();
                    const firstDay = new Date(year, month, 1);
                    const startDate = new Date(firstDay);
                    startDate.setDate(startDate.getDate() - startDate.getDay());
                    const days: Date[] = [];
                    for (let i = 0; i < 42; i++) {
                      const date = new Date(startDate);
                      date.setDate(startDate.getDate() + i);
                      days.push(date);
                    }

                    return days.map((date, index) => {
                      const dayAppointments = filteredAppointments.filter(
                        (apt) => {
                          const aptDate = new Date(apt.startTime);
                          return isSameDay(aptDate, date);
                        }
                      );
                      const isCurrentMonth = date.getMonth() === month;
                      const isToday =
                        date.toDateString() === new Date().toDateString();

                      return (
                        <Box
                          key={index}
                          sx={{
                            minHeight: 120,
                            border: '1px solid #f6f8fa',
                            backgroundColor: isToday
                              ? '#dbeafe'
                              : isCurrentMonth
                                ? '#ffffff'
                                : '#f9fafb',
                            padding: 1,
                            position: 'relative',
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '14px',
                              fontWeight: isToday ? 700 : 500,
                              color: isCurrentMonth ? '#24292f' : '#57606a',
                              marginBottom: 0.5,
                            }}
                          >
                            {date.getDate()}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 0.5,
                            }}
                          >
                            {dayAppointments.slice(0, 3).map((appointment) => {
                              const orgColor = getOrganizationColor(
                                appointment.organization
                              );
                              return (
                                <Box
                                  key={appointment.id}
                                  onClick={() => {
                                    navigate({
                                      to: '/appointments/$appointmentId',
                                      params: {
                                        appointmentId: String(appointment.id),
                                      },
                                    });
                                  }}
                                  sx={{
                                    padding: '2px 6px',
                                    backgroundColor: `${orgColor}15`,
                                    borderLeft: `2px solid ${orgColor}`,
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    '&:hover': {
                                      backgroundColor: `${orgColor}25`,
                                    },
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: '10px',
                                      fontWeight: 500,
                                      color: '#24292f',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {formatTime(appointment.startTime)}{' '}
                                    {appointment.title}
                                  </Typography>
                                </Box>
                              );
                            })}
                            {dayAppointments.length > 3 && (
                              <Typography
                                sx={{
                                  fontSize: '10px',
                                  color: '#57606a',
                                  fontStyle: 'italic',
                                  paddingLeft: 1,
                                }}
                              >
                                +{dayAppointments.length - 3} more
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      );
                    });
                  })()}
                </Box>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
