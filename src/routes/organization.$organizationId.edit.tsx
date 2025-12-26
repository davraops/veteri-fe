import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { mockOrganizations } from '@/data/mockOrganizations';

export const Route = createFileRoute('/organization/$organizationId/edit')({
  component: EditOrganization,
});

interface OrganizationFormValues {
  name: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
}

function EditOrganization() {
  const { organizationId } = Route.useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Convert organizationId from URL param (string) to number
  const orgIdNum = parseInt(organizationId, 10);
  const organization = !isNaN(orgIdNum)
    ? mockOrganizations.find((org) => org.organizationId === orgIdNum)
    : null;

  const form = useForm({
    defaultValues: {
      name: organization?.name || '',
      description: organization?.description || '',
      address: organization?.address || '',
      city: organization?.city || '',
      phone: organization?.phone || '',
      email: organization?.email || '',
      website: organization?.website || '',
    } as OrganizationFormValues,
    onSubmit: async ({ value }) => {
      // TODO: Submit to API
      console.log('Updating organization with data:', value);
      // Navigate back to organization profile
      navigate({
        to: '/organization/$organizationId',
        params: { organizationId: String(organizationId) },
      });
    },
  });

  const handleCancel = () => {
    navigate({
      to: '/organization/$organizationId',
      params: { organizationId: String(organizationId) },
    });
  };

  if (!organization) {
    return (
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <Topbar
          pageTitle="Organization Not Found"
          onToggleSidebar={toggleSidebar}
        />
        <Sidebar open={sidebarOpen} onClose={toggleSidebar} />
        <Box sx={{ flexGrow: 1, padding: 3, textAlign: 'center' }}>
          <Typography variant="h5">Organization not found</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar pageTitle="Edit Organization" onToggleSidebar={toggleSidebar} />
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
            Edit Organization
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
                {/* Name */}
                <form.Field
                  name="name"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? 'Name is required' : undefined,
                  }}
                >
                  {(field) => (
                    <TextField
                      label="Organization Name"
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

                {/* Description */}
                <form.Field name="description">
                  {(field) => (
                    <TextField
                      label="Description"
                      multiline
                      rows={4}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      fullWidth
                      placeholder="A brief description of your organization..."
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
                      <Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            marginBottom: 1,
                          }}
                        >
                          <LocationIcon
                            sx={{ color: '#57606a', fontSize: '18px' }}
                          />
                          <Typography
                            sx={{
                              fontSize: '14px',
                              fontWeight: 500,
                              color: '#24292f',
                            }}
                          >
                            Address
                          </Typography>
                        </Box>
                        <TextField
                          label="Street Address"
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
                      </Box>
                    )}
                  </form.Field>
                  <form.Field name="city">
                    {(field) => (
                      <Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            marginBottom: 1,
                          }}
                        >
                          <LocationIcon
                            sx={{ color: '#57606a', fontSize: '18px' }}
                          />
                          <Typography
                            sx={{
                              fontSize: '14px',
                              fontWeight: 500,
                              color: '#24292f',
                            }}
                          >
                            City
                          </Typography>
                        </Box>
                        <TextField
                          label="City, State ZIP"
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
                      </Box>
                    )}
                  </form.Field>
                </Box>

                {/* Phone and Email */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                  }}
                >
                  <form.Field
                    name="phone"
                    validators={{
                      onChange: ({ value }) => {
                        if (value && !/^\+?[\d\s\-()]+$/.test(value)) {
                          return 'Invalid phone number format';
                        }
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            marginBottom: 1,
                          }}
                        >
                          <PhoneIcon
                            sx={{ color: '#57606a', fontSize: '18px' }}
                          />
                          <Typography
                            sx={{
                              fontSize: '14px',
                              fontWeight: 500,
                              color: '#24292f',
                            }}
                          >
                            Phone
                          </Typography>
                        </Box>
                        <TextField
                          label="Phone Number"
                          type="tel"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          error={!!field.state.meta.errors.length}
                          helperText={field.state.meta.errors[0]}
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
                      </Box>
                    )}
                  </form.Field>
                  <form.Field
                    name="email"
                    validators={{
                      onChange: ({ value }) => {
                        if (
                          value &&
                          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                        ) {
                          return 'Invalid email format';
                        }
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            marginBottom: 1,
                          }}
                        >
                          <EmailIcon
                            sx={{ color: '#57606a', fontSize: '18px' }}
                          />
                          <Typography
                            sx={{
                              fontSize: '14px',
                              fontWeight: 500,
                              color: '#24292f',
                            }}
                          >
                            Email
                          </Typography>
                        </Box>
                        <TextField
                          label="Email Address"
                          type="email"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          error={!!field.state.meta.errors.length}
                          helperText={field.state.meta.errors[0]}
                          fullWidth
                          placeholder="contact@organization.com"
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
                      </Box>
                    )}
                  </form.Field>
                </Box>

                {/* Website */}
                <form.Field
                  name="website"
                  validators={{
                    onChange: ({ value }) => {
                      if (
                        value &&
                        !/^https?:\/\/.+\..+/.test(value) &&
                        !/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(
                          value
                        )
                      ) {
                        return 'Invalid website URL';
                      }
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          marginBottom: 1,
                        }}
                      >
                        <LanguageIcon
                          sx={{ color: '#57606a', fontSize: '18px' }}
                        />
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#24292f',
                          }}
                        >
                          Website
                        </Typography>
                      </Box>
                      <TextField
                        label="Website"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        error={!!field.state.meta.errors.length}
                        helperText={
                          field.state.meta.errors[0] ||
                          'Enter full URL (https://example.com) or domain (example.com)'
                        }
                        fullWidth
                        placeholder="https://organization.com"
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
                    </Box>
                  )}
                </form.Field>

                {/* Read-only fields for personal organizations */}
                {organization.isPersonal && (
                  <Box
                    sx={{
                      padding: 2,
                      backgroundColor: '#dbeafe',
                      border: '1px solid #93c5fd',
                      borderRadius: '6px',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#1e40af',
                        fontWeight: 500,
                      }}
                    >
                      ℹ️ This is a personal organization. Some settings cannot
                      be changed.
                    </Typography>
                  </Box>
                )}

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
                    Save Changes
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
