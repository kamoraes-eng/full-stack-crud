/* frontend/pages/users/[id]/edit.tsx */
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { useQuery, useMutation } from 'react-query';
import { fetchUser, updateUser } from '../../../src/services/userService';
import { queryClient } from '../../../src/lib/queryClient';
import { useAuth } from '../../../src/context/AuthContext';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';

export default function EditUserPage() {
  const { signOut } = useAuth();
  const router = useRouter();
  const { id } = router.query as { id: string };

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery(['user', id], () => fetchUser(id), { enabled: !!id });

  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  const updateMutation = useMutation(
    () => updateUser(id, name),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        router.push('/users');
      },
      onError: (err: any) => {
        setError(err.response?.data?.message || err.message);
      },
    }
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !user) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        Failed to load user or user not found.
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'url(/edit-bg.jpg) center/cover no-repeat',
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
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Editar Usuário</Typography>
          <Button variant="outlined" color="error" onClick={signOut}>
            Sair
          </Button>
        </Stack>

        <Box
          component="form"
          onSubmit={e => {
            e.preventDefault();
            setError(null);
            updateMutation.mutate();
          }}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Nome"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            fullWidth
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? 'Atualizando…' : 'Atualizar'}
          </Button>

          <NextLink href="/users" passHref>
            <Button component="a" variant="outlined" fullWidth>
              Voltar
            </Button>
          </NextLink>
        </Box>
      </Box>
    </Box>
  );
}
