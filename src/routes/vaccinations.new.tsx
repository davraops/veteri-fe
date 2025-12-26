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
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { mockPets, Pet } from '@/data/mockPets';
import { mockOrganizations } from '@/data/mockOrganizations';

export const Route = createFileRoute('/vaccinations/new')({
  component: NewVaccination,
});

interface VaccinationFormValues {
  organization: string;
  petId: string;
  date: string;
  time: string;
  vaccines: Array<{
    name: string;
    dosage: string;
    validity: string;
  }>;
  notes: string;
}

function NewVaccination() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [petSearchValue, setPetSearchValue] = useState('');
  const [petSearchFocused, setPetSearchFocused] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const petSearchRef = useRef<HTMLDivElement>(null);

  const form = useForm({
    defaultValues: {
      organization: '',
      petId: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      vaccines: [] as Array<{
        name: string;
        dosage: string;
        validity: string;
      }>,
      notes: '',
    } as VaccinationFormValues,
    onSubmit: async ({ value }) => {
      // TODO: Save vaccination to medical history
      console.log('Vaccination submitted:', value);
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

  const addVaccine = () => {
    const currentVaccines = form.state.values.vaccines || [];
    form.setFieldValue('vaccines', [
      ...currentVaccines,
      { name: '', dosage: '', validity: '' },
    ]);
  };

  const removeVaccine = (index: number) => {
    const currentVaccines = form.state.values.vaccines || [];
    form.setFieldValue(
      'vaccines',
      currentVaccines.filter((_, i) => i !== index)
    );
  };

  const commonVaccines = [
    'FVRCP',
    'Rabies Vaccine',
    'DHPP',
    'Bordetella',
    'Lyme Disease',
    'Canine Influenza',
    'Feline Leukemia',
    'FIV',
    'Leptospirosis',
    'Parvovirus',
    'Distemper',
    'Hepatitis',
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar pageTitle="New Vaccination" onToggleSidebar={toggleSidebar} />
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
            maxWidth: 800,
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
              New Vaccination
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

              {/* Vaccines */}
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
                    Vaccines *
                  </Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addVaccine}
                    size="small"
                    sx={{
                      textTransform: 'none',
                      fontSize: '14px',
                      color: '#10b981',
                    }}
                  >
                    Add Vaccine
                  </Button>
                </Box>
                {form.state.values.vaccines?.map((vaccine, index) => (
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
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#24292f',
                        }}
                      >
                        Vaccine {index + 1}
                      </Typography>
                      <IconButton
                        onClick={() => removeVaccine(index)}
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
                        gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr' },
                        gap: 2,
                      }}
                    >
                      <Autocomplete
                        freeSolo
                        options={commonVaccines}
                        value={vaccine.name}
                        onChange={(_, newValue) => {
                          const currentVaccines =
                            form.state.values.vaccines || [];
                          const updated = [...currentVaccines];
                          updated[index] = {
                            ...updated[index],
                            name: newValue || '',
                          };
                          form.setFieldValue('vaccines', updated);
                        }}
                        onInputChange={(_, newInputValue) => {
                          const currentVaccines =
                            form.state.values.vaccines || [];
                          const updated = [...currentVaccines];
                          updated[index] = {
                            ...updated[index],
                            name: newInputValue,
                          };
                          form.setFieldValue('vaccines', updated);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Vaccine Name *"
                            placeholder="Select or enter vaccine name"
                            size="small"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                      <TextField
                        label="Dosage *"
                        value={vaccine.dosage}
                        onChange={(e) => {
                          const currentVaccines =
                            form.state.values.vaccines || [];
                          const updated = [...currentVaccines];
                          updated[index] = {
                            ...updated[index],
                            dosage: e.target.value,
                          };
                          form.setFieldValue('vaccines', updated);
                        }}
                        fullWidth
                        size="small"
                        placeholder="e.g., 1 mL"
                      />
                      <TextField
                        label="Validity *"
                        value={vaccine.validity}
                        onChange={(e) => {
                          const currentVaccines =
                            form.state.values.vaccines || [];
                          const updated = [...currentVaccines];
                          updated[index] = {
                            ...updated[index],
                            validity: e.target.value,
                          };
                          form.setFieldValue('vaccines', updated);
                        }}
                        fullWidth
                        size="small"
                        placeholder="e.g., 1 year, 3 years"
                      />
                    </Box>
                  </Paper>
                ))}
                {(!form.state.values.vaccines ||
                  form.state.values.vaccines.length === 0) && (
                  <Typography
                    sx={{
                      fontSize: '13px',
                      color: '#57606a',
                      fontStyle: 'italic',
                    }}
                  >
                    No vaccines added yet. Click "Add Vaccine" to add one.
                  </Typography>
                )}
              </Box>

              {/* Notes */}
              <form.Field name="notes">
                {(field) => (
                  <TextField
                    label="Notes (Optional)"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ marginBottom: 4 }}
                    placeholder="Additional notes about the vaccination..."
                  />
                )}
              </form.Field>

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
                    backgroundColor: '#10b981',
                    '&:hover': {
                      backgroundColor: '#059669',
                    },
                  }}
                >
                  {form.state.isSubmitting ? 'Saving...' : 'Save Vaccination'}
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
