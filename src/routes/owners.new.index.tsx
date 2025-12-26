import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
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
} from '@mui/material';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';

export const Route = createFileRoute('/owners/new/')({
  component: NewOwner,
});

interface OwnerFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phones: string[]; // Array of phone numbers (up to 3)
  nationalId: string;
  nationality: string;
  address: string;
  city: string;
  organization: string;
}

function NewOwner() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phones: [''],
      nationalId: '',
      nationality: '',
      address: '',
      city: '',
      organization: '',
    } as OwnerFormValues,
    onSubmit: async ({ value }) => {
      // Navigate to verification page with form data
      navigate({
        to: '/owners/new/verify',
        search: {
          firstName: value.firstName,
          lastName: value.lastName,
          email: value.email,
          phones: value.phones.filter((phone) => phone.trim() !== ''), // Filter out empty phones
          nationalId: value.nationalId,
          nationality: value.nationality,
          address: value.address,
          city: value.city,
          organization: value.organization,
        },
      });
    },
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCancel = () => {
    navigate({ to: '/owners' });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar pageTitle="New Owner" onToggleSidebar={toggleSidebar} />
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
            Create New Owner
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
                        onChange={(e) => field.handleChange(e.target.value)}
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

                {/* First Name and Last Name */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                  }}
                >
                  <form.Field
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

                {/* Email */}
                <form.Field
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
                </form.Field>

                {/* Phones (up to 3) */}
                <form.Field name="phones">
                  {(field) => (
                    <Box
                      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
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
                          {field.state.value.slice(1).map((phone, index) => (
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
                                  const newPhones = [...field.state.value];
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
                                  const newPhones = field.state.value.filter(
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
                              const newPhones = [...field.state.value, ''];
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
                </form.Field>

                {/* National ID and Nationality */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                  }}
                >
                  <form.Field
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

                {/* Address and City */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                  }}
                >
                  <form.Field name="address">
                    {(field) => (
                      <TextField
                        label="Address"
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
                  <form.Field name="city">
                    {(field) => (
                      <TextField
                        label="City"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
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
                  </form.Field>
                </Box>

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
                    Create Owner
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
