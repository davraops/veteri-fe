import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { mockPets } from '@/data/mockPets';
import { useState } from 'react';
import React from 'react';
import {
  Box,
  Divider,
  Menu,
  MenuItem,
  Typography,
  Button,
  Link as MuiLink,
  Avatar,
  InputBase,
  IconButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import {
  Add as AddIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Check as CheckIcon,
  Settings as SettingsIcon,
  AttachFile as AttachFileIcon,
  Image as ImageIcon,
  UploadFile as UploadFileIcon,
  Send as SendIcon,
  Lock as LockIcon,
  Search as SearchIcon,
  Pets as PetsIcon,
} from '@mui/icons-material';

export const Route = createFileRoute('/')({
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [currentDashboard, setCurrentDashboard] = useState('personal');
  const [petSearchValue, setPetSearchValue] = useState('');
  const [attachMenuAnchor, setAttachMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [modelMenuAnchor, setModelMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [selectedModel, setSelectedModel] = useState('veterai-3.1');
  const [queryValue, setQueryValue] = useState('');

  // Mock feed posts
  const feedPosts = [
    {
      id: 1,
      user: 'Dr. Jane Doe',
      userInitials: 'JD',
      action: 'started treatment',
      pet: 'Rocky',
      petType: 'Dog',
      petBreed: 'German Shepherd',
      diagnosis: 'Flea allergy dermatitis',
      details:
        'Prescribed prednisone 0.5mg/kg BID for 7 days, then taper. Topical miconazole cream applied to affected areas. Owner advised to use monthly flea prevention (NexGard) and environmental treatment. Recheck in 2 weeks.',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      user: 'Dr. Sarah Martinez',
      userInitials: 'SM',
      action: 'completed consultation',
      pet: 'Luna',
      petType: 'Cat',
      petBreed: 'Persian',
      diagnosis: 'Urinary tract infection',
      details:
        'Urinalysis showed pyuria, bacteriuria, and hematuria. Culture pending. Started amoxicillin-clavulanate 12.5mg/kg BID for 14 days. Increased water intake recommended. Monitor for signs of obstruction.',
      timestamp: '4 hours ago',
    },
    {
      id: 3,
      user: 'Dr. John Doe',
      userInitials: 'JD',
      action: 'started treatment',
      pet: 'Max',
      petType: 'Dog',
      petBreed: 'Golden Retriever',
      diagnosis: 'Hip osteoarthritis',
      details:
        'Radiographs confirm bilateral hip dysplasia with moderate OA. Prescribed carprofen 2.2mg/kg BID with food, glucosamine/chondroitin supplement daily. Weight management plan initiated (target: 5kg reduction). Physical therapy exercises demonstrated.',
      timestamp: '6 hours ago',
    },
    {
      id: 4,
      user: 'Dr. Michael Chen',
      userInitials: 'MC',
      action: 'added notes',
      pet: 'Bella',
      petType: 'Dog',
      petBreed: 'Labrador',
      diagnosis: 'Annual vaccination check',
      details:
        'DHPP, Rabies, and Bordetella boosters administered. Physical exam unremarkable. Heartworm test negative. Weight: 28.5kg (ideal). Dental cleaning recommended within 6 months. Next visit: 1 year.',
      timestamp: '1 day ago',
    },
    {
      id: 5,
      user: 'Dr. Emily Rodriguez',
      userInitials: 'ER',
      action: 'started treatment',
      pet: 'Charlie',
      petType: 'Dog',
      petBreed: 'Beagle',
      diagnosis: 'Bilateral external otitis',
      details:
        'Otoscopic exam revealed erythema, cerumen, and mild malodor bilaterally. Cytology shows mixed bacteria and yeast. Prescribed Otomax drops 5 drops BID in each ear for 10 days. Ear cleaning with Epi-Otic prior to medication. Recheck in 2 weeks.',
      timestamp: '2 days ago',
    },
    {
      id: 6,
      user: 'Dr. Robert Wilson',
      userInitials: 'RW',
      action: 'treatment ending soon',
      pet: 'Milo',
      petType: 'Cat',
      petBreed: 'Siamese',
      diagnosis: 'Upper respiratory infection',
      details:
        'Treatment with doxycycline 5mg/kg BID will complete in 2 days. Please monitor for any remaining nasal discharge or respiratory signs. Schedule a follow-up appointment to ensure complete resolution and discuss any concerns.',
      timestamp: '3 days ago',
    },
    {
      id: 7,
      user: 'Dr. Lisa Anderson',
      userInitials: 'LA',
      action: 'treatment ending soon',
      pet: 'Daisy',
      petType: 'Dog',
      petBreed: 'Bulldog',
      diagnosis: 'Skin infection (pyoderma)',
      details:
        'Cephalexin course (22mg/kg BID) has 3 days remaining. Continue monitoring skin lesions for improvement. If any areas still show redness or discharge, please contact us for a recheck. Follow-up recommended to confirm complete healing.',
      timestamp: '5 days ago',
    },
    {
      id: 8,
      user: 'Dr. James Thompson',
      userInitials: 'JT',
      action: 'follow-up recommended',
      pet: 'Simba',
      petType: 'Cat',
      petBreed: 'Maine Coon',
      diagnosis: 'Feline lower urinary tract disease (FLUTD)',
      details:
        'Treatment with prescription diet and amitriptyline is progressing well. One week remaining. Please observe urination patterns and behavior. Schedule a follow-up visit to assess response and adjust treatment if needed.',
      timestamp: '1 week ago',
    },
    {
      id: 9,
      user: 'Dr. Maria Garcia',
      userInitials: 'MG',
      action: 'follow-up recommended',
      pet: 'Oreo',
      petType: 'Cat',
      petBreed: 'British Shorthair',
      diagnosis: 'Dental cleaning and extraction',
      details:
        'Post-operative recovery looks good. Antibiotic course (clindamycin 11mg/kg BID) has 2 days remaining. Continue monitoring eating habits and oral comfort. Follow-up appointment recommended in 1 week to check healing and discuss long-term dental care.',
      timestamp: '1 week ago',
    },
  ];

  // Use shared mock pets data
  const pets = mockPets;

  const filteredPets = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(petSearchValue.toLowerCase()) ||
      pet.breed.toLowerCase().includes(petSearchValue.toLowerCase())
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleDashboardSelect = (dashboard: string) => {
    setCurrentDashboard(dashboard);
    handleUserMenuClose();
  };

  const handleAttachMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAttachMenuAnchor(event.currentTarget);
  };

  const handleAttachMenuClose = () => {
    setAttachMenuAnchor(null);
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar pageTitle="Dashboard" onToggleSidebar={toggleSidebar} />
      <Sidebar open={sidebarOpen} onClose={toggleSidebar} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#f6f8fa',
          paddingTop: 0,
          paddingLeft: 0,
          paddingRight: 3,
          paddingBottom: 3,
          display: 'flex',
          gap: 3,
        }}
      >
        {/* Left Panel - User Info */}
        <Box
          sx={{
            width: 280,
            backgroundColor: '#ffffff',
            border: '1px solid #d0d7de',
            borderTop: 'none',
            borderLeft: 'none',
            borderRadius: 0,
            padding: 3,
            height: '100%',
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: '#2563eb',
              }}
              src="/api/placeholder/32/32"
              alt="johndoe"
            >
              JD
            </Avatar>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
              onClick={handleUserMenuOpen}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: '#24292f' }}
              >
                johndoe
              </Typography>
              <ArrowDropDownIcon sx={{ color: '#57606a', fontSize: '20px' }} />
            </Box>
          </Box>
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
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
                Go to organization dashboard
              </Typography>
            </Box>
            <MenuItem
              onClick={() => handleDashboardSelect('personal')}
              selected={currentDashboard === 'personal'}
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
                  gap: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: '#2563eb',
                      fontSize: '12px',
                    }}
                    src="/api/placeholder/24/24"
                    alt="johndoe"
                  >
                    JD
                  </Avatar>
                  <Typography sx={{ fontSize: '14px' }}>johndoe</Typography>
                </Box>
                {currentDashboard === 'personal' && (
                  <CheckIcon sx={{ fontSize: '18px', color: '#2563eb' }} />
                )}
              </Box>
            </MenuItem>
            <MenuItem
              onClick={() => handleDashboardSelect('mr-pet')}
              selected={currentDashboard === 'mr-pet'}
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
                  gap: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: '#10b981',
                      fontSize: '12px',
                    }}
                    src="/api/placeholder/24/24"
                    alt="mr-pet"
                  >
                    MP
                  </Avatar>
                  <Typography sx={{ fontSize: '14px' }}>mr-pet</Typography>
                </Box>
                {currentDashboard === 'mr-pet' && (
                  <CheckIcon sx={{ fontSize: '18px', color: '#2563eb' }} />
                )}
              </Box>
            </MenuItem>
            <MenuItem
              onClick={() => handleDashboardSelect('vete-amigos')}
              selected={currentDashboard === 'vete-amigos'}
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
                  gap: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: '#f97316',
                      fontSize: '12px',
                    }}
                    src="/api/placeholder/24/24"
                    alt="vete-amigos"
                  >
                    VA
                  </Avatar>
                  <Typography sx={{ fontSize: '14px' }}>vete-amigos</Typography>
                </Box>
                {currentDashboard === 'vete-amigos' && (
                  <CheckIcon sx={{ fontSize: '18px', color: '#2563eb' }} />
                )}
              </Box>
            </MenuItem>
            <Divider />
            <Box sx={{ padding: '8px' }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<SettingsIcon />}
                onClick={() => {
                  handleUserMenuClose();
                  // TODO: Navigate to manage organizations
                }}
                sx={{
                  fontSize: '14px',
                  textTransform: 'none',
                  borderColor: '#d0d7de',
                  color: '#24292f',
                  mb: 1,
                  '&:hover': {
                    borderColor: '#2563eb',
                    backgroundColor: '#f6f8fa',
                  },
                }}
              >
                Manage organizations
              </Button>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  handleUserMenuClose();
                  // TODO: Navigate to create organization
                }}
                sx={{
                  fontSize: '14px',
                  textTransform: 'none',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#059669',
                  },
                }}
              >
                Create organization
              </Button>
            </Box>
          </Menu>

          {/* Top Pets Section */}
          <Box
            sx={{
              mt: 4,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: '#24292f', fontSize: '16px' }}
              >
                Top Pets
              </Typography>
              <Button
                size="small"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  navigate({ to: '/pets/new' });
                }}
                sx={{
                  fontSize: '12px',
                  textTransform: 'none',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  padding: '4px 12px',
                  minWidth: 'auto',
                  '&:hover': {
                    backgroundColor: '#059669',
                  },
                }}
              >
                New
              </Button>
            </Box>

            {/* Pet Search Bar */}
            <Box
              sx={{
                position: 'relative',
                borderRadius: '6px',
                backgroundColor: '#f6f8fa',
                border: '1px solid #d0d7de',
                marginBottom: 2,
                display: 'flex',
                alignItems: 'center',
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
                }}
              >
                <SearchIcon fontSize="small" />
              </Box>
              <InputBase
                placeholder="Find a pet..."
                value={petSearchValue}
                onChange={(e) => setPetSearchValue(e.target.value)}
                sx={{
                  color: '#24292f',
                  padding: '6px 8px 6px 32px',
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

            {/* Pets List */}
            <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
              {filteredPets.slice(0, 5).map((pet) => (
                <Box
                  key={pet.id}
                  onClick={() => {
                    navigate({
                      to: '/pets/$petId',
                      params: { petId: String(pet.id) },
                      search: {},
                    });
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    padding: '8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    mb: 0.5,
                    '&:hover': {
                      backgroundColor: '#f6f8fa',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor:
                        pet.organization === 'johndoe'
                          ? '#2563eb'
                          : pet.organization === 'mr-pet'
                            ? '#10b981'
                            : '#f97316',
                      fontSize: '10px',
                    }}
                    src={
                      pet.organization === 'johndoe'
                        ? '/api/placeholder/20/20'
                        : pet.organization === 'mr-pet'
                          ? '/api/placeholder/20/20'
                          : '/api/placeholder/20/20'
                    }
                  >
                    {pet.organization === 'johndoe'
                      ? 'JD'
                      : pet.organization === 'mr-pet'
                        ? 'MP'
                        : 'VA'}
                  </Avatar>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#24292f',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {pet.name} {pet.lastName}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: '#57606a',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {pet.type} - {pet.breed}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '11px',
                        color: '#57606a',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        mt: 0.25,
                      }}
                    >
                      {pet.assignedTo}
                    </Typography>
                  </Box>
                </Box>
              ))}
              {filteredPets.length > 5 && (
                <Box sx={{ padding: '8px', textAlign: 'center' }}>
                  <Button
                    size="small"
                    onClick={() => navigate({ to: '/pets' })}
                    sx={{
                      fontSize: '12px',
                      textTransform: 'none',
                      color: '#2563eb',
                      '&:hover': {
                        backgroundColor: '#f6f8fa',
                      },
                    }}
                  >
                    View more ({filteredPets.length - 5} more)
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Right Panel - Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            padding: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, color: '#24292f', mb: 3 }}
          >
            Home
          </Typography>
          <Box
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
              placeholder="Ask Anything"
              fullWidth
              value={queryValue}
              onChange={(e) => setQueryValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && queryValue.trim()) {
                  navigate({
                    to: '/consultant',
                    search: {
                      query: queryValue.trim(),
                      conversationId: undefined,
                    },
                  });
                }
              }}
              sx={{
                color: '#24292f',
                padding: '16px 20px',
                fontSize: '16px',
                '& .MuiInputBase-input': {
                  '&::placeholder': {
                    color: '#57606a',
                    opacity: 1,
                  },
                },
              }}
            />
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
                  onClick={handleAttachMenuOpen}
                  size="small"
                  sx={{
                    color: '#57606a',
                    '&:hover': {
                      backgroundColor: '#f6f8fa',
                      color: '#2563eb',
                    },
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
                <Typography
                  onClick={handleAttachMenuOpen}
                  sx={{
                    fontSize: '14px',
                    color: '#57606a',
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#2563eb',
                    },
                  }}
                >
                  Add pets, docs or images
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                      Modelos
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
                        gap: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: '14px' }}>GPT 4.5</Typography>
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
                    disabled
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: '#f6f8fa',
                      },
                      '&.Mui-disabled': {
                        opacity: 0.6,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Typography sx={{ fontSize: '14px' }}>
                          GPT 5 (Plus)
                        </Typography>
                        <LockIcon sx={{ fontSize: '16px', color: '#dc2626' }} />
                      </Box>
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
                        gap: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: '14px' }}>Grok 3</Typography>
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
                    disabled
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: '#f6f8fa',
                      },
                      '&.Mui-disabled': {
                        opacity: 0.6,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Typography sx={{ fontSize: '14px' }}>
                          Grok 4 (Plus)
                        </Typography>
                        <LockIcon sx={{ fontSize: '16px', color: '#dc2626' }} />
                      </Box>
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
                        gap: 1,
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
                  <Divider />
                  <Box
                    sx={{
                      padding: '12px 16px',
                      backgroundColor: '#f6f8fa',
                      borderTop: '1px solid #d0d7de',
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: '#57606a',
                        fontWeight: 500,
                      }}
                    >
                      <Button
                        onClick={() => {
                          // TODO: Handle upgrade
                        }}
                        sx={{
                          textTransform: 'none',
                          fontSize: '12px',
                          color: '#2563eb',
                          fontWeight: 500,
                          padding: 0,
                          minWidth: 'auto',
                          verticalAlign: 'baseline',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Upgrade
                      </Button>{' '}
                      to access more models and limits
                    </Typography>
                  </Box>
                </Menu>
                <IconButton
                  onClick={() => {
                    if (queryValue.trim()) {
                      navigate({
                        to: '/consultant',
                        search: {
                          query: queryValue.trim(),
                          conversationId: undefined,
                        },
                      });
                    }
                  }}
                  disabled={!queryValue.trim()}
                  sx={{
                    color: '#10b981',
                    '&:hover': {
                      color: '#059669',
                      backgroundColor: '#f0fdf4',
                    },
                    '&.Mui-disabled': {
                      color: '#d0d7de',
                    },
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Feed Section */}
          <Box sx={{ marginTop: 4 }}>
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
              Recent Activity
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {feedPosts.map((post) => (
                <Box
                  key={post.id}
                  sx={{
                    padding: 2.5,
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #d0d7de',
                    '&:hover': {
                      backgroundColor: '#f6f8fa',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      marginBottom: 1,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: '#2563eb',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                    >
                      {post.userInitials}
                    </Avatar>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#24292f',
                        lineHeight: 1.6,
                      }}
                    >
                      <MuiLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          // TODO: Navigate to doctor profile
                        }}
                        sx={{
                          fontWeight: 600,
                          color: '#2563eb',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {post.user}
                      </MuiLink>{' '}
                      {post.action} on{' '}
                      <MuiLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          // TODO: Navigate to pet profile
                        }}
                        sx={{
                          fontWeight: 600,
                          color: '#2563eb',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {post.pet}
                      </MuiLink>{' '}
                      ({post.petType} - {post.petBreed}) for the diagnosis of{' '}
                      <MuiLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          // TODO: Navigate to diagnosis details
                        }}
                        sx={{
                          fontWeight: 600,
                          color: '#2563eb',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {post.diagnosis}
                      </MuiLink>
                    </Typography>
                  </Box>
                  {post.details && (
                    <Typography
                      sx={{
                        fontSize: '13px',
                        color: '#57606a',
                        lineHeight: 1.6,
                        fontStyle: 'italic',
                        marginTop: 1,
                        paddingLeft: 2,
                        borderLeft: '2px solid #d0d7de',
                      }}
                    >
                      {post.details}
                    </Typography>
                  )}
                  <Typography
                    sx={{
                      fontSize: '12px',
                      color: '#57606a',
                      marginTop: 1.5,
                    }}
                  >
                    {post.timestamp}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Menu
            anchorEl={attachMenuAnchor}
            open={Boolean(attachMenuAnchor)}
            onClose={handleAttachMenuClose}
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
                minWidth: 220,
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
                Add Content
              </Typography>
            </Box>
            <MenuItem
              onClick={() => {
                handleAttachMenuClose();
                // TODO: Handle add pets
              }}
              sx={{
                '&:hover': {
                  backgroundColor: '#f6f8fa',
                },
              }}
            >
              <ListItemIcon>
                <PetsIcon fontSize="small" sx={{ color: '#57606a' }} />
              </ListItemIcon>
              <ListItemText>
                <Typography sx={{ fontSize: '14px' }}>Pets</Typography>
              </ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleAttachMenuClose();
                // TODO: Handle add files or docs
              }}
              sx={{
                '&:hover': {
                  backgroundColor: '#f6f8fa',
                },
              }}
            >
              <ListItemIcon>
                <AttachFileIcon fontSize="small" sx={{ color: '#57606a' }} />
              </ListItemIcon>
              <ListItemText>
                <Typography sx={{ fontSize: '14px' }}>Files or Docs</Typography>
              </ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleAttachMenuClose();
                // TODO: Handle add images
              }}
              sx={{
                '&:hover': {
                  backgroundColor: '#f6f8fa',
                },
              }}
            >
              <ListItemIcon>
                <ImageIcon fontSize="small" sx={{ color: '#57606a' }} />
              </ListItemIcon>
              <ListItemText>
                <Typography sx={{ fontSize: '14px' }}>Images</Typography>
              </ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                handleAttachMenuClose();
                // TODO: Handle upload from computer
              }}
              sx={{
                '&:hover': {
                  backgroundColor: '#f6f8fa',
                },
              }}
            >
              <ListItemIcon>
                <UploadFileIcon fontSize="small" sx={{ color: '#57606a' }} />
              </ListItemIcon>
              <ListItemText>
                <Typography sx={{ fontSize: '14px' }}>
                  Upload from computer
                </Typography>
              </ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
}
