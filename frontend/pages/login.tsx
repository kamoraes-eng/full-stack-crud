'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { login as loginService } from '../src/services/authService';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await loginService(email, password);
      router.push('/users');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'url(/login-bg.jpg) center/cover no-repeat',
      }}
    >
      <Box
        sx={{
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255,255,255,0.6)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: 2,
          p: 4,
          maxWidth: 400,
          width: '90%',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            fullWidth
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Entrar
          </Button>

          <Link href="/users/new" passHref legacyBehavior>
            <Button component="a" variant="contained" color="secondary" fullWidth>
              Cadastre-se
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
