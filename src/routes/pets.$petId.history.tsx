import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Box, Typography, Paper, Chip, Divider, Button } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocalHospital as HospitalIcon,
  Medication as MedicationIcon,
  Vaccines as VaccinesIcon,
  Healing as HealingIcon,
  Description as DescriptionIcon,
  Science as ScienceIcon,
  Note as NoteIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { mockPets } from '@/data/mockPets';
import {
  mockMedicalHistory,
  MedicalHistoryEntry,
} from '@/data/mockMedicalHistory';

export const Route = createFileRoute('/pets/$petId/history')({
  component: PetMedicalHistory,
  validateSearch: (): Record<string, never> => {
    return {};
  },
});

function PetMedicalHistory() {
  const { petId } = Route.useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Find pet data
  const petIdNum = parseInt(petId, 10);
  const pet = !isNaN(petIdNum) ? mockPets.find((p) => p.id === petIdNum) : null;

  // Get medical history for this pet
  const historyEntries: MedicalHistoryEntry[] = pet
    ? mockMedicalHistory[pet.id] || []
    : [];

  // Sort by date (newest first)
  const sortedHistory = [...historyEntries].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Group by date
  const groupedByDate = sortedHistory.reduce(
    (acc, entry) => {
      const dateKey = entry.date;
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(entry);
      return acc;
    },
    {} as Record<string, MedicalHistoryEntry[]>
  );

  const getTypeIcon = (type: MedicalHistoryEntry['type']) => {
    switch (type) {
      case 'consultation':
        return <HospitalIcon />;
      case 'treatment':
        return <HealingIcon />;
      case 'vaccination':
        return <VaccinesIcon />;
      case 'surgery':
        return <HealingIcon />;
      case 'diagnostic':
        return <ScienceIcon />;
      case 'medication':
        return <MedicationIcon />;
      case 'note':
        return <NoteIcon />;
      default:
        return <DescriptionIcon />;
    }
  };

  const getTypeColor = (type: MedicalHistoryEntry['type']) => {
    switch (type) {
      case 'consultation':
        return '#2563eb';
      case 'treatment':
        return '#10b981';
      case 'vaccination':
        return '#f59e0b';
      case 'surgery':
        return '#ef4444';
      case 'diagnostic':
        return '#8b5cf6';
      case 'medication':
        return '#06b6d4';
      case 'note':
        return '#64748b';
      default:
        return '#57606a';
    }
  };

  const getTypeLabel = (type: MedicalHistoryEntry['type']) => {
    switch (type) {
      case 'consultation':
        return 'Consultation';
      case 'treatment':
        return 'Treatment';
      case 'vaccination':
        return 'Vaccination';
      case 'surgery':
        return 'Surgery';
      case 'diagnostic':
        return 'Diagnostic';
      case 'medication':
        return 'Medication';
      case 'note':
        return 'Note';
      default:
        return 'Entry';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if it's today
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    // Check if it's yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    // Format as "Month Day, Year"
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return null;
    return timeString;
  };

  // Calculate summary statistics
  const totalEntries = sortedHistory.length;
  const lastVisit = sortedHistory[0];
  const upcomingFollowUps = sortedHistory
    .filter((entry) => entry.followUp)
    .map((entry) => ({
      ...entry,
      followUpDate: new Date(entry.followUp!.date),
    }))
    .filter((entry) => entry.followUpDate >= new Date())
    .sort((a, b) => a.followUpDate.getTime() - b.followUpDate.getTime());

  // Get active medications (from recent entries)
  const activeMedications = sortedHistory
    .filter((entry) => entry.medications && entry.medications.length > 0)
    .slice(0, 3)
    .flatMap((entry) =>
      entry.medications!.map((med) => ({
        ...med,
        entryDate: entry.date,
        entryTitle: entry.title,
      }))
    );

  // Get recent diagnoses
  const recentDiagnoses = sortedHistory
    .filter((entry) => entry.diagnosis)
    .slice(0, 3)
    .map((entry) => ({
      diagnosis: entry.diagnosis!,
      date: entry.date,
      type: entry.type,
    }));

  // Get all surgeries
  const overallSurgeries = sortedHistory
    .filter((entry) => entry.type === 'surgery')
    .map((entry) => ({
      title: entry.title,
      date: entry.date,
      diagnosis: entry.diagnosis,
      professional: entry.professional.name,
    }));

  // Get all treatments
  const overallTreatments = sortedHistory
    .filter((entry) => entry.type === 'treatment')
    .map((entry) => ({
      title: entry.title,
      date: entry.date,
      diagnosis: entry.diagnosis,
      followUpDate: entry.followUp?.date,
      professional: entry.professional.name,
    }));

  if (!pet) {
    return (
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <Topbar pageTitle="Pet Not Found" onToggleSidebar={toggleSidebar} />
        <Sidebar open={sidebarOpen} onClose={toggleSidebar} />
        <Box sx={{ flexGrow: 1, padding: 3, textAlign: 'center' }}>
          <Typography variant="h5">Pet not found</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar
        pageTitle={`${pet.name} ${pet.lastName} - Medical History`}
        onToggleSidebar={toggleSidebar}
      />
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
          {/* Header */}
          <Box sx={{ marginBottom: 3 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => {
                navigate({
                  to: '/pets/$petId',
                  params: { petId },
                });
              }}
              sx={{
                textTransform: 'none',
                color: '#57606a',
                marginBottom: 2,
                '&:hover': {
                  backgroundColor: '#f6f8fa',
                },
              }}
            >
              Back to Profile
            </Button>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: '#24292f',
                marginBottom: 1,
              }}
            >
              Medical History
            </Typography>
            <Typography
              sx={{
                fontSize: '16px',
                color: '#57606a',
              }}
            >
              {pet.name} {pet.lastName} • {pet.type} • {pet.breed}
            </Typography>
          </Box>

          {/* Summary Card */}
          {sortedHistory.length > 0 && (
            <Paper
              sx={{
                padding: 3,
                backgroundColor: '#ffffff',
                border: '1px solid #d0d7de',
                borderRadius: '8px',
                marginBottom: 3,
              }}
            >
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#57606a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: 2,
                }}
              >
                Quick Summary
              </Typography>

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
                {/* Total Entries */}
                <Box
                  sx={{
                    padding: 2,
                    backgroundColor: '#f6f8fa',
                    borderRadius: '6px',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      marginBottom: 0.5,
                    }}
                  >
                    <EventIcon sx={{ fontSize: '18px', color: '#57606a' }} />
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#57606a',
                        textTransform: 'uppercase',
                      }}
                    >
                      Total Visits
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '24px',
                      fontWeight: 700,
                      color: '#24292f',
                    }}
                  >
                    {totalEntries}
                  </Typography>
                </Box>

                {/* Last Visit */}
                {lastVisit && (
                  <Box
                    sx={{
                      padding: 2,
                      backgroundColor: '#f6f8fa',
                      borderRadius: '6px',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        marginBottom: 0.5,
                      }}
                    >
                      <CalendarIcon
                        sx={{ fontSize: '18px', color: '#57606a' }}
                      />
                      <Typography
                        sx={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#57606a',
                          textTransform: 'uppercase',
                        }}
                      >
                        Last Visit
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#24292f',
                        marginBottom: 0.5,
                      }}
                    >
                      {formatDate(lastVisit.date)}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '13px',
                        color: '#57606a',
                      }}
                    >
                      {lastVisit.title}
                    </Typography>
                  </Box>
                )}

                {/* Upcoming Follow-ups */}
                <Box
                  sx={{
                    padding: 2,
                    backgroundColor: '#fff4e6',
                    borderRadius: '6px',
                    border: '1px solid #ffd89b',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      marginBottom: 0.5,
                    }}
                  >
                    <WarningIcon sx={{ fontSize: '18px', color: '#f59e0b' }} />
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#f59e0b',
                        textTransform: 'uppercase',
                      }}
                    >
                      Follow-ups
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '24px',
                      fontWeight: 700,
                      color: '#78350f',
                    }}
                  >
                    {upcomingFollowUps.length}
                  </Typography>
                  {upcomingFollowUps.length > 0 && (
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: '#92400e',
                        marginTop: 0.5,
                      }}
                    >
                      Next: {formatDate(upcomingFollowUps[0].followUp!.date)}
                    </Typography>
                  )}
                </Box>

                {/* Active Medications */}
                <Box
                  sx={{
                    padding: 2,
                    backgroundColor: '#f6f8fa',
                    borderRadius: '6px',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      marginBottom: 0.5,
                    }}
                  >
                    <MedicationIcon
                      sx={{ fontSize: '18px', color: '#57606a' }}
                    />
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#57606a',
                        textTransform: 'uppercase',
                      }}
                    >
                      Medications
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '24px',
                      fontWeight: 700,
                      color: '#24292f',
                    }}
                  >
                    {activeMedications.length}
                  </Typography>
                  {activeMedications.length > 0 && (
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: '#57606a',
                        marginTop: 0.5,
                      }}
                    >
                      Currently active
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Recent Diagnoses */}
              {recentDiagnoses.length > 0 && (
                <Box sx={{ marginTop: 2 }}>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#57606a',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: 1.5,
                    }}
                  >
                    Recent Diagnoses
                  </Typography>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    {recentDiagnoses.map((item, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          padding: 1.5,
                          backgroundColor: '#f6f8fa',
                          borderRadius: '6px',
                        }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '6px',
                            backgroundColor: `${getTypeColor(item.type)}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: getTypeColor(item.type),
                            flexShrink: 0,
                          }}
                        >
                          {getTypeIcon(item.type)}
                        </Box>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#24292f',
                            }}
                          >
                            {item.diagnosis}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '12px',
                              color: '#57606a',
                            }}
                          >
                            {formatDate(item.date)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Active Medications List */}
              {activeMedications.length > 0 && (
                <Box sx={{ marginTop: 2 }}>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#57606a',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: 1.5,
                    }}
                  >
                    Active Medications
                  </Typography>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    {activeMedications.slice(0, 3).map((med, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          padding: 1.5,
                          backgroundColor: '#f0f9ff',
                          borderRadius: '6px',
                          border: '1px solid #bae6fd',
                        }}
                      >
                        <MedicationIcon
                          sx={{
                            fontSize: '20px',
                            color: '#06b6d4',
                            flexShrink: 0,
                          }}
                        />
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#24292f',
                            }}
                          >
                            {med.name}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '12px',
                              color: '#57606a',
                            }}
                          >
                            {med.dosage} • {med.frequency}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Overall Surgeries */}
              {overallSurgeries.length > 0 && (
                <Box sx={{ marginTop: 2 }}>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#57606a',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: 1.5,
                    }}
                  >
                    Overall Surgeries ({overallSurgeries.length})
                  </Typography>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    {overallSurgeries.map((surgery, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          padding: 1.5,
                          backgroundColor: '#fef2f2',
                          borderRadius: '6px',
                          border: '1px solid #fecaca',
                        }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '6px',
                            backgroundColor: '#ef444415',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ef4444',
                            flexShrink: 0,
                          }}
                        >
                          <HealingIcon sx={{ fontSize: '18px' }} />
                        </Box>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#24292f',
                            }}
                          >
                            {surgery.title}
                          </Typography>
                          {surgery.diagnosis && (
                            <Typography
                              sx={{
                                fontSize: '12px',
                                color: '#57606a',
                                marginTop: 0.25,
                              }}
                            >
                              {surgery.diagnosis}
                            </Typography>
                          )}
                          <Typography
                            sx={{
                              fontSize: '12px',
                              color: '#991b1b',
                              marginTop: 0.25,
                            }}
                          >
                            {formatDate(surgery.date)} • {surgery.professional}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Overall Treatments */}
              {overallTreatments.length > 0 && (
                <Box sx={{ marginTop: 2 }}>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#57606a',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: 1.5,
                    }}
                  >
                    Overall Treatments ({overallTreatments.length})
                  </Typography>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    {overallTreatments.map((treatment, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          padding: 1.5,
                          backgroundColor: '#f0fdf4',
                          borderRadius: '6px',
                          border: '1px solid #bbf7d0',
                        }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '6px',
                            backgroundColor: '#10b98115',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#10b981',
                            flexShrink: 0,
                          }}
                        >
                          <HealingIcon sx={{ fontSize: '18px' }} />
                        </Box>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#24292f',
                            }}
                          >
                            {treatment.title}
                          </Typography>
                          {treatment.diagnosis && (
                            <Typography
                              sx={{
                                fontSize: '12px',
                                color: '#57606a',
                                marginTop: 0.25,
                              }}
                            >
                              {treatment.diagnosis}
                            </Typography>
                          )}
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              marginTop: 0.5,
                              flexWrap: 'wrap',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '12px',
                                color: '#57606a',
                              }}
                            >
                              {formatDate(treatment.date)}
                            </Typography>
                            {treatment.followUpDate && (
                              <Typography
                                sx={{
                                  fontSize: '12px',
                                  color: '#065f46',
                                }}
                              >
                                • Follow-up:{' '}
                                {formatDate(treatment.followUpDate)}
                              </Typography>
                            )}
                            <Typography
                              sx={{
                                fontSize: '12px',
                                color: '#57606a',
                              }}
                            >
                              • {treatment.professional}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          )}

          {/* Timeline */}
          {sortedHistory.length === 0 ? (
            <Paper
              sx={{
                padding: 4,
                backgroundColor: '#ffffff',
                border: '1px solid #d0d7de',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: '16px',
                  color: '#57606a',
                }}
              >
                No medical history available yet.
              </Typography>
            </Paper>
          ) : (
            <Box sx={{ position: 'relative' }}>
              {/* Timeline line */}
              <Box
                sx={{
                  position: 'absolute',
                  left: { xs: 20, md: 30 },
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  backgroundColor: '#d0d7de',
                  zIndex: 0,
                }}
              />

              {/* Timeline entries */}
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                {Object.entries(groupedByDate).map(([dateKey, entries]) => (
                  <Box key={dateKey} sx={{ marginBottom: 4 }}>
                    {/* Date Header */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        marginBottom: 2,
                        position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 40, md: 60 },
                          height: { xs: 40, md: 60 },
                          borderRadius: '50%',
                          backgroundColor: '#ffffff',
                          border: '3px solid #2563eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          zIndex: 2,
                        }}
                      >
                        <CalendarIcon
                          sx={{
                            fontSize: { xs: '20px', md: '24px' },
                            color: '#2563eb',
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: { xs: '18px', md: '24px' },
                            fontWeight: 700,
                            color: '#24292f',
                          }}
                        >
                          {formatDate(dateKey)}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            color: '#57606a',
                          }}
                        >
                          {entries.length}{' '}
                          {entries.length === 1 ? 'entry' : 'entries'}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Entries for this date */}
                    <Box sx={{ marginLeft: { xs: 6, md: 8 } }}>
                      {entries.map((entry) => (
                        <Paper
                          key={entry.id}
                          sx={{
                            padding: 3,
                            backgroundColor: '#ffffff',
                            border: '1px solid #d0d7de',
                            borderRadius: '8px',
                            marginBottom: 3,
                            position: 'relative',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                              borderColor: getTypeColor(entry.type),
                            },
                          }}
                        >
                          {/* Entry Header */}
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 2,
                              marginBottom: 2,
                            }}
                          >
                            {/* Type Icon */}
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '8px',
                                backgroundColor: `${getTypeColor(entry.type)}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                color: getTypeColor(entry.type),
                              }}
                            >
                              {getTypeIcon(entry.type)}
                            </Box>

                            {/* Title and Meta */}
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  marginBottom: 1,
                                  flexWrap: 'wrap',
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    color: '#24292f',
                                  }}
                                >
                                  {entry.title}
                                </Typography>
                                <Chip
                                  label={getTypeLabel(entry.type)}
                                  size="small"
                                  sx={{
                                    backgroundColor: `${getTypeColor(entry.type)}15`,
                                    color: getTypeColor(entry.type),
                                    fontWeight: 600,
                                    fontSize: '11px',
                                    height: '22px',
                                  }}
                                />
                              </Box>

                              {/* Time and Professional */}
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 2,
                                  flexWrap: 'wrap',
                                }}
                              >
                                {entry.time && (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.5,
                                    }}
                                  >
                                    <TimeIcon
                                      sx={{
                                        fontSize: '14px',
                                        color: '#57606a',
                                      }}
                                    />
                                    <Typography
                                      sx={{
                                        fontSize: '13px',
                                        color: '#57606a',
                                      }}
                                    >
                                      {formatTime(entry.time)}
                                    </Typography>
                                  </Box>
                                )}
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                  }}
                                >
                                  <PersonIcon
                                    sx={{
                                      fontSize: '14px',
                                      color: '#57606a',
                                    }}
                                  />
                                  <Typography
                                    sx={{
                                      fontSize: '13px',
                                      color: '#57606a',
                                    }}
                                  >
                                    {entry.professional.name} •{' '}
                                    {entry.professional.role}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Box>

                          {/* Diagnosis */}
                          {entry.diagnosis && (
                            <Box sx={{ marginBottom: 2 }}>
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
                                Diagnosis
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: '15px',
                                  fontWeight: 500,
                                  color: '#24292f',
                                }}
                              >
                                {entry.diagnosis}
                              </Typography>
                            </Box>
                          )}

                          <Divider sx={{ marginY: 2 }} />

                          {/* Professional Notes - Highlighted */}
                          <Box
                            sx={{
                              backgroundColor: '#f8f9fa',
                              borderLeft: '4px solid',
                              borderColor: getTypeColor(entry.type),
                              padding: 2,
                              borderRadius: '4px',
                              marginBottom: 2,
                            }}
                          >
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
                              Professional Notes
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '15px',
                                color: '#24292f',
                                lineHeight: 1.7,
                                whiteSpace: 'pre-wrap',
                              }}
                            >
                              {entry.notes}
                            </Typography>
                          </Box>

                          {/* Medications */}
                          {entry.medications &&
                            entry.medications.length > 0 && (
                              <Box sx={{ marginBottom: 2 }}>
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
                                  Medications
                                </Typography>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                  }}
                                >
                                  {entry.medications.map((med, idx) => (
                                    <Box
                                      key={idx}
                                      sx={{
                                        padding: 1.5,
                                        backgroundColor: '#f6f8fa',
                                        borderRadius: '6px',
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: '14px',
                                          fontWeight: 600,
                                          color: '#24292f',
                                          marginBottom: 0.5,
                                        }}
                                      >
                                        {med.name}
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: '13px',
                                          color: '#57606a',
                                        }}
                                      >
                                        {med.dosage} • {med.frequency} •{' '}
                                        {med.duration}
                                      </Typography>
                                    </Box>
                                  ))}
                                </Box>
                              </Box>
                            )}

                          {/* Procedures */}
                          {entry.procedures && entry.procedures.length > 0 && (
                            <Box sx={{ marginBottom: 2 }}>
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
                                Procedures
                              </Typography>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 1,
                                }}
                              >
                                {entry.procedures.map((procedure, idx) => (
                                  <Chip
                                    key={idx}
                                    label={procedure}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      borderColor: '#d0d7de',
                                      color: '#57606a',
                                      fontSize: '12px',
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}

                          {/* Follow-up */}
                          {entry.followUp && (
                            <Box
                              sx={{
                                padding: 1.5,
                                backgroundColor: '#fff4e6',
                                border: '1px solid #ffd89b',
                                borderRadius: '6px',
                                marginTop: 2,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  color: '#92400e',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                  marginBottom: 0.5,
                                }}
                              >
                                Follow-up
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: '14px',
                                  color: '#78350f',
                                  fontWeight: 500,
                                  marginBottom: 0.5,
                                }}
                              >
                                {formatDate(entry.followUp.date)}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: '13px',
                                  color: '#92400e',
                                }}
                              >
                                {entry.followUp.notes}
                              </Typography>
                            </Box>
                          )}
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
