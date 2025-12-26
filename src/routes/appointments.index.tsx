import { createFileRoute } from '@tanstack/react-router';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewType, setViewType] = useState<ViewType>('week');
  const [organizationFilter, setOrganizationFilter] = useState<string>('all');
  // Initialize to a date that has appointments (January 15, 2025)
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const date = new Date(2025, 0, 15); // January 15, 2025 (month is 0-indexed)
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

  // Filter appointments by organization
  const filteredAppointments = mockAppointments.filter((apt) => {
    if (organizationFilter === 'all') return true;

    const org = mockOrganizations.find(
      (o) => o.organizationId === parseInt(organizationFilter, 10)
    );
    if (!org) return false;

    const dataOrgId = getDataOrgId(org.slug);
    return apt.organization === dataOrgId;
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
                            // TODO: Navigate to appointment detail
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
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i;
                      const hourStart = new Date(selectedDate);
                      hourStart.setHours(hour, 0, 0, 0);
                      const hourEnd = new Date(selectedDate);
                      hourEnd.setHours(hour + 1, 0, 0, 0);

                      const hourAppointments = filteredAppointments.filter(
                        (apt) => {
                          const aptStart = new Date(apt.startTime);
                          const aptEnd = new Date(apt.endTime);

                          // Check if appointment is on the selected date
                          if (!isSameDay(aptStart, selectedDate)) {
                            return false;
                          }

                          // Check if appointment overlaps with this hour
                          return aptStart < hourEnd && aptEnd > hourStart;
                        }
                      );

                      return (
                        <Box
                          key={hour}
                          sx={{
                            height: 60,
                            borderBottom: '1px solid #f6f8fa',
                            position: 'relative',
                            flexShrink: 0,
                          }}
                        >
                          {hourAppointments.map((appointment) => {
                            const { pet } = getAppointmentInfo(appointment);
                            const orgColor = getOrganizationColor(
                              appointment.organization
                            );
                            const start = new Date(appointment.startTime);
                            const end = new Date(appointment.endTime);
                            const duration =
                              (end.getTime() - start.getTime()) / (1000 * 60);
                            const topOffset = start.getMinutes();
                            const startHour = start.getHours();

                            // Only render if this appointment starts in this hour
                            if (startHour !== hour) return null;

                            return (
                              <Box
                                key={appointment.id}
                                onClick={() => {
                                  // TODO: Navigate to appointment detail
                                }}
                                sx={{
                                  position: 'absolute',
                                  top: `${(topOffset / 60) * 100}%`,
                                  left: 8,
                                  right: 8,
                                  height: `${Math.max((duration / 60) * 100, 15)}%`,
                                  maxHeight: `${((60 - topOffset) / 60) * 100}%`,
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
                          })}
                        </Box>
                      );
                    })}
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
                    overflow: 'hidden',
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

                  {/* Time slots and appointments */}
                  {Array.from({ length: 24 }, (_, hour) => (
                    <Box key={`hour-row-${hour}`} sx={{ display: 'contents' }}>
                      <Box
                        sx={{
                          padding: 1,
                          borderRight: '1px solid #d0d7de',
                          borderTop: '1px solid #d0d7de',
                          backgroundColor: '#ffffff',
                          textAlign: 'right',
                          paddingRight: 2,
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
                      {Array.from({ length: 7 }, (_, dayIndex) => {
                        const date = new Date(selectedDate);
                        date.setDate(
                          selectedDate.getDate() -
                            selectedDate.getDay() +
                            dayIndex
                        );
                        const hourStart = new Date(date);
                        hourStart.setHours(hour, 0, 0, 0);
                        const hourEnd = new Date(date);
                        hourEnd.setHours(hour + 1, 0, 0, 0);

                        const hourAppointments = filteredAppointments.filter(
                          (apt) => {
                            const aptStart = new Date(apt.startTime);
                            const aptEnd = new Date(apt.endTime);

                            // Check if appointment is on this date
                            if (!isSameDay(aptStart, date)) {
                              return false;
                            }

                            // Check if appointment overlaps with this hour
                            return aptStart < hourEnd && aptEnd > hourStart;
                          }
                        );

                        return (
                          <Box
                            key={`cell-${hour}-${dayIndex}`}
                            sx={{
                              minHeight: 60,
                              borderRight:
                                dayIndex < 6 ? '1px solid #d0d7de' : 'none',
                              borderTop: '1px solid #d0d7de',
                              backgroundColor: '#ffffff',
                              position: 'relative',
                              padding: 0.5,
                            }}
                          >
                            {hourAppointments.map((appointment) => {
                              const { pet } = getAppointmentInfo(appointment);
                              const orgColor = getOrganizationColor(
                                appointment.organization
                              );
                              const start = new Date(appointment.startTime);
                              const end = new Date(appointment.endTime);
                              const duration =
                                (end.getTime() - start.getTime()) / (1000 * 60);
                              const topOffset = start.getMinutes();

                              return (
                                <Box
                                  key={appointment.id}
                                  onClick={() => {
                                    // TODO: Navigate to appointment detail
                                  }}
                                  sx={{
                                    position: 'absolute',
                                    top: `${(topOffset / 60) * 100}%`,
                                    left: 4,
                                    right: 4,
                                    height: `${Math.max(
                                      (duration / 60) * 100,
                                      20
                                    )}%`,
                                    backgroundColor: `${orgColor}15`,
                                    borderLeft: `3px solid ${orgColor}`,
                                    borderRadius: '4px',
                                    padding: 0.75,
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    '&:hover': {
                                      backgroundColor: `${orgColor}25`,
                                      zIndex: 1,
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
                  ))}
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
                                    // TODO: Navigate to appointment detail
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
