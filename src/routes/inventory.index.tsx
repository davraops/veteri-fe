import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  InputBase,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Alert,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Inventory2 as InventoryIcon,
  Warning as WarningIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { mockInventory } from '@/data/mockInventory';
import { mockOrganizations } from '@/data/mockOrganizations';

export const Route = createFileRoute('/inventory/')({
  component: Inventory,
});

// Current user ID (in a real app, this would come from auth context)
const currentUserId = 'johndoe';

function Inventory() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Map organization slug to data organization identifier
  const getDataOrgId = (orgSlug: string) => {
    if (orgSlug === 'johndoe-org') return 'johndoe';
    return orgSlug;
  };

  // Get organizations where current user is a member
  const userOrganizations = useMemo(
    () =>
      mockOrganizations
        .filter((org) => {
          const userMember = org.members.find(
            (member) => member.userId === currentUserId
          );
          return userMember !== undefined;
        })
        .map((org) => ({
          ...org,
          dataOrgId: getDataOrgId(org.slug),
        })),
    []
  );

  // Initialize selected organization with default value
  const [selectedOrganization, setSelectedOrganization] = useState<string>(
    userOrganizations.length > 0 ? userOrganizations[0].dataOrgId : ''
  );

  // Get organization color
  const getOrganizationColor = (orgSlug: string) => {
    const org = mockOrganizations.find((o) => {
      const dataOrgId = getDataOrgId(o.slug);
      return dataOrgId === orgSlug;
    });
    return org ? org.color : '#57606a';
  };

  // Filter inventory items
  const filteredItems = useMemo(() => {
    if (!selectedOrganization) return [];

    return mockInventory.filter((item) => {
      // Filter by organization
      if (item.organization !== selectedOrganization) return false;

      // Filter by search
      const matchesSearch =
        searchValue === '' ||
        item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.category.toLowerCase().includes(searchValue.toLowerCase());

      // Filter by category
      const matchesCategory =
        categoryFilter === 'All' || item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [selectedOrganization, searchValue, categoryFilter]);

  // Get categories from filtered items
  const categories = useMemo(() => {
    if (!selectedOrganization) return [];
    const orgItems = mockInventory.filter(
      (item) => item.organization === selectedOrganization
    );
    const cats = Array.from(new Set(orgItems.map((item) => item.category)));
    return ['All', ...cats.sort()];
  }, [selectedOrganization]);

  // Get low stock items (quantity <= minStock)
  const lowStockItems = useMemo(() => {
    return filteredItems.filter((item) => item.quantity <= item.minStock);
  }, [filteredItems]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!selectedOrganization) {
      return {
        totalItems: 0,
        totalValue: 0,
        lowStockCount: 0,
        categoriesCount: 0,
      };
    }

    const orgItems = mockInventory.filter(
      (item) => item.organization === selectedOrganization
    );

    return {
      totalItems: orgItems.length,
      totalValue: orgItems.reduce(
        (sum, item) => sum + item.quantity * item.costPerUnit,
        0
      ),
      lowStockCount: orgItems.filter((item) => item.quantity <= item.minStock)
        .length,
      categoriesCount: new Set(orgItems.map((item) => item.category)).size,
    };
  }, [selectedOrganization]);

  const orgColor = selectedOrganization
    ? getOrganizationColor(selectedOrganization)
    : '#57606a';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar pageTitle="Inventory" onToggleSidebar={toggleSidebar} />
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
            width: '100%',
          }}
        >
          {/* Header */}
          <Box sx={{ marginBottom: 3 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, color: '#24292f', marginBottom: 1 }}
            >
              Inventory Management
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#57606a', fontSize: '16px' }}
            >
              Manage inventory items and track stock levels for your
              organization
            </Typography>
          </Box>

          {/* Organization Selector */}
          {userOrganizations.length > 0 ? (
            <Paper
              sx={{
                padding: 2,
                marginBottom: 3,
                backgroundColor: '#ffffff',
                border: '1px solid #d0d7de',
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Organization</InputLabel>
                <Select
                  value={selectedOrganization}
                  onChange={(e) => {
                    setSelectedOrganization(e.target.value);
                    setSearchValue('');
                    setCategoryFilter('All');
                  }}
                  label="Organization"
                  sx={{
                    backgroundColor: '#ffffff',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: orgColor,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: orgColor,
                    },
                  }}
                >
                  {userOrganizations.map((org) => (
                    <MenuItem key={org.organizationId} value={org.dataOrgId}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: org.color,
                          }}
                        />
                        {org.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>
          ) : (
            <Paper
              sx={{
                padding: 3,
                marginBottom: 3,
                backgroundColor: '#ffffff',
                border: '1px solid #d0d7de',
                textAlign: 'center',
              }}
            >
              <Typography variant="body1" sx={{ color: '#57606a' }}>
                You are not a member of any organization.
              </Typography>
            </Paper>
          )}

          {selectedOrganization && (
            <>
              {/* Statistics Cards */}
              <Grid
                container
                spacing={2}
                sx={{ marginBottom: 3, width: '100%' }}
              >
                <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
                  <Paper
                    sx={{
                      padding: 2,
                      backgroundColor: '#ffffff',
                      border: '1px solid #d0d7de',
                      width: '100%',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: '#57606a', marginBottom: 1 }}
                    >
                      Total Items
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 600, color: '#24292f' }}
                    >
                      {stats.totalItems}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
                  <Paper
                    sx={{
                      padding: 2,
                      backgroundColor: '#ffffff',
                      border: '1px solid #d0d7de',
                      width: '100%',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: '#57606a', marginBottom: 1 }}
                    >
                      Total Value
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 600, color: '#24292f' }}
                    >
                      ${stats.totalValue.toFixed(2)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
                  <Paper
                    sx={{
                      padding: 2,
                      backgroundColor: '#ffffff',
                      border: '1px solid #d0d7de',
                      width: '100%',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: '#57606a', marginBottom: 1 }}
                    >
                      Low Stock Items
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 600,
                        color: stats.lowStockCount > 0 ? '#dc2626' : '#24292f',
                      }}
                    >
                      {stats.lowStockCount}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
                  <Paper
                    sx={{
                      padding: 2,
                      backgroundColor: '#ffffff',
                      border: '1px solid #d0d7de',
                      width: '100%',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: '#57606a', marginBottom: 1 }}
                    >
                      Categories
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 600, color: '#24292f' }}
                    >
                      {stats.categoriesCount}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Low Stock Alert */}
              {lowStockItems.length > 0 && (
                <Alert
                  severity="warning"
                  icon={<WarningIcon />}
                  sx={{ marginBottom: 3 }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {lowStockItems.length} item(s) are running low on stock
                  </Typography>
                </Alert>
              )}

              {/* Filters and Search */}
              <Paper
                sx={{
                  padding: 2,
                  marginBottom: 3,
                  backgroundColor: '#ffffff',
                  border: '1px solid #d0d7de',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'center' },
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
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      label="Category"
                      sx={{
                        backgroundColor: '#ffffff',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: orgColor,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: orgColor,
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
                        borderColor: orgColor,
                      },
                      '&:focus-within': {
                        borderColor: orgColor,
                        boxShadow: `0 0 0 3px ${orgColor}15`,
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
                      placeholder="Search by name, SKU, description, or category..."
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      sx={{
                        color: '#24292f',
                        padding: '12px 12px 12px 48px',
                        width: '100%',
                      }}
                    />
                  </Box>

                  {/* Add Item Button */}
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                      backgroundColor: orgColor,
                      '&:hover': {
                        backgroundColor: orgColor,
                        opacity: 0.9,
                      },
                      minWidth: { xs: '100%', sm: 150 },
                    }}
                  >
                    Add Item
                  </Button>
                </Box>
              </Paper>

              {/* Results Count */}
              <Typography
                variant="body2"
                sx={{ color: '#57606a', marginBottom: 2 }}
              >
                {filteredItems.length} item
                {filteredItems.length !== 1 ? 's' : ''} found
              </Typography>

              {/* Inventory Items List */}
              {filteredItems.length > 0 ? (
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
                >
                  {filteredItems.map((item) => {
                    const isLowStock = item.quantity <= item.minStock;
                    const stockPercentage =
                      item.maxStock && item.maxStock > 0
                        ? (item.quantity / item.maxStock) * 100
                        : 100;

                    return (
                      <Paper
                        key={item.id}
                        sx={{
                          padding: 2.5,
                          border: '1px solid #d0d7de',
                          borderRadius: '8px',
                          backgroundColor: '#ffffff',
                          '&:hover': {
                            borderColor: orgColor,
                            boxShadow: 1,
                          },
                          transition: 'all 0.2s',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 2,
                          }}
                        >
                          {/* Left: Icon and Main Info */}
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              minWidth: 0,
                              flex: 1,
                            }}
                          >
                            <InventoryIcon
                              sx={{
                                color: orgColor,
                                fontSize: '24px',
                                flexShrink: 0,
                              }}
                            />
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1.5,
                                  marginBottom: 0.5,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 600,
                                    color: '#24292f',
                                    fontSize: '16px',
                                  }}
                                >
                                  {item.name}
                                </Typography>
                                <Chip
                                  label={item.category}
                                  size="small"
                                  sx={{
                                    backgroundColor: `${orgColor}15`,
                                    color: orgColor,
                                    fontWeight: 500,
                                    fontSize: '11px',
                                    height: '20px',
                                  }}
                                />
                                {isLowStock && (
                                  <Chip
                                    icon={<WarningIcon />}
                                    label="Low Stock"
                                    size="small"
                                    sx={{
                                      backgroundColor: '#fee2e2',
                                      color: '#dc2626',
                                      fontWeight: 500,
                                      fontSize: '11px',
                                      height: '20px',
                                    }}
                                  />
                                )}
                              </Box>
                              {item.sku && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: '#57606a',
                                    fontSize: '12px',
                                    marginBottom: 0.5,
                                  }}
                                >
                                  SKU: {item.sku}
                                </Typography>
                              )}
                              {item.description && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: '#57606a',
                                    fontSize: '13px',
                                  }}
                                >
                                  {item.description}
                                </Typography>
                              )}
                            </Box>
                          </Box>

                          {/* Right: Stock and Value Info */}
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 3,
                              alignItems: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {/* Stock Level */}
                            <Box sx={{ minWidth: 120 }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#57606a',
                                  fontSize: '11px',
                                  display: 'block',
                                  marginBottom: 0.5,
                                }}
                              >
                                Stock
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: isLowStock ? '#dc2626' : '#24292f',
                                  fontSize: '14px',
                                  marginBottom: 0.5,
                                }}
                              >
                                {item.quantity} {item.unit}
                              </Typography>
                              <Box
                                sx={{
                                  width: '100%',
                                  height: 4,
                                  backgroundColor: '#f0f0f0',
                                  borderRadius: 2,
                                  overflow: 'hidden',
                                }}
                              >
                                <Box
                                  sx={{
                                    width: `${Math.min(stockPercentage, 100)}%`,
                                    height: '100%',
                                    backgroundColor: isLowStock
                                      ? '#dc2626'
                                      : stockPercentage > 50
                                        ? '#10b981'
                                        : '#f59e0b',
                                  }}
                                />
                              </Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#57606a',
                                  fontSize: '10px',
                                  marginTop: 0.5,
                                }}
                              >
                                Min: {item.minStock}
                                {item.maxStock && ` / Max: ${item.maxStock}`}
                              </Typography>
                            </Box>

                            {/* Unit Cost */}
                            <Box sx={{ minWidth: 100, textAlign: 'right' }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#57606a',
                                  fontSize: '11px',
                                  display: 'block',
                                  marginBottom: 0.5,
                                }}
                              >
                                Unit Cost
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: '#24292f',
                                  fontSize: '14px',
                                }}
                              >
                                ${item.costPerUnit.toFixed(2)}
                              </Typography>
                            </Box>

                            {/* Total Value */}
                            <Box sx={{ minWidth: 120, textAlign: 'right' }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#57606a',
                                  fontSize: '11px',
                                  display: 'block',
                                  marginBottom: 0.5,
                                }}
                              >
                                Total Value
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: '#24292f',
                                  fontSize: '14px',
                                }}
                              >
                                ${(item.quantity * item.costPerUnit).toFixed(2)}
                              </Typography>
                            </Box>

                            {/* Location and Expiry (if available) */}
                            {(item.location || item.expiryDate) && (
                              <Box sx={{ minWidth: 150 }}>
                                {item.location && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: '#57606a',
                                      fontSize: '11px',
                                      display: 'block',
                                      marginBottom: 0.5,
                                    }}
                                  >
                                    Location
                                  </Typography>
                                )}
                                {item.location && (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: '#24292f',
                                      fontSize: '12px',
                                      marginBottom: 0.5,
                                    }}
                                  >
                                    {item.location}
                                  </Typography>
                                )}
                                {item.expiryDate && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: '#57606a',
                                      fontSize: '11px',
                                      display: 'block',
                                    }}
                                  >
                                    Expires:{' '}
                                    {new Date(
                                      item.expiryDate
                                    ).toLocaleDateString()}
                                  </Typography>
                                )}
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Paper>
                    );
                  })}
                </Box>
              ) : (
                <Paper
                  sx={{
                    padding: 4,
                    textAlign: 'center',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d0d7de',
                  }}
                >
                  <InventoryIcon
                    sx={{ fontSize: 48, color: '#d0d7de', marginBottom: 2 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ color: '#24292f', marginBottom: 1 }}
                  >
                    No items found
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#57606a' }}>
                    {searchValue || categoryFilter !== 'All'
                      ? 'Try adjusting your search or filters'
                      : 'No inventory items in this organization yet'}
                  </Typography>
                </Paper>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
