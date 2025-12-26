import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useRef, useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputBase,
  IconButton,
  Divider,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  AutoAwesome as AutoAwesomeIcon,
  Send as SendIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { mockPets, Pet } from '@/data/mockPets';
import { mockOrganizations } from '@/data/mockOrganizations';
import { mockProcedures, Procedure } from '@/data/mockProcedures';
import { mockMedications, Medication } from '@/routes/vademecum.index';
import { FormControl, InputLabel, Select, MenuItem, Menu } from '@mui/material';

export const Route = createFileRoute('/consultations/new')({
  component: NewConsultation,
});

interface ConsultationFormValues {
  organization: string;
  petId: string;
  date: string;
  time: string;
  title: string;
  diagnosis: string;
  notes: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  procedures: string[];
  followUpDate: string;
  followUpNotes: string;
}

function NewConsultation() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [petSearchValue, setPetSearchValue] = useState('');
  const [petSearchFocused, setPetSearchFocused] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const petSearchRef = useRef<HTMLDivElement>(null);
  const [procedureDialogOpen, setProcedureDialogOpen] = useState(false);
  const [selectedProcedureForAdd, setSelectedProcedureForAdd] =
    useState<Procedure | null>(null);
  const [procedureDetailDialogOpen, setProcedureDetailDialogOpen] =
    useState(false);
  const [procedureToView, setProcedureToView] = useState<Procedure | null>(
    null
  );
  const [medicationDialogOpen, setMedicationDialogOpen] = useState(false);
  const [selectedMedicationForAdd, setSelectedMedicationForAdd] =
    useState<Medication | null>(null);
  const [medicationDetailDialogOpen, setMedicationDetailDialogOpen] =
    useState(false);
  const [medicationToView, setMedicationToView] = useState<Medication | null>(
    null
  );
  const [improvingField, setImprovingField] = useState<string | null>(null);
  const [aiQueryValue, setAiQueryValue] = useState('');
  const [modelMenuAnchor, setModelMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [selectedModel, setSelectedModel] = useState('veterai-3.1');
  // const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiConversation, setAiConversation] = useState<
    Array<{ query: string; response: string }>
  >([]);

  const form = useForm({
    defaultValues: {
      organization: '',
      petId: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      title: '',
      diagnosis: '',
      notes: '',
      medications: [] as Array<{
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
      }>,
      procedures: [] as string[],
      followUpDate: '',
      followUpNotes: '',
    } as ConsultationFormValues,
    onSubmit: async ({ value }) => {
      // TODO: Save consultation to medical history
      console.log('Consultation submitted:', value);
      // Navigate back to pet profile or dashboard
      if (value.petId) {
        navigate({
          to: '/pets/$petId',
          params: { petId: value.petId },
        });
      } else {
        navigate({ to: '/' });
      }
    },
  });

  const filteredPets = mockPets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(petSearchValue.toLowerCase()) ||
      pet.lastName.toLowerCase().includes(petSearchValue.toLowerCase()) ||
      pet.breed.toLowerCase().includes(petSearchValue.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        petSearchRef.current &&
        !petSearchRef.current.contains(event.target as Node)
      ) {
        setPetSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePetSelect = (pet: Pet) => {
    setSelectedPet(pet);
    form.setFieldValue('petId', String(pet.id));
    setPetSearchValue(
      `${pet.name} ${pet.lastName} - ${pet.type} (${pet.breed})`
    );
    setPetSearchFocused(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCancel = () => {
    navigate({ to: '/' });
  };

  const handleOpenMedicationDialog = () => {
    setMedicationDialogOpen(true);
    setSelectedMedicationForAdd(null);
  };

  const handleCloseMedicationDialog = () => {
    setMedicationDialogOpen(false);
    setSelectedMedicationForAdd(null);
  };

  const handleMedicationSelect = (medication: Medication | null) => {
    setSelectedMedicationForAdd(medication);
    if (medication) {
      setMedicationDetailDialogOpen(true);
    }
  };

  const handleAddMedication = () => {
    if (selectedMedicationForAdd) {
      const currentMedications = form.state.values.medications || [];
      // Extract frequency from dosage string (e.g., "10-20 mg/kg every 8-12 hours" -> "every 8-12 hours")
      const dosageText = selectedMedicationForAdd.dosage || '';
      const frequencyMatch = dosageText.match(
        /every\s+[\d\s-]+(?:hours?|days?|weeks?|months?)/i
      );
      const frequency = frequencyMatch ? frequencyMatch[0] : '';

      // Extract duration suggestion from dosage if available
      const durationMatch = dosageText.match(
        /for\s+[\d\s-]+(?:days?|weeks?|months?)/i
      );
      const duration = durationMatch
        ? durationMatch[0].replace('for ', '')
        : '';

      form.setFieldValue('medications', [
        ...currentMedications,
        {
          name: selectedMedicationForAdd.name,
          dosage: dosageText,
          frequency: frequency || '',
          duration: duration || '',
        },
      ]);
      handleCloseMedicationDialog();
      setMedicationDetailDialogOpen(false);
      setSelectedMedicationForAdd(null);
    }
  };

  const removeMedication = (index: number) => {
    const currentMedications = form.state.values.medications || [];
    form.setFieldValue(
      'medications',
      currentMedications.filter((_, i) => i !== index)
    );
  };

  const handleOpenProcedureDialog = () => {
    setProcedureDialogOpen(true);
    setSelectedProcedureForAdd(null);
  };

  const handleCloseProcedureDialog = () => {
    setProcedureDialogOpen(false);
    setSelectedProcedureForAdd(null);
  };

  const handleProcedureSelect = (procedure: Procedure | null) => {
    setSelectedProcedureForAdd(procedure);
    if (procedure) {
      setProcedureDetailDialogOpen(true);
    }
  };

  const handleAddProcedure = () => {
    if (selectedProcedureForAdd) {
      const currentProcedures = form.state.values.procedures || [];
      if (!currentProcedures.includes(selectedProcedureForAdd.name)) {
        form.setFieldValue('procedures', [
          ...currentProcedures,
          selectedProcedureForAdd.name,
        ]);
      }
      handleCloseProcedureDialog();
      setProcedureDetailDialogOpen(false);
      setSelectedProcedureForAdd(null);
    }
  };

  const handleViewProcedureDetail = (procedureName: string) => {
    const procedure = mockProcedures.find((p) => p.name === procedureName);
    if (procedure) {
      setProcedureToView(procedure);
      setProcedureDetailDialogOpen(true);
    }
  };

  const removeProcedure = (index: number) => {
    const currentProcedures = form.state.values.procedures || [];
    form.setFieldValue(
      'procedures',
      currentProcedures.filter((_, i) => i !== index)
    );
  };

  const handleImproveWithAI = async (
    fieldName: 'diagnosis' | 'notes' | 'followUpNotes'
  ) => {
    const currentValue = form.state.values[fieldName] || '';
    if (!currentValue.trim()) {
      return;
    }

    setImprovingField(fieldName);

    try {
      // Simulate AI improvement - In a real app, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For now, we'll just improve the text by making it more professional
      // In a real implementation, this would call an AI service
      const improvedText = improveTextWithAI(currentValue);

      form.setFieldValue(fieldName, improvedText);
    } catch (error) {
      console.error('Error improving text with AI:', error);
    } finally {
      setImprovingField(null);
    }
  };

  // Helper function to simulate AI text improvement
  const improveTextWithAI = (text: string): string => {
    // This is a placeholder - in a real app, this would call an AI API
    // For now, we'll just return a slightly improved version
    // In production, you would call something like OpenAI, Claude, etc.

    // Basic improvements:
    // - Capitalize first letter
    // - Ensure proper punctuation
    // - Add professional tone

    let improved = text.trim();

    // Capitalize first letter
    if (improved.length > 0) {
      improved = improved.charAt(0).toUpperCase() + improved.slice(1);
    }

    // Ensure it ends with proper punctuation
    if (improved.length > 0 && !improved.match(/[.!?]$/)) {
      improved += '.';
    }

    // Replace common informal phrases with more professional ones
    improved = improved
      .replace(/\bim\b/gi, 'I am')
      .replace(/\bive\b/gi, 'I have')
      .replace(/\bdont\b/gi, 'do not')
      .replace(/\bwont\b/gi, 'will not')
      .replace(/\bcant\b/gi, 'cannot')
      .replace(/\bisnt\b/gi, 'is not')
      .replace(/\barent\b/gi, 'are not');

    return improved;
  };

  const handleModelMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setModelMenuAnchor(event.currentTarget);
  };

  const handleModelMenuClose = () => {
    setModelMenuAnchor(null);
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    handleModelMenuClose();
  };

  const handleAISubmit = async () => {
    if (!aiQueryValue.trim()) return;

    const query = aiQueryValue.trim();
    setIsLoadingAI(true);
    // setAiResponse(null);

    try {
      // Simulate AI response - In a real app, this would call an AI API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock response based on query
      const mockResponse = generateMockAIResponse(query);

      // setAiResponse(mockResponse);
      setAiConversation((prev) => [...prev, { query, response: mockResponse }]);
      setAiQueryValue('');
    } catch (error) {
      console.error('Error getting AI response:', error);
      // setAiResponse('Sorry, there was an error processing your request. Please try again.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const generateMockAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    // Context-aware responses based on consultation form
    if (lowerQuery.includes('diagnosis') || lowerQuery.includes('diagnostic')) {
      return 'Based on the symptoms and examination findings, I recommend documenting the primary diagnosis clearly. Include any differential diagnoses if applicable. For example: "Primary: [condition] - Differential: [other possibilities to consider]".';
    }

    if (
      lowerQuery.includes('medication') ||
      lowerQuery.includes('treatment') ||
      lowerQuery.includes('drug')
    ) {
      return "When prescribing medications, ensure you include: name, dosage (with units), frequency, duration, and route of administration. Consider the pet's weight, age, and any contraindications. Always check for drug interactions if multiple medications are prescribed.";
    }

    if (lowerQuery.includes('procedure') || lowerQuery.includes('surgery')) {
      return 'For procedures, document the indication, technique used, any complications encountered, and post-procedure care instructions. Include any special equipment or preparations required.';
    }

    if (
      lowerQuery.includes('follow') ||
      lowerQuery.includes('recheck') ||
      lowerQuery.includes('next')
    ) {
      return 'Follow-up recommendations should specify: timing (e.g., "in 2 weeks"), what to monitor, when to return sooner if issues arise, and any specific tests or evaluations needed.';
    }

    if (lowerQuery.includes('note') || lowerQuery.includes('document')) {
      return 'Professional notes should be clear, concise, and objective. Include: examination findings, owner concerns, clinical observations, diagnostic results, treatment plan, and owner education provided. Use professional terminology while remaining clear.';
    }

    // Default response
    return `I understand you're asking about: "${query}". In the context of this consultation, I can help you with diagnosis documentation, treatment recommendations, procedure planning, follow-up scheduling, or improving your professional notes. What specific aspect would you like help with?`;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar pageTitle="New Consultation" onToggleSidebar={toggleSidebar} />
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              marginBottom: 3,
            }}
          >
            <IconButton
              onClick={handleCancel}
              sx={{
                color: '#24292f',
                '&:hover': {
                  backgroundColor: '#f6f8fa',
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: '#24292f',
              }}
            >
              New Consultation
            </Typography>
          </Box>

          <Paper
            sx={{
              padding: 4,
              backgroundColor: '#ffffff',
              border: '1px solid #d0d7de',
              borderRadius: '8px',
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              {/* Organization Selection */}
              <Box sx={{ marginBottom: 4 }}>
                <form.Field
                  name="organization"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? 'Organization is required' : undefined,
                  }}
                >
                  {(field) => (
                    <FormControl fullWidth>
                      <InputLabel>Organization *</InputLabel>
                      <Select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        label="Organization *"
                        error={!!field.state.meta.errors.length}
                      >
                        {mockOrganizations.map((org) => (
                          <MenuItem key={org.id} value={org.slug}>
                            {org.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {field.state.meta.errors.length > 0 && (
                        <Typography
                          sx={{
                            fontSize: '12px',
                            color: '#dc2626',
                            marginTop: 0.5,
                            marginLeft: 1.75,
                          }}
                        >
                          {field.state.meta.errors[0]}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                </form.Field>
              </Box>

              {/* Pet Selection */}
              <Box sx={{ marginBottom: 4 }}>
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#24292f',
                    marginBottom: 1.5,
                  }}
                >
                  Pet *
                </Typography>
                <Box
                  ref={petSearchRef}
                  sx={{
                    position: 'relative',
                    borderRadius: '6px',
                    backgroundColor: '#f6f8fa',
                    border: '1px solid #d0d7de',
                    '&:hover': {
                      borderColor: '#2563eb',
                    },
                    '&:focus-within': {
                      borderColor: '#2563eb',
                      backgroundColor: '#ffffff',
                    },
                  }}
                >
                  <Box
                    sx={{
                      padding: '0 8px',
                      height: '100%',
                      position: 'absolute',
                      pointerEvents: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#57606a',
                      zIndex: 1,
                    }}
                  >
                    <SearchIcon fontSize="small" />
                  </Box>
                  <InputBase
                    placeholder="Search for a pet..."
                    value={petSearchValue}
                    onChange={(e) => setPetSearchValue(e.target.value)}
                    onFocus={() => setPetSearchFocused(true)}
                    sx={{
                      color: '#24292f',
                      padding: '10px 8px 10px 36px',
                      width: '100%',
                      fontSize: '14px',
                      '& .MuiInputBase-input': {
                        '&::placeholder': {
                          color: '#57606a',
                          opacity: 1,
                        },
                      },
                    }}
                  />
                  {petSearchFocused && filteredPets.length > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: 0.5,
                        backgroundColor: '#ffffff',
                        border: '1px solid #d0d7de',
                        borderRadius: '6px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        maxHeight: 300,
                        overflowY: 'auto',
                        zIndex: 1000,
                      }}
                    >
                      {filteredPets.slice(0, 10).map((pet) => (
                        <Box
                          key={pet.id}
                          onClick={() => handlePetSelect(pet)}
                          sx={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: '#f6f8fa',
                            },
                            borderBottom: '1px solid #f0f0f0',
                            '&:last-child': {
                              borderBottom: 'none',
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '14px',
                              fontWeight: 500,
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
                            {pet.type} - {pet.breed}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
                {selectedPet && (
                  <Box
                    sx={{
                      marginTop: 1.5,
                      padding: 1.5,
                      backgroundColor: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#2563eb',
                      }}
                    >
                      Selected: {selectedPet.name} {selectedPet.lastName} (
                      {selectedPet.type} - {selectedPet.breed})
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Date and Time */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                  marginBottom: 4,
                }}
              >
                <form.Field
                  name="date"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? 'Date is required' : undefined,
                  }}
                >
                  {(field) => (
                    <TextField
                      label="Date *"
                      type="date"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      error={!!field.state.meta.errors.length}
                      helperText={field.state.meta.errors[0]}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    />
                  )}
                </form.Field>

                <form.Field name="time">
                  {(field) => (
                    <TextField
                      label="Time"
                      type="time"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    />
                  )}
                </form.Field>
              </Box>

              {/* Title */}
              <form.Field
                name="title"
                validators={{
                  onChange: ({ value }) =>
                    !value ? 'Title is required' : undefined,
                }}
              >
                {(field) => (
                  <TextField
                    label="Title *"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={!!field.state.meta.errors.length}
                    helperText={field.state.meta.errors[0]}
                    fullWidth
                    sx={{ marginBottom: 4 }}
                    placeholder="e.g., Annual Health Check, Routine Examination"
                  />
                )}
              </form.Field>

              {/* Diagnosis */}
              <form.Field name="diagnosis">
                {(field) => (
                  <Box sx={{ marginBottom: 4, position: 'relative' }}>
                    <TextField
                      label="Diagnosis"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      fullWidth
                      placeholder="e.g., Healthy - No abnormalities detected"
                      InputProps={{
                        endAdornment: field.state.value && (
                          <IconButton
                            onClick={() => handleImproveWithAI('diagnosis')}
                            disabled={improvingField === 'diagnosis'}
                            size="small"
                            sx={{
                              color: '#2563eb',
                              '&:hover': {
                                backgroundColor: '#eff6ff',
                              },
                              '&.Mui-disabled': {
                                color: '#9ca3af',
                              },
                            }}
                            title="Improve with AI"
                          >
                            {improvingField === 'diagnosis' ? (
                              <Box
                                sx={{
                                  width: 20,
                                  height: 20,
                                  border: '2px solid #2563eb',
                                  borderTop: '2px solid transparent',
                                  borderRadius: '50%',
                                  animation: 'spin 1s linear infinite',
                                  '@keyframes spin': {
                                    '0%': { transform: 'rotate(0deg)' },
                                    '100%': { transform: 'rotate(360deg)' },
                                  },
                                }}
                              />
                            ) : (
                              <AutoAwesomeIcon fontSize="small" />
                            )}
                          </IconButton>
                        ),
                      }}
                    />
                  </Box>
                )}
              </form.Field>

              {/* Notes */}
              <form.Field
                name="notes"
                validators={{
                  onChange: ({ value }) =>
                    !value ? 'Notes are required' : undefined,
                }}
              >
                {(field) => (
                  <Box sx={{ marginBottom: 4, position: 'relative' }}>
                    <TextField
                      label="Professional Notes *"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      error={!!field.state.meta.errors.length}
                      helperText={field.state.meta.errors[0]}
                      fullWidth
                      multiline
                      rows={6}
                      placeholder="Enter detailed professional notes about the consultation..."
                    />
                    {field.state.value && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          zIndex: 1,
                        }}
                      >
                        <IconButton
                          onClick={() => handleImproveWithAI('notes')}
                          disabled={improvingField === 'notes'}
                          size="small"
                          sx={{
                            color: '#2563eb',
                            backgroundColor: '#ffffff',
                            border: '1px solid #d0d7de',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            '&:hover': {
                              backgroundColor: '#eff6ff',
                              borderColor: '#2563eb',
                            },
                            '&.Mui-disabled': {
                              color: '#9ca3af',
                              backgroundColor: '#f6f8fa',
                            },
                          }}
                          title="Improve with AI"
                        >
                          {improvingField === 'notes' ? (
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                border: '2px solid #2563eb',
                                borderTop: '2px solid transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                '@keyframes spin': {
                                  '0%': { transform: 'rotate(0deg)' },
                                  '100%': { transform: 'rotate(360deg)' },
                                },
                              }}
                            />
                          ) : (
                            <AutoAwesomeIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                )}
              </form.Field>

              {/* Procedures */}
              <Box sx={{ marginBottom: 4 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#24292f',
                    }}
                  >
                    Procedures
                  </Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleOpenProcedureDialog}
                    size="small"
                    sx={{
                      textTransform: 'none',
                      fontSize: '14px',
                      color: '#2563eb',
                    }}
                  >
                    Add Procedure
                  </Button>
                </Box>
                {form.state.values.procedures &&
                  form.state.values.procedures.length > 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        marginBottom: 1,
                      }}
                    >
                      {form.state.values.procedures.map((procedure, index) => (
                        <Chip
                          key={index}
                          label={procedure}
                          onClick={() => handleViewProcedureDetail(procedure)}
                          onDelete={() => removeProcedure(index)}
                          sx={{
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            border: '1px solid #bfdbfe',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: '#dbeafe',
                            },
                            '& .MuiChip-deleteIcon': {
                              color: '#2563eb',
                              '&:hover': {
                                color: '#1d4ed8',
                              },
                            },
                          }}
                        />
                      ))}
                    </Box>
                  )}
                {(!form.state.values.procedures ||
                  form.state.values.procedures.length === 0) && (
                  <Typography
                    sx={{
                      fontSize: '13px',
                      color: '#57606a',
                      fontStyle: 'italic',
                    }}
                  >
                    No procedures added yet
                  </Typography>
                )}
              </Box>

              {/* Add Procedure Dialog */}
              <Dialog
                open={procedureDialogOpen}
                onClose={handleCloseProcedureDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                  sx: {
                    borderRadius: '8px',
                  },
                }}
              >
                <DialogTitle
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #d0d7de',
                    paddingBottom: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: '#24292f' }}
                  >
                    Add Procedure
                  </Typography>
                  <IconButton
                    onClick={handleCloseProcedureDialog}
                    sx={{ color: '#57606a' }}
                  >
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent
                  sx={{ paddingTop: 4, paddingBottom: 3, minHeight: 120 }}
                >
                  <Autocomplete
                    options={mockProcedures}
                    getOptionLabel={(option) => option.name}
                    value={selectedProcedureForAdd}
                    onChange={(_, newValue) => {
                      handleProcedureSelect(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Procedure"
                        placeholder="Search for a procedure..."
                        fullWidth
                        autoFocus
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{
                          '& .MuiInputLabel-root': {
                            position: 'relative',
                            transform: 'none',
                            marginBottom: 1,
                          },
                          '& .MuiInputBase-root': {
                            marginTop: 0,
                          },
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        {...props}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          padding: '12px 16px',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#24292f',
                          }}
                        >
                          {option.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '12px',
                            color: '#57606a',
                            marginTop: 0.5,
                          }}
                        >
                          {option.category} • {option.duration}
                        </Typography>
                      </Box>
                    )}
                  />
                </DialogContent>
                <DialogActions
                  sx={{
                    borderTop: '1px solid #d0d7de',
                    padding: 2,
                  }}
                >
                  <Button
                    onClick={handleCloseProcedureDialog}
                    sx={{
                      textTransform: 'none',
                      color: '#24292f',
                      '&:hover': {
                        backgroundColor: '#f6f8fa',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddProcedure}
                    variant="contained"
                    disabled={!selectedProcedureForAdd}
                    sx={{
                      textTransform: 'none',
                      backgroundColor: '#2563eb',
                      '&:hover': {
                        backgroundColor: '#1d4ed8',
                      },
                    }}
                  >
                    Add
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Procedure Detail Dialog */}
              <Dialog
                open={procedureDetailDialogOpen}
                onClose={() => {
                  setProcedureDetailDialogOpen(false);
                  setProcedureToView(null);
                  setSelectedProcedureForAdd(null);
                }}
                maxWidth="md"
                fullWidth
                PaperProps={{
                  sx: {
                    borderRadius: '8px',
                  },
                }}
              >
                {(procedureToView || selectedProcedureForAdd) && (
                  <>
                    <DialogTitle
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid #d0d7de',
                        paddingBottom: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: 600, color: '#24292f' }}
                        >
                          {(procedureToView || selectedProcedureForAdd)?.name}
                        </Typography>
                        <Chip
                          label={
                            (procedureToView || selectedProcedureForAdd)
                              ?.category
                          }
                          size="small"
                          sx={{
                            marginTop: 1,
                            backgroundColor: '#f0f9ff',
                            color: '#0284c7',
                          }}
                        />
                      </Box>
                      <IconButton
                        onClick={() => {
                          setProcedureDetailDialogOpen(false);
                          setProcedureToView(null);
                          setSelectedProcedureForAdd(null);
                        }}
                        sx={{ color: '#57606a' }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ paddingTop: 3 }}>
                      <Box sx={{ marginBottom: 3 }}>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#24292f',
                            marginBottom: 1,
                          }}
                        >
                          Description
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            color: '#57606a',
                            lineHeight: 1.6,
                          }}
                        >
                          {
                            (procedureToView || selectedProcedureForAdd)
                              ?.description
                          }
                        </Typography>
                      </Box>

                      <Box sx={{ marginBottom: 3 }}>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#24292f',
                            marginBottom: 1,
                          }}
                        >
                          Duration
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: '#57606a' }}>
                          {
                            (procedureToView || selectedProcedureForAdd)
                              ?.duration
                          }
                        </Typography>
                      </Box>

                      {(procedureToView || selectedProcedureForAdd)
                        ?.preparation &&
                        (procedureToView || selectedProcedureForAdd)!
                          .preparation.length > 0 && (
                          <Box sx={{ marginBottom: 3 }}>
                            <Typography
                              sx={{
                                fontSize: '14px',
                                fontWeight: 600,
                                color: '#24292f',
                                marginBottom: 1,
                              }}
                            >
                              Preparation Required
                            </Typography>
                            <Box
                              sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}
                            >
                              {(
                                procedureToView || selectedProcedureForAdd
                              )?.preparation.map((item, index) => (
                                <Chip
                                  key={index}
                                  label={item}
                                  size="small"
                                  sx={{
                                    backgroundColor: '#f6f8fa',
                                    color: '#24292f',
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}

                      {(procedureToView || selectedProcedureForAdd)?.steps &&
                        (procedureToView || selectedProcedureForAdd)!.steps
                          .length > 0 && (
                          <Box sx={{ marginBottom: 3 }}>
                            <Typography
                              sx={{
                                fontSize: '14px',
                                fontWeight: 600,
                                color: '#24292f',
                                marginBottom: 1,
                              }}
                            >
                              Steps
                            </Typography>
                            <Box
                              component="ol"
                              sx={{ paddingLeft: 3, margin: 0 }}
                            >
                              {(
                                procedureToView || selectedProcedureForAdd
                              )?.steps.map((step, index) => (
                                <Typography
                                  key={index}
                                  component="li"
                                  sx={{
                                    fontSize: '14px',
                                    color: '#57606a',
                                    marginBottom: 1,
                                    lineHeight: 1.6,
                                  }}
                                >
                                  {step}
                                </Typography>
                              ))}
                            </Box>
                          </Box>
                        )}

                      {(procedureToView || selectedProcedureForAdd)?.notes && (
                        <Box>
                          <Typography
                            sx={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#24292f',
                              marginBottom: 1,
                            }}
                          >
                            Notes
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '14px',
                              color: '#57606a',
                              lineHeight: 1.6,
                            }}
                          >
                            {
                              (procedureToView || selectedProcedureForAdd)
                                ?.notes
                            }
                          </Typography>
                        </Box>
                      )}
                    </DialogContent>
                    <DialogActions
                      sx={{
                        borderTop: '1px solid #d0d7de',
                        padding: 2,
                      }}
                    >
                      <Button
                        onClick={() => {
                          setProcedureDetailDialogOpen(false);
                          setProcedureToView(null);
                          setSelectedProcedureForAdd(null);
                        }}
                        sx={{
                          textTransform: 'none',
                          color: '#24292f',
                        }}
                      >
                        Close
                      </Button>
                      {selectedProcedureForAdd && (
                        <Button
                          onClick={handleAddProcedure}
                          variant="contained"
                          sx={{
                            textTransform: 'none',
                            backgroundColor: '#2563eb',
                            '&:hover': {
                              backgroundColor: '#1d4ed8',
                            },
                          }}
                        >
                          Add Procedure
                        </Button>
                      )}
                    </DialogActions>
                  </>
                )}
              </Dialog>

              {/* Medications */}
              <Box sx={{ marginBottom: 4 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#24292f',
                    }}
                  >
                    Medications
                  </Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleOpenMedicationDialog}
                    size="small"
                    sx={{
                      textTransform: 'none',
                      fontSize: '14px',
                      color: '#2563eb',
                    }}
                  >
                    Add Medication or Treatment
                  </Button>
                </Box>
                {form.state.values.medications?.map((medication, index) => (
                  <Paper
                    key={index}
                    sx={{
                      padding: 2,
                      marginBottom: 2,
                      border: '1px solid #d0d7de',
                      borderRadius: '6px',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 1.5,
                      }}
                    >
                      <Typography
                        onClick={() => {
                          const med = mockMedications.find(
                            (m) => m.name === medication.name
                          );
                          if (med) {
                            setMedicationToView(med);
                            setMedicationDetailDialogOpen(true);
                          }
                        }}
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#24292f',
                          cursor: 'pointer',
                          '&:hover': {
                            color: '#2563eb',
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {medication.name || `Medication ${index + 1}`}
                      </Typography>
                      <IconButton
                        onClick={() => removeMedication(index)}
                        size="small"
                        sx={{
                          color: '#dc2626',
                          '&:hover': {
                            backgroundColor: '#fef2f2',
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                        gap: 2,
                      }}
                    >
                      <TextField
                        label="Name *"
                        value={medication.name}
                        onChange={(e) => {
                          const currentMedications =
                            form.state.values.medications || [];
                          const updated = [...currentMedications];
                          updated[index] = {
                            ...updated[index],
                            name: e.target.value,
                          };
                          form.setFieldValue('medications', updated);
                        }}
                        fullWidth
                        size="small"
                        placeholder="e.g., Amoxicillin"
                      />
                      <TextField
                        label="Dosage *"
                        value={medication.dosage}
                        onChange={(e) => {
                          const currentMedications =
                            form.state.values.medications || [];
                          const updated = [...currentMedications];
                          updated[index] = {
                            ...updated[index],
                            dosage: e.target.value,
                          };
                          form.setFieldValue('medications', updated);
                        }}
                        fullWidth
                        size="small"
                        placeholder="e.g., 12.5mg/kg"
                      />
                      <TextField
                        label="Frequency *"
                        value={medication.frequency}
                        onChange={(e) => {
                          const currentMedications =
                            form.state.values.medications || [];
                          const updated = [...currentMedications];
                          updated[index] = {
                            ...updated[index],
                            frequency: e.target.value,
                          };
                          form.setFieldValue('medications', updated);
                        }}
                        fullWidth
                        size="small"
                        placeholder="e.g., BID (twice daily)"
                      />
                      <TextField
                        label="Duration *"
                        value={medication.duration}
                        onChange={(e) => {
                          const currentMedications =
                            form.state.values.medications || [];
                          const updated = [...currentMedications];
                          updated[index] = {
                            ...updated[index],
                            duration: e.target.value,
                          };
                          form.setFieldValue('medications', updated);
                        }}
                        fullWidth
                        size="small"
                        placeholder="e.g., 14 days"
                      />
                    </Box>
                  </Paper>
                ))}
                {(!form.state.values.medications ||
                  form.state.values.medications.length === 0) && (
                  <Typography
                    sx={{
                      fontSize: '13px',
                      color: '#57606a',
                      fontStyle: 'italic',
                    }}
                  >
                    No medications added yet
                  </Typography>
                )}
              </Box>

              {/* Add Medication Dialog */}
              <Dialog
                open={medicationDialogOpen}
                onClose={handleCloseMedicationDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                  sx: {
                    borderRadius: '8px',
                  },
                }}
              >
                <DialogTitle
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #d0d7de',
                    paddingBottom: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: '#24292f' }}
                  >
                    Add Medication or Treatment
                  </Typography>
                  <IconButton
                    onClick={handleCloseMedicationDialog}
                    sx={{ color: '#57606a' }}
                  >
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent
                  sx={{ paddingTop: 4, paddingBottom: 3, minHeight: 120 }}
                >
                  <Autocomplete
                    options={mockMedications}
                    getOptionLabel={(option) => option.name}
                    value={selectedMedicationForAdd}
                    onChange={(_, newValue) => {
                      handleMedicationSelect(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Medication or Treatment"
                        placeholder="Search for a medication or treatment..."
                        fullWidth
                        autoFocus
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{
                          '& .MuiInputLabel-root': {
                            position: 'relative',
                            transform: 'none',
                            marginBottom: 1,
                          },
                          '& .MuiInputBase-root': {
                            marginTop: 0,
                          },
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        {...props}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          padding: '12px 16px',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#24292f',
                          }}
                        >
                          {option.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '12px',
                            color: '#57606a',
                            marginTop: 0.5,
                          }}
                        >
                          {option.category} • {option.administration}
                        </Typography>
                      </Box>
                    )}
                  />
                </DialogContent>
                <DialogActions
                  sx={{
                    borderTop: '1px solid #d0d7de',
                    padding: 2,
                  }}
                >
                  <Button
                    onClick={handleCloseMedicationDialog}
                    sx={{
                      textTransform: 'none',
                      color: '#24292f',
                      '&:hover': {
                        backgroundColor: '#f6f8fa',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddMedication}
                    variant="contained"
                    disabled={!selectedMedicationForAdd}
                    sx={{
                      textTransform: 'none',
                      backgroundColor: '#2563eb',
                      '&:hover': {
                        backgroundColor: '#1d4ed8',
                      },
                    }}
                  >
                    Add
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Medication Detail Dialog */}
              <Dialog
                open={medicationDetailDialogOpen}
                onClose={() => {
                  setMedicationDetailDialogOpen(false);
                  setMedicationToView(null);
                  setSelectedMedicationForAdd(null);
                }}
                maxWidth="md"
                fullWidth
                PaperProps={{
                  sx: {
                    borderRadius: '8px',
                  },
                }}
              >
                {(medicationToView || selectedMedicationForAdd) && (
                  <>
                    <DialogTitle
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid #d0d7de',
                        paddingBottom: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: 600, color: '#24292f' }}
                        >
                          {(medicationToView || selectedMedicationForAdd)?.name}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1,
                            marginTop: 1,
                            flexWrap: 'wrap',
                          }}
                        >
                          <Chip
                            label={
                              (medicationToView || selectedMedicationForAdd)
                                ?.category
                            }
                            size="small"
                            sx={{
                              backgroundColor: '#f0f9ff',
                              color: '#0284c7',
                            }}
                          />
                          <Chip
                            label={
                              (medicationToView || selectedMedicationForAdd)
                                ?.administration
                            }
                            size="small"
                            sx={{
                              backgroundColor: '#f6f8fa',
                              color: '#24292f',
                            }}
                          />
                          {(medicationToView || selectedMedicationForAdd)
                            ?.species && (
                            <Chip
                              label={(
                                medicationToView || selectedMedicationForAdd
                              )?.species.join(', ')}
                              size="small"
                              sx={{
                                backgroundColor: '#fef3c7',
                                color: '#92400e',
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                      <IconButton
                        onClick={() => {
                          setMedicationDetailDialogOpen(false);
                          setMedicationToView(null);
                          setSelectedMedicationForAdd(null);
                        }}
                        sx={{ color: '#57606a' }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ paddingTop: 3 }}>
                      <Box sx={{ marginBottom: 3 }}>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#24292f',
                            marginBottom: 1,
                          }}
                        >
                          Active Ingredient
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            color: '#57606a',
                            lineHeight: 1.6,
                          }}
                        >
                          {
                            (medicationToView || selectedMedicationForAdd)
                              ?.activeIngredient
                          }
                        </Typography>
                      </Box>

                      <Box sx={{ marginBottom: 3 }}>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#24292f',
                            marginBottom: 1,
                          }}
                        >
                          Indications
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            color: '#57606a',
                            lineHeight: 1.6,
                          }}
                        >
                          {
                            (medicationToView || selectedMedicationForAdd)
                              ?.indications
                          }
                        </Typography>
                      </Box>

                      <Box sx={{ marginBottom: 3 }}>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#24292f',
                            marginBottom: 1,
                          }}
                        >
                          Dosage
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: '#57606a' }}>
                          {
                            (medicationToView || selectedMedicationForAdd)
                              ?.dosage
                          }
                        </Typography>
                      </Box>

                      {(medicationToView || selectedMedicationForAdd)
                        ?.presentation && (
                        <Box sx={{ marginBottom: 3 }}>
                          <Typography
                            sx={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#24292f',
                              marginBottom: 1,
                            }}
                          >
                            Presentation
                          </Typography>
                          <Typography
                            sx={{ fontSize: '14px', color: '#57606a' }}
                          >
                            {
                              (medicationToView || selectedMedicationForAdd)
                                ?.presentation
                            }
                          </Typography>
                        </Box>
                      )}

                      {(medicationToView || selectedMedicationForAdd)
                        ?.contraindications &&
                        (medicationToView || selectedMedicationForAdd)!
                          .contraindications.length > 0 && (
                          <Box sx={{ marginBottom: 3 }}>
                            <Typography
                              sx={{
                                fontSize: '14px',
                                fontWeight: 600,
                                color: '#24292f',
                                marginBottom: 1,
                              }}
                            >
                              Contraindications
                            </Typography>
                            <Box
                              component="ul"
                              sx={{ paddingLeft: 3, margin: 0 }}
                            >
                              {(
                                medicationToView || selectedMedicationForAdd
                              )?.contraindications.map((contra, index) => (
                                <Typography
                                  key={index}
                                  component="li"
                                  sx={{
                                    fontSize: '14px',
                                    color: '#dc2626',
                                    marginBottom: 0.5,
                                    lineHeight: 1.6,
                                  }}
                                >
                                  {contra}
                                </Typography>
                              ))}
                            </Box>
                          </Box>
                        )}

                      {(medicationToView || selectedMedicationForAdd)
                        ?.sideEffects &&
                        (medicationToView || selectedMedicationForAdd)!
                          .sideEffects.length > 0 && (
                          <Box sx={{ marginBottom: 3 }}>
                            <Typography
                              sx={{
                                fontSize: '14px',
                                fontWeight: 600,
                                color: '#24292f',
                                marginBottom: 1,
                              }}
                            >
                              Side Effects
                            </Typography>
                            <Box
                              component="ul"
                              sx={{ paddingLeft: 3, margin: 0 }}
                            >
                              {(
                                medicationToView || selectedMedicationForAdd
                              )?.sideEffects.map((effect, index) => (
                                <Typography
                                  key={index}
                                  component="li"
                                  sx={{
                                    fontSize: '14px',
                                    color: '#57606a',
                                    marginBottom: 0.5,
                                    lineHeight: 1.6,
                                  }}
                                >
                                  {effect}
                                </Typography>
                              ))}
                            </Box>
                          </Box>
                        )}

                      {(medicationToView || selectedMedicationForAdd)
                        ?.manufacturer && (
                        <Box>
                          <Typography
                            sx={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#24292f',
                              marginBottom: 1,
                            }}
                          >
                            Manufacturer
                          </Typography>
                          <Typography
                            sx={{ fontSize: '14px', color: '#57606a' }}
                          >
                            {
                              (medicationToView || selectedMedicationForAdd)
                                ?.manufacturer
                            }
                          </Typography>
                        </Box>
                      )}
                    </DialogContent>
                    <DialogActions
                      sx={{
                        borderTop: '1px solid #d0d7de',
                        padding: 2,
                      }}
                    >
                      <Button
                        onClick={() => {
                          setMedicationDetailDialogOpen(false);
                          setMedicationToView(null);
                          setSelectedMedicationForAdd(null);
                        }}
                        sx={{
                          textTransform: 'none',
                          color: '#24292f',
                        }}
                      >
                        Close
                      </Button>
                      {selectedMedicationForAdd && (
                        <Button
                          onClick={handleAddMedication}
                          variant="contained"
                          sx={{
                            textTransform: 'none',
                            backgroundColor: '#2563eb',
                            '&:hover': {
                              backgroundColor: '#1d4ed8',
                            },
                          }}
                        >
                          Add Medication
                        </Button>
                      )}
                    </DialogActions>
                  </>
                )}
              </Dialog>

              <Divider sx={{ marginY: 4 }} />

              {/* AI Consultation Assistant */}
              <Box sx={{ marginBottom: 4 }}>
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#24292f',
                    marginBottom: 2,
                  }}
                >
                  AI Consultation Assistant
                </Typography>
                <Paper
                  sx={{
                    position: 'relative',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    border: '2px solid #d0d7de',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: '#2563eb',
                    },
                    '&:focus-within': {
                      borderColor: '#2563eb',
                      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
                    },
                  }}
                >
                  <InputBase
                    placeholder="Ask anything about the consultation..."
                    fullWidth
                    value={aiQueryValue}
                    onChange={(e) => setAiQueryValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (
                        e.key === 'Enter' &&
                        aiQueryValue.trim() &&
                        !isLoadingAI
                      ) {
                        handleAISubmit();
                      }
                    }}
                    disabled={isLoadingAI}
                    sx={{
                      color: '#24292f',
                      padding: '16px 20px',
                      fontSize: '16px',
                      '& .MuiInputBase-input': {
                        '&::placeholder': {
                          color: '#57606a',
                          opacity: 1,
                        },
                        '&:disabled': {
                          color: '#9ca3af',
                        },
                      },
                    }}
                  />
                  {isLoadingAI && (
                    <Box
                      sx={{
                        padding: '12px 20px',
                        borderTop: '1px solid #f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          border: '2px solid #2563eb',
                          borderTop: '2px solid transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                          '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' },
                          },
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: '14px',
                          color: '#57606a',
                        }}
                      >
                        Thinking...
                      </Typography>
                    </Box>
                  )}
                  {aiConversation.length > 0 && (
                    <Box
                      sx={{
                        maxHeight: 400,
                        overflowY: 'auto',
                        borderTop: '1px solid #f0f0f0',
                      }}
                    >
                      {aiConversation.map((item, index) => (
                        <Box key={index}>
                          <Box
                            sx={{
                              padding: '12px 20px',
                              backgroundColor: '#f6f8fa',
                              borderBottom: '1px solid #f0f0f0',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#24292f',
                                marginBottom: 0.5,
                              }}
                            >
                              You:
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '14px',
                                color: '#57606a',
                              }}
                            >
                              {item.query}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              padding: '12px 20px',
                              backgroundColor: '#ffffff',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#2563eb',
                                marginBottom: 0.5,
                              }}
                            >
                              AI:
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '14px',
                                color: '#24292f',
                                lineHeight: 1.6,
                                whiteSpace: 'pre-wrap',
                              }}
                            >
                              {item.response}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderTop: '1px solid #f0f0f0',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        onClick={handleAISubmit}
                        disabled={!aiQueryValue.trim() || isLoadingAI}
                        size="small"
                        sx={{
                          color:
                            aiQueryValue.trim() && !isLoadingAI
                              ? '#2563eb'
                              : '#9ca3af',
                          '&:hover': {
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                          },
                          '&.Mui-disabled': {
                            color: '#9ca3af',
                          },
                        }}
                      >
                        {isLoadingAI ? (
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              border: '2px solid #2563eb',
                              borderTop: '2px solid transparent',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite',
                              '@keyframes spin': {
                                '0%': { transform: 'rotate(0deg)' },
                                '100%': { transform: 'rotate(360deg)' },
                              },
                            }}
                          />
                        ) : (
                          <SendIcon fontSize="small" />
                        )}
                      </IconButton>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          color: '#57606a',
                        }}
                      >
                        {isLoadingAI
                          ? 'Processing...'
                          : 'Press Enter or click to send'}
                      </Typography>
                    </Box>
                    <Button
                      onClick={handleModelMenuOpen}
                      endIcon={<ArrowDropDownIcon />}
                      sx={{
                        color: '#24292f',
                        textTransform: 'none',
                        fontSize: '14px',
                        fontWeight: 500,
                        '&:hover': {
                          backgroundColor: '#f6f8fa',
                        },
                      }}
                    >
                      {selectedModel === 'gpt-4.5' && 'GPT 4.5'}
                      {selectedModel === 'gpt-5-plus' && 'GPT 5 (Plus)'}
                      {selectedModel === 'grok-3' && 'Grok 3'}
                      {selectedModel === 'grok-4-plus' && 'Grok 4 (Plus)'}
                      {selectedModel === 'veterai-3.1' && 'VeteriAI 3.1'}
                    </Button>
                    <Menu
                      anchorEl={modelMenuAnchor}
                      open={Boolean(modelMenuAnchor)}
                      onClose={handleModelMenuClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      sx={{
                        '& .MuiPaper-root': {
                          marginTop: 1,
                          minWidth: 200,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          padding: '8px 16px',
                          borderBottom: '1px solid #d0d7de',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#57606a',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          Models
                        </Typography>
                      </Box>
                      <MenuItem
                        onClick={() => handleModelSelect('gpt-4.5')}
                        selected={selectedModel === 'gpt-4.5'}
                        sx={{
                          '&.Mui-selected': {
                            backgroundColor: '#f6f8fa',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                          }}
                        >
                          <Typography sx={{ fontSize: '14px' }}>
                            GPT 4.5
                          </Typography>
                          {selectedModel === 'gpt-4.5' && (
                            <CheckIcon
                              sx={{ fontSize: '18px', color: '#2563eb' }}
                            />
                          )}
                        </Box>
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleModelSelect('gpt-5-plus')}
                        selected={selectedModel === 'gpt-5-plus'}
                        sx={{
                          '&.Mui-selected': {
                            backgroundColor: '#f6f8fa',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                          }}
                        >
                          <Typography sx={{ fontSize: '14px' }}>
                            GPT 5 (Plus)
                          </Typography>
                          {selectedModel === 'gpt-5-plus' && (
                            <CheckIcon
                              sx={{ fontSize: '18px', color: '#2563eb' }}
                            />
                          )}
                        </Box>
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleModelSelect('grok-3')}
                        selected={selectedModel === 'grok-3'}
                        sx={{
                          '&.Mui-selected': {
                            backgroundColor: '#f6f8fa',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                          }}
                        >
                          <Typography sx={{ fontSize: '14px' }}>
                            Grok 3
                          </Typography>
                          {selectedModel === 'grok-3' && (
                            <CheckIcon
                              sx={{ fontSize: '18px', color: '#2563eb' }}
                            />
                          )}
                        </Box>
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleModelSelect('grok-4-plus')}
                        selected={selectedModel === 'grok-4-plus'}
                        sx={{
                          '&.Mui-selected': {
                            backgroundColor: '#f6f8fa',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                          }}
                        >
                          <Typography sx={{ fontSize: '14px' }}>
                            Grok 4 (Plus)
                          </Typography>
                          {selectedModel === 'grok-4-plus' && (
                            <CheckIcon
                              sx={{ fontSize: '18px', color: '#2563eb' }}
                            />
                          )}
                        </Box>
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleModelSelect('veterai-3.1')}
                        selected={selectedModel === 'veterai-3.1'}
                        sx={{
                          '&.Mui-selected': {
                            backgroundColor: '#f6f8fa',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                          }}
                        >
                          <Typography sx={{ fontSize: '14px' }}>
                            VeteriAI 3.1
                          </Typography>
                          {selectedModel === 'veterai-3.1' && (
                            <CheckIcon
                              sx={{ fontSize: '18px', color: '#2563eb' }}
                            />
                          )}
                        </Box>
                      </MenuItem>
                    </Menu>
                  </Box>
                </Paper>
              </Box>

              <Divider sx={{ marginY: 4 }} />

              {/* Follow-up */}
              <Box sx={{ marginBottom: 4 }}>
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#24292f',
                    marginBottom: 2,
                  }}
                >
                  Follow-up (Optional)
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                  }}
                >
                  <form.Field name="followUpDate">
                    {(field) => (
                      <TextField
                        label="Follow-up from"
                        type="date"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    )}
                  </form.Field>
                  <form.Field name="followUpNotes">
                    {(field) => (
                      <Box sx={{ position: 'relative' }}>
                        <TextField
                          label="Follow-up Notes"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          fullWidth
                          placeholder="e.g., Schedule next annual check-up"
                          InputProps={{
                            endAdornment: field.state.value && (
                              <IconButton
                                onClick={() =>
                                  handleImproveWithAI('followUpNotes')
                                }
                                disabled={improvingField === 'followUpNotes'}
                                size="small"
                                sx={{
                                  color: '#2563eb',
                                  '&:hover': {
                                    backgroundColor: '#eff6ff',
                                  },
                                  '&.Mui-disabled': {
                                    color: '#9ca3af',
                                  },
                                }}
                                title="Improve with AI"
                              >
                                {improvingField === 'followUpNotes' ? (
                                  <Box
                                    sx={{
                                      width: 20,
                                      height: 20,
                                      border: '2px solid #2563eb',
                                      borderTop: '2px solid transparent',
                                      borderRadius: '50%',
                                      animation: 'spin 1s linear infinite',
                                      '@keyframes spin': {
                                        '0%': { transform: 'rotate(0deg)' },
                                        '100%': { transform: 'rotate(360deg)' },
                                      },
                                    }}
                                  />
                                ) : (
                                  <AutoAwesomeIcon fontSize="small" />
                                )}
                              </IconButton>
                            ),
                          }}
                        />
                      </Box>
                    )}
                  </form.Field>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 2,
                  marginTop: 4,
                }}
              >
                <Button
                  onClick={handleCancel}
                  sx={{
                    textTransform: 'none',
                    color: '#24292f',
                    '&:hover': {
                      backgroundColor: '#f6f8fa',
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={form.state.isSubmitting}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: '#2563eb',
                    '&:hover': {
                      backgroundColor: '#1d4ed8',
                    },
                  }}
                >
                  {form.state.isSubmitting ? 'Saving...' : 'Save Consultation'}
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
