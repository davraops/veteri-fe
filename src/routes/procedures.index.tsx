import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { useForm } from '@tanstack/react-form';
import {
  Box,
  Typography,
  InputBase,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Button,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Assignment as ProceduresIcon,
  LocalHospital as HospitalIcon,
} from '@mui/icons-material';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { mockOrganizations } from '@/data/mockOrganizations';
import { mockProcedures, Procedure } from '@/data/mockProcedures';

export const Route = createFileRoute('/procedures/')({
  component: Procedures,
});

interface ProcedureFormValues {
  name: string;
  category: string;
  description: string;
  duration: string;
  preparation: string[];
  steps: string[];
  notes: string;
}

// Note: mockProcedures is imported from @/data/mockProcedures
// All procedure data is now in the shared file

const categories = [
  'All',
  'Examination',
  'Diagnostic',
  'Treatment',
  'Preventive',
  'Dental',
  'Grooming',
  'Surgery',
  'Emergency',
];

const ITEMS_PER_PAGE = 12;

function Procedures() {
  const [searchValue, setSearchValue] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [procedures, setProcedures] = useState<Procedure[]>(mockProcedures);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const currentUser = {
    name: 'Dr. John Doe',
    role: 'Veterinarian',
    organization: 'johndoe',
  };

  const getOrganizationInfo = (orgSlug: string | undefined) => {
    if (!orgSlug) return null;
    return mockOrganizations.find((org) => org.slug === orgSlug);
  };

  const filteredProcedures = useMemo(() => {
    return procedures.filter((proc) => {
      const matchesSearch =
        proc.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        proc.description.toLowerCase().includes(searchValue.toLowerCase()) ||
        proc.category.toLowerCase().includes(searchValue.toLowerCase());

      const matchesCategory =
        categoryFilter === 'All' || proc.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [procedures, searchValue, categoryFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProcedures.length / ITEMS_PER_PAGE)
  );

  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProcedures = filteredProcedures.slice(startIndex, endIndex);

  const procedureForm = useForm({
    defaultValues: {
      name: '',
      category: '',
      description: '',
      duration: '',
      preparation: [],
      steps: [],
      notes: '',
    } as ProcedureFormValues,
    onSubmit: async ({ value }) => {
      const newProcedure: Procedure = {
        id: String(procedures.length + 1),
        ...value,
        addedBy: {
          name: currentUser.name,
          role: currentUser.role,
        },
        organization: currentUser.organization,
      };
      setProcedures([...procedures, newProcedure]);
      setOpenAddDialog(false);
      procedureForm.reset();
    },
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar pageTitle="Procedures" onToggleSidebar={toggleSidebar} />
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
              marginBottom: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: '#24292f', marginBottom: 1 }}
              >
                Veterinary Procedures
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: '#57606a', fontSize: '16px' }}
              >
                Reference guide for common veterinary procedures, steps, and
                protocols
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddDialog(true)}
              sx={{
                backgroundColor: '#2563eb',
                '&:hover': {
                  backgroundColor: '#1d4ed8',
                },
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Add Procedure
            </Button>
          </Box>

          {/* Filters */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              marginBottom: 3,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            {/* Category Filter */}
            <FormControl
              sx={{
                minWidth: { xs: '100%', sm: 200 },
              }}
            >
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => handleCategoryChange(e.target.value)}
                label="Category"
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
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Search Bar */}
            <Box
              sx={{
                position: 'relative',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                border: '1px solid #d0d7de',
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                '&:hover': {
                  borderColor: '#2563eb',
                },
                '&:focus-within': {
                  borderColor: '#2563eb',
                  boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
                },
              }}
            >
              <Box
                sx={{
                  padding: '0 12px',
                  height: '100%',
                  position: 'absolute',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#57606a',
                }}
              >
                <SearchIcon />
              </Box>
              <InputBase
                placeholder="Search procedures..."
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                sx={{
                  color: '#24292f',
                  padding: '10px 12px 10px 48px',
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
            </Box>
          </Box>

          {/* Procedures Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
              marginBottom: 4,
            }}
          >
            {paginatedProcedures.map((procedure) => (
              <Card
                key={procedure.id}
                sx={{
                  cursor: 'pointer',
                  border: '1px solid #d0d7de',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: '#2563eb',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                  },
                }}
                onClick={() => setSelectedProcedure(procedure)}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      marginBottom: 2,
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: '#eff6ff',
                        borderRadius: '8px',
                        padding: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ProceduresIcon sx={{ color: '#2563eb', fontSize: 28 }} />
                    </Box>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: '#24292f',
                          marginBottom: 0.5,
                          fontSize: '18px',
                        }}
                      >
                        {procedure.name}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 1,
                          flexWrap: 'wrap',
                          marginTop: 0.5,
                        }}
                      >
                        <Chip
                          label={procedure.category}
                          size="small"
                          sx={{
                            backgroundColor: '#f0f9ff',
                            color: '#0284c7',
                            fontSize: '12px',
                            height: 24,
                          }}
                        />
                        {procedure.addedBy && (
                          <Chip
                            label={`Added by ${procedure.addedBy.name}`}
                            size="small"
                            sx={{
                              backgroundColor: '#fef3c7',
                              color: '#92400e',
                              fontWeight: 500,
                              fontSize: '10px',
                              height: 24,
                              border: '1px solid #fbbf24',
                            }}
                          />
                        )}
                        {procedure.organization &&
                          (() => {
                            const org = getOrganizationInfo(
                              procedure.organization
                            );
                            if (!org) return null;
                            return (
                              <Chip
                                label={org.name}
                                size="small"
                                sx={{
                                  backgroundColor: `${org.color}15`,
                                  color: org.color,
                                  fontWeight: 500,
                                  fontSize: '10px',
                                  height: 24,
                                  border: `1px solid ${org.color}`,
                                }}
                              />
                            );
                          })()}
                      </Box>
                    </Box>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: '#57606a',
                      marginBottom: 2,
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {procedure.description}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      fontSize: '13px',
                      color: '#57606a',
                    }}
                  >
                    <HospitalIcon sx={{ fontSize: 16 }} />
                    <Typography sx={{ fontSize: '13px' }}>
                      {procedure.duration}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 4,
              }}
            >
              <Pagination
                count={totalPages}
                page={validCurrentPage}
                onChange={(_, page) => setCurrentPage(page)}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#24292f',
                    '&.Mui-selected': {
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                    },
                  },
                }}
              />
            </Box>
          )}

          {/* Results Count */}
          <Box
            sx={{
              textAlign: 'center',
              marginTop: 3,
              color: '#57606a',
              fontSize: '14px',
            }}
          >
            Showing {paginatedProcedures.length} of {filteredProcedures.length}{' '}
            procedures
          </Box>
        </Box>
      </Box>

      {/* Procedure Detail Dialog */}
      {selectedProcedure && (
        <Dialog
          open={!!selectedProcedure}
          onClose={() => setSelectedProcedure(null)}
          maxWidth="md"
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
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: '#24292f' }}
              >
                {selectedProcedure.name}
              </Typography>
              <Chip
                label={selectedProcedure.category}
                size="small"
                sx={{
                  marginTop: 1,
                  backgroundColor: '#f0f9ff',
                  color: '#0284c7',
                }}
              />
            </Box>
            <IconButton
              onClick={() => setSelectedProcedure(null)}
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
                sx={{ fontSize: '14px', color: '#57606a', lineHeight: 1.6 }}
              >
                {selectedProcedure.description}
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
                {selectedProcedure.duration}
              </Typography>
            </Box>

            {selectedProcedure.preparation &&
              selectedProcedure.preparation.length > 0 && (
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
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedProcedure.preparation.map((item, index) => (
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

            {selectedProcedure.steps && selectedProcedure.steps.length > 0 && (
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
                <Box component="ol" sx={{ paddingLeft: 3, margin: 0 }}>
                  {selectedProcedure.steps.map((step, index) => (
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

            {selectedProcedure.notes && (
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
                  sx={{ fontSize: '14px', color: '#57606a', lineHeight: 1.6 }}
                >
                  {selectedProcedure.notes}
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
              onClick={() => setSelectedProcedure(null)}
              sx={{
                textTransform: 'none',
                color: '#24292f',
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Add Procedure Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={() => {
          setOpenAddDialog(false);
          procedureForm.reset();
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '8px',
          },
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            procedureForm.handleSubmit();
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
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#24292f' }}>
              Add New Procedure
            </Typography>
            <IconButton
              onClick={() => {
                setOpenAddDialog(false);
                procedureForm.reset();
              }}
              sx={{ color: '#57606a' }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ paddingTop: 3 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                marginTop: 2,
              }}
            >
              <procedureForm.Field
                name="name"
                validators={{
                  onChange: ({ value }) =>
                    !value ? 'Name is required' : undefined,
                }}
              >
                {(field) => (
                  <TextField
                    label="Procedure Name *"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={!!field.state.meta.errors.length}
                    helperText={field.state.meta.errors[0]}
                    fullWidth
                  />
                )}
              </procedureForm.Field>

              <procedureForm.Field
                name="category"
                validators={{
                  onChange: ({ value }) =>
                    !value ? 'Category is required' : undefined,
                }}
              >
                {(field) => (
                  <FormControl fullWidth>
                    <InputLabel>Category *</InputLabel>
                    <Select
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      label="Category *"
                    >
                      {categories
                        .filter((cat) => cat !== 'All')
                        .map((cat) => (
                          <MenuItem key={cat} value={cat}>
                            {cat}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}
              </procedureForm.Field>

              <procedureForm.Field
                name="description"
                validators={{
                  onChange: ({ value }) =>
                    !value ? 'Description is required' : undefined,
                }}
              >
                {(field) => (
                  <TextField
                    label="Description *"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={!!field.state.meta.errors.length}
                    helperText={field.state.meta.errors[0]}
                    fullWidth
                    multiline
                    rows={3}
                  />
                )}
              </procedureForm.Field>

              <procedureForm.Field name="duration">
                {(field) => (
                  <TextField
                    label="Duration"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    fullWidth
                    placeholder="e.g., 15-30 minutes"
                  />
                )}
              </procedureForm.Field>

              <procedureForm.Field name="notes">
                {(field) => (
                  <TextField
                    label="Notes"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Additional notes or important considerations"
                  />
                )}
              </procedureForm.Field>
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              borderTop: '1px solid #d0d7de',
              padding: 2,
            }}
          >
            <Button
              onClick={() => {
                setOpenAddDialog(false);
                procedureForm.reset();
              }}
              sx={{
                textTransform: 'none',
                color: '#24292f',
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={procedureForm.state.isSubmitting}
              sx={{
                textTransform: 'none',
                backgroundColor: '#2563eb',
                '&:hover': {
                  backgroundColor: '#1d4ed8',
                },
              }}
            >
              {procedureForm.state.isSubmitting ? 'Adding...' : 'Add Procedure'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
