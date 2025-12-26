import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { mockOwners, Owner } from '@/data/mockOwners';

export const Route = createFileRoute('/pets/new/')({
  component: NewPet,
});

interface PetFormValues {
  name: string;
  lastName: string;
  organization: string;
  ownerId: string;
  type: string;
  breed: string;
  gender: string;
  birthDate: string;
  birthDateUnknown: boolean;
  color: string;
  microchip: string;
  notes: string;
}

function NewPet() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');
  const [showNewOwnerForm, setShowNewOwnerForm] = useState(false);
  const [newOwnerData, setNewOwnerData] = useState<Owner | null>(null);

  const form = useForm({
    defaultValues: {
      name: '',
      lastName: '',
      organization: '',
      ownerId: '',
      type: '',
      breed: '',
      gender: '',
      birthDate: '',
      birthDateUnknown: false,
      color: '',
      microchip: '',
      notes: '',
    } as PetFormValues,
    onSubmit: async ({ value }) => {
      // If creating a new owner, include owner data
      const searchParams: PetFormValues & { newOwnerData?: Owner } = {
        ...value,
      };
      if (newOwnerData) {
        searchParams.newOwnerData = newOwnerData;
      }
      // Navigate to verification page with form data
      navigate({
        to: '/pets/new/verify',
        search: searchParams,
      });
    },
  });

  // Owner form for creating new owner
  const ownerForm = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phones: [''],
      nationalId: '',
      nationality: '',
      address: '',
      city: '',
      organization: selectedOrganization,
    },
    onSubmit: async ({ value }) => {
      // Validate owner form
      if (
        !value.firstName ||
        !value.lastName ||
        !value.email ||
        !value.phones[0] ||
        !value.nationalId ||
        !value.nationality ||
        !value.organization
      ) {
        return;
      }
      // Store owner data
      setNewOwnerData(value);
      // Set ownerId to 'new' to indicate new owner
      form.setFieldValue('ownerId', 'new');
    },
  });

  // Update owner form organization when selected organization changes
  useEffect(() => {
    if (ownerForm && selectedOrganization) {
      ownerForm.setFieldValue('organization', selectedOrganization);
    }
  }, [selectedOrganization, ownerForm]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCancel = () => {
    navigate({ to: '/pets' });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar pageTitle="New Pet" onToggleSidebar={toggleSidebar} />
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
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: '#24292f',
              marginBottom: 3,
            }}
          >
            Create New Pet
          </Typography>

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
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Organization */}
                <form.Field
                  name="organization"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? 'Organization is required' : undefined,
                  }}
                >
                  {(field) => (
                    <FormControl
                      fullWidth
                      required
                      error={!!field.state.meta.errors.length}
                    >
                      <InputLabel>Organization</InputLabel>
                      <Select
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          setSelectedOrganization(e.target.value);
                          // Reset ownerId when organization changes
                          form.setFieldValue('ownerId', '');
                        }}
                        onBlur={field.handleBlur}
                        label="Organization"
                        sx={{
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2563eb',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2563eb',
                          },
                        }}
                      >
                        <MenuItem value="johndoe">johndoe</MenuItem>
                        <MenuItem value="mr-pet">mr-pet</MenuItem>
                        <MenuItem value="vete-amigos">vete-amigos</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </form.Field>

                {/* Owner */}
                <form.Field
                  name="ownerId"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value || value === 'new') {
                        if (value === 'new' && !showNewOwnerForm) {
                          setShowNewOwnerForm(true);
                        }
                        return value === 'new'
                          ? undefined
                          : 'Owner is required';
                      }
                      return undefined;
                    },
                  }}
                >
                  {(field) => {
                    // Filter owners by selected organization
                    const availableOwners = selectedOrganization
                      ? mockOwners.filter(
                          (owner) => owner.organization === selectedOrganization
                        )
                      : [];

                    return (
                      <Box>
                        <FormControl
                          fullWidth
                          required
                          error={!!field.state.meta.errors.length}
                        >
                          <InputLabel>Owner</InputLabel>
                          <Select
                            value={field.state.value}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === 'new') {
                                setShowNewOwnerForm(true);
                                field.handleChange('new');
                              } else {
                                setShowNewOwnerForm(false);
                                field.handleChange(value);
                              }
                            }}
                            onBlur={field.handleBlur}
                            label="Owner"
                            disabled={!selectedOrganization}
                            sx={{
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#2563eb',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                                {
                                  borderColor: '#2563eb',
                                },
                            }}
                          >
                            {availableOwners.length === 0 ? (
                              <MenuItem disabled>
                                {!selectedOrganization
                                  ? 'Select an organization first'
                                  : 'No owners found for this organization'}
                              </MenuItem>
                            ) : (
                              availableOwners.map((owner) => (
                                <MenuItem
                                  key={owner.id}
                                  value={String(owner.id)}
                                >
                                  {owner.firstName} {owner.lastName}
                                </MenuItem>
                              ))
                            )}
                            <MenuItem
                              value="new"
                              sx={{
                                borderTop: '1px solid #d0d7de',
                                marginTop: 0.5,
                                paddingTop: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}
                              >
                                <Typography
                                  sx={{ fontWeight: 600, color: '#2563eb' }}
                                >
                                  + Create New Owner
                                </Typography>
                              </Box>
                            </MenuItem>
                          </Select>
                        </FormControl>
                        {field.state.meta.errors.length > 0 && (
                          <Typography
                            sx={{
                              fontSize: '12px',
                              color: '#d32f2f',
                              marginTop: 0.5,
                              marginLeft: 1.75,
                            }}
                          >
                            {field.state.meta.errors[0]}
                          </Typography>
                        )}
                      </Box>
                    );
                  }}
                </form.Field>

                {/* New Owner Form */}
                {showNewOwnerForm && (
                  <Paper
                    sx={{
                      padding: 3,
                      backgroundColor: '#f6f8fa',
                      border: '1px solid #d0d7de',
                      borderRadius: '8px',
                      marginTop: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: '#24292f',
                        }}
                      >
                        Create New Owner
                      </Typography>
                      <Button
                        variant="text"
                        onClick={() => {
                          setShowNewOwnerForm(false);
                          form.setFieldValue('ownerId', '');
                          setNewOwnerData(null);
                          ownerForm.reset();
                        }}
                        sx={{
                          textTransform: 'none',
                          color: '#57606a',
                          '&:hover': {
                            backgroundColor: '#f6f8fa',
                          },
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>

                    <Box
                      sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                    >
                      {/* Organization (pre-filled) */}
                      <TextField
                        label="Organization"
                        value={selectedOrganization}
                        disabled
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#2563eb',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#2563eb',
                            },
                          },
                        }}
                      />

                      {/* First Name and Last Name */}
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                          gap: 2,
                        }}
                      >
                        <ownerForm.Field
                          name="firstName"
                          validators={{
                            onChange: ({ value }) =>
                              !value ? 'First name is required' : undefined,
                          }}
                        >
                          {(field) => (
                            <TextField
                              label="First Name"
                              required
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              error={!!field.state.meta.errors.length}
                              helperText={field.state.meta.errors[0]}
                              fullWidth
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: '#2563eb',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#2563eb',
                                  },
                                },
                              }}
                            />
                          )}
                        </ownerForm.Field>
                        <ownerForm.Field
                          name="lastName"
                          validators={{
                            onChange: ({ value }) =>
                              !value ? 'Last name is required' : undefined,
                          }}
                        >
                          {(field) => (
                            <TextField
                              label="Last Name"
                              required
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              error={!!field.state.meta.errors.length}
                              helperText={field.state.meta.errors[0]}
                              fullWidth
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: '#2563eb',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#2563eb',
                                  },
                                },
                              }}
                            />
                          )}
                        </ownerForm.Field>
                      </Box>

                      {/* Email */}
                      <ownerForm.Field
                        name="email"
                        validators={{
                          onChange: ({ value }) => {
                            if (!value) return 'Email is required';
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!emailRegex.test(value))
                              return 'Invalid email format';
                            return undefined;
                          },
                        }}
                      >
                        {(field) => (
                          <TextField
                            label="Email"
                            type="email"
                            required
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            error={!!field.state.meta.errors.length}
                            helperText={field.state.meta.errors[0]}
                            fullWidth
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                  borderColor: '#2563eb',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#2563eb',
                                },
                              },
                            }}
                          />
                        )}
                      </ownerForm.Field>

                      {/* Phones (up to 3) */}
                      <ownerForm.Field name="phones">
                        {(field) => (
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 2,
                            }}
                          >
                            {/* Primary Phone */}
                            <TextField
                              label="Phone"
                              type="tel"
                              required
                              value={field.state.value[0] || ''}
                              onChange={(e) => {
                                const newPhones = [...field.state.value];
                                newPhones[0] = e.target.value;
                                field.handleChange(newPhones);
                              }}
                              onBlur={field.handleBlur}
                              fullWidth
                              placeholder="+1 (555) 123-4567"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: '#2563eb',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#2563eb',
                                  },
                                },
                              }}
                            />

                            {/* Additional Contact Numbers */}
                            {field.state.value.length > 1 && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 2,
                                }}
                              >
                                <Box>
                                  <Typography
                                    sx={{
                                      fontSize: '14px',
                                      fontWeight: 600,
                                      color: '#57606a',
                                      marginTop: 1,
                                      marginBottom: 0.5,
                                    }}
                                  >
                                    Additional Contact Numbers
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: '12px',
                                      color: '#57606a',
                                      fontStyle: 'italic',
                                    }}
                                  >
                                    We recommend adding at least two additional
                                    contact numbers
                                  </Typography>
                                </Box>
                                {field.state.value
                                  .slice(1)
                                  .map((phone, index) => (
                                    <Box
                                      key={index + 1}
                                      sx={{
                                        display: 'flex',
                                        gap: 1,
                                        alignItems: 'flex-start',
                                      }}
                                    >
                                      <TextField
                                        label={`Phone ${index + 2}`}
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => {
                                          const newPhones = [
                                            ...field.state.value,
                                          ];
                                          newPhones[index + 1] = e.target.value;
                                          field.handleChange(newPhones);
                                        }}
                                        onBlur={field.handleBlur}
                                        fullWidth
                                        placeholder="+1 (555) 123-4567"
                                        sx={{
                                          '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                              borderColor: '#2563eb',
                                            },
                                            '&.Mui-focused fieldset': {
                                              borderColor: '#2563eb',
                                            },
                                          },
                                        }}
                                      />
                                      <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => {
                                          const newPhones =
                                            field.state.value.filter(
                                              (_, i) => i !== index + 1
                                            );
                                          field.handleChange(newPhones);
                                        }}
                                        sx={{
                                          minWidth: 'auto',
                                          padding: '8px',
                                          borderColor: '#d0d7de',
                                          '&:hover': {
                                            borderColor: '#d32f2f',
                                            backgroundColor: '#ffebee',
                                          },
                                        }}
                                      >
                                        Remove
                                      </Button>
                                    </Box>
                                  ))}
                              </Box>
                            )}

                            {field.state.value.length < 3 && (
                              <Box>
                                <Button
                                  variant="outlined"
                                  onClick={() => {
                                    const newPhones = [
                                      ...field.state.value,
                                      '',
                                    ];
                                    field.handleChange(newPhones);
                                  }}
                                  sx={{
                                    textTransform: 'none',
                                    borderColor: '#d0d7de',
                                    color: '#57606a',
                                    '&:hover': {
                                      borderColor: '#2563eb',
                                      backgroundColor: '#f6f8fa',
                                    },
                                  }}
                                >
                                  + Add Additional Contact Number
                                </Button>
                                {field.state.value.length === 1 && (
                                  <Typography
                                    sx={{
                                      fontSize: '12px',
                                      color: '#57606a',
                                      fontStyle: 'italic',
                                      marginTop: 1,
                                    }}
                                  >
                                    We recommend adding at least two additional
                                    contact numbers
                                  </Typography>
                                )}
                              </Box>
                            )}
                          </Box>
                        )}
                      </ownerForm.Field>

                      {/* National ID and Nationality */}
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                          gap: 2,
                        }}
                      >
                        <ownerForm.Field
                          name="nationalId"
                          validators={{
                            onChange: ({ value }) =>
                              !value ? 'National ID is required' : undefined,
                          }}
                        >
                          {(field) => (
                            <TextField
                              label="National ID"
                              required
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              error={!!field.state.meta.errors.length}
                              helperText={field.state.meta.errors[0]}
                              fullWidth
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: '#2563eb',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#2563eb',
                                  },
                                },
                              }}
                            />
                          )}
                        </ownerForm.Field>
                        <ownerForm.Field
                          name="nationality"
                          validators={{
                            onChange: ({ value }) =>
                              !value ? 'Nationality is required' : undefined,
                          }}
                        >
                          {(field) => (
                            <TextField
                              label="Nationality"
                              required
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              error={!!field.state.meta.errors.length}
                              helperText={field.state.meta.errors[0]}
                              fullWidth
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: '#2563eb',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#2563eb',
                                  },
                                },
                              }}
                            />
                          )}
                        </ownerForm.Field>
                      </Box>

                      {/* Address and City */}
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                          gap: 2,
                        }}
                      >
                        <ownerForm.Field name="address">
                          {(field) => (
                            <TextField
                              label="Address"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              fullWidth
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: '#2563eb',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#2563eb',
                                  },
                                },
                              }}
                            />
                          )}
                        </ownerForm.Field>
                        <ownerForm.Field name="city">
                          {(field) => (
                            <TextField
                              label="City"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              fullWidth
                              placeholder="City, State ZIP"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: '#2563eb',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#2563eb',
                                  },
                                },
                              }}
                            />
                          )}
                        </ownerForm.Field>
                      </Box>

                      {/* Save Owner Button */}
                      <Button
                        variant="contained"
                        onClick={() => {
                          ownerForm.handleSubmit();
                        }}
                        sx={{
                          textTransform: 'none',
                          backgroundColor: '#2563eb',
                          '&:hover': {
                            backgroundColor: '#1d4ed8',
                          },
                        }}
                      >
                        Save Owner
                      </Button>

                      {newOwnerData && (
                        <Box
                          sx={{
                            padding: 2,
                            backgroundColor: '#d1fae5',
                            border: '1px solid #10b981',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '14px',
                              color: '#065f46',
                              fontWeight: 500,
                            }}
                          >
                            ✓ Owner "{newOwnerData.firstName}{' '}
                            {newOwnerData.lastName}" will be created with this
                            pet
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Paper>
                )}

                {/* Name and Last Name */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                  }}
                >
                  <form.Field
                    name="name"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? 'Name is required' : undefined,
                    }}
                  >
                    {(field) => (
                      <TextField
                        label="Name"
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        error={!!field.state.meta.errors.length}
                        helperText={field.state.meta.errors[0]}
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#2563eb',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#2563eb',
                            },
                          },
                        }}
                      />
                    )}
                  </form.Field>
                  <form.Field
                    name="lastName"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? 'Last name is required' : undefined,
                    }}
                  >
                    {(field) => (
                      <TextField
                        label="Last Name"
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        error={!!field.state.meta.errors.length}
                        helperText={field.state.meta.errors[0]}
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#2563eb',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#2563eb',
                            },
                          },
                        }}
                      />
                    )}
                  </form.Field>
                </Box>

                {/* Type and Breed */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                  }}
                >
                  <form.Field
                    name="type"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? 'Type is required' : undefined,
                    }}
                  >
                    {(field) => (
                      <FormControl
                        fullWidth
                        required
                        error={!!field.state.meta.errors.length}
                      >
                        <InputLabel>Type</InputLabel>
                        <Select
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          label="Type"
                          sx={{
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#2563eb',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#2563eb',
                            },
                          }}
                        >
                          <MenuItem value="Dog">Dog</MenuItem>
                          <MenuItem value="Cat">Cat</MenuItem>
                          <MenuItem value="Bird">Bird</MenuItem>
                          <MenuItem value="Rabbit">Rabbit</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </form.Field>
                  <form.Field
                    name="breed"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? 'Breed is required' : undefined,
                    }}
                  >
                    {(field) => (
                      <TextField
                        label="Breed"
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        error={!!field.state.meta.errors.length}
                        helperText={field.state.meta.errors[0]}
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#2563eb',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#2563eb',
                            },
                          },
                        }}
                      />
                    )}
                  </form.Field>
                </Box>

                {/* Gender and Birth Date */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                  }}
                >
                  <form.Field name="gender">
                    {(field) => (
                      <FormControl fullWidth>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          label="Gender"
                          sx={{
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#2563eb',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#2563eb',
                            },
                          }}
                        >
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                          <MenuItem value="Unknown">Unknown</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </form.Field>
                  <form.Field name="birthDateUnknown">
                    {(birthDateUnknownField) => (
                      <form.Field name="birthDate">
                        {(birthDateField) => (
                          <Box>
                            <TextField
                              label="Birth Date"
                              type="date"
                              value={birthDateField.state.value}
                              onChange={(e) =>
                                birthDateField.handleChange(e.target.value)
                              }
                              onBlur={birthDateField.handleBlur}
                              fullWidth
                              disabled={birthDateUnknownField.state.value}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{
                                marginBottom: 1,
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: '#2563eb',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#2563eb',
                                  },
                                  '&.Mui-disabled': {
                                    backgroundColor: '#f6f8fa',
                                  },
                                },
                              }}
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={birthDateUnknownField.state.value}
                                  onChange={(e) => {
                                    birthDateUnknownField.handleChange(
                                      e.target.checked
                                    );
                                    if (e.target.checked) {
                                      birthDateField.handleChange('');
                                    }
                                  }}
                                  sx={{
                                    color: '#2563eb',
                                    '&.Mui-checked': {
                                      color: '#2563eb',
                                    },
                                  }}
                                />
                              }
                              label="Date unknown"
                              sx={{
                                '& .MuiFormControlLabel-label': {
                                  fontSize: '14px',
                                  color: '#57606a',
                                },
                              }}
                            />
                          </Box>
                        )}
                      </form.Field>
                    )}
                  </form.Field>
                </Box>

                {/* Color and Microchip */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                  }}
                >
                  <form.Field name="color">
                    {(field) => (
                      <TextField
                        label="Color"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#2563eb',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#2563eb',
                            },
                          },
                        }}
                      />
                    )}
                  </form.Field>
                  <form.Field name="microchip">
                    {(field) => (
                      <TextField
                        label="Microchip Number"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#2563eb',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#2563eb',
                            },
                          },
                        }}
                      />
                    )}
                  </form.Field>
                </Box>

                {/* Notes */}
                <form.Field name="notes">
                  {(field) => (
                    <TextField
                      label="Notes"
                      multiline
                      rows={4}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      fullWidth
                      placeholder="Additional notes about the pet..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#2563eb',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#2563eb',
                          },
                        },
                      }}
                    />
                  )}
                </form.Field>

                {/* Buttons */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    marginTop: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    sx={{
                      textTransform: 'none',
                      borderColor: '#d0d7de',
                      color: '#24292f',
                      '&:hover': {
                        borderColor: '#57606a',
                        backgroundColor: '#f6f8fa',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      textTransform: 'none',
                      backgroundColor: '#10b981',
                      '&:hover': {
                        backgroundColor: '#059669',
                      },
                    }}
                  >
                    Create Pet
                  </Button>
                </Box>
              </Box>
            </form>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
