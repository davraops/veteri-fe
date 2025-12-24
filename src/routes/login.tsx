import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import logo from '@/assets/logo.png';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Bypass API - redirect to dashboard
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate({ to: '/' });
    } catch {
      setError('Error signing in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f6f8fa',
        padding: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: '340px' },
          margin: '0 auto',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            component="img"
            src={logo}
            alt="Veteri"
            sx={{
              height: { xs: 56, sm: 64 },
              width: 'auto',
              maxWidth: '100%',
              mb: 2,
              objectFit: 'contain',
            }}
          />
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '20px', sm: '24px' },
              fontWeight: 300,
              color: '#24292f',
              mb: 3,
              letterSpacing: '-0.5px',
            }}
          >
            Sign in to{' '}
            <Box component="span" sx={{ fontWeight: 600 }}>
              Veteri
            </Box>
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor: '#ffffff',
            border: '1px solid #d0d7de',
            borderRadius: '6px',
            padding: { xs: 3, sm: 4 },
            boxShadow: 'none',
            width: '100%',
          }}
        >
          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                backgroundColor: '#ffebe9',
                color: '#82071e',
                border: '1px solid #ff8182',
                borderRadius: '6px',
                '& .MuiAlert-icon': {
                  color: '#cf222e',
                },
              }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Box sx={{ mb: 2 }}>
              <Typography
                component="label"
                htmlFor="username"
                sx={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#24292f',
                  mb: 0.5,
                }}
              >
                Username or email address
              </Typography>
              <TextField
                fullWidth
                id="username"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                autoFocus
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '14px',
                    backgroundColor: '#ffffff',
                    '& fieldset': {
                      borderColor: '#d0d7de',
                    },
                    '&:hover fieldset': {
                      borderColor: '#2563eb',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2563eb',
                      borderWidth: '1px',
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 0.5,
                }}
              >
                <Typography
                  component="label"
                  htmlFor="password"
                  sx={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#24292f',
                  }}
                >
                  Password
                </Typography>
                <Link
                  href="#"
                  sx={{
                    fontSize: '12px',
                    color: '#2563eb',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                      color: '#1d4ed8',
                    },
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
              <TextField
                fullWidth
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '14px',
                    backgroundColor: '#ffffff',
                    '& fieldset': {
                      borderColor: '#d0d7de',
                    },
                    '&:hover fieldset': {
                      borderColor: '#2563eb',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2563eb',
                      borderWidth: '1px',
                    },
                  },
                }}
              />
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading || !email || !password}
              sx={{
                py: 1.25,
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'none',
                backgroundColor: '#10b981',
                color: '#ffffff',
                borderRadius: '6px',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#059669',
                  boxShadow: 'none',
                },
                '&:active': {
                  backgroundColor: '#047857',
                },
                '&:disabled': {
                  backgroundColor: '#a7f3d0',
                  color: '#ffffff',
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                'Sign in'
              )}
            </Button>
          </Box>
        </Box>

        {/* Sign Up Link */}
        <Box
          sx={{
            mt: 3,
            p: 3,
            border: '1px solid #d0d7de',
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: '14px',
              color: '#24292f',
            }}
          >
            New to Veteri?{' '}
            <Link
              href="#"
              sx={{
                color: '#2563eb',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': {
                  textDecoration: 'underline',
                  color: '#1d4ed8',
                },
              }}
            >
              Create an account
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
