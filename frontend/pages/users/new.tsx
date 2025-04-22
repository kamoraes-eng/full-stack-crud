'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { createUser } from '../../src/services/userService';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';

export default function NewUserPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createUser(name, email, password);
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
        background: 'url(/signup-bg.jpg) center/cover no-repeat',
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
          Cadastre-se
        </Typography>

        <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nome"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Senha"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            fullWidth
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button type="submit" variant="contained" color="secondary" fullWidth>
            Cadastrar
          </Button>

          <NextLink href="/login" passHref>
            <Button component="a" variant="outlined" fullWidth>
              Voltar ao Login
            </Button>
          </NextLink>
        </Box>
      </Box>
    </Box>
  );
}
