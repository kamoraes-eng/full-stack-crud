'use client';
import NextLink from 'next/link';
import { useAuth } from '../../src/context/AuthContext';
import {
  Container,
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useQuery, useMutation } from 'react-query';
import { fetchUsers, deleteUser } from '../../src/services/userService';
import { queryClient } from '../../src/lib/queryClient';
import Link from 'next/link';

export default function UsersList() {
  const { signOut } = useAuth();
  const { data: users = [], isLoading, isError } = useQuery('users', fetchUsers);
  const delMutation = useMutation(deleteUser, {
    onSuccess: () => queryClient.invalidateQueries('users'),
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }
  if (isError) {
    return <Alert severity="error" sx={{ mt: 4 }}>Failed to load users.</Alert>;
  }

  return (
    <Box
      sx={{
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(255,255,255,0.7)',
        boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
        borderRadius: 2,
        p: 2,
      }}
    >
      <Container maxWidth="md" sx={{ pt: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">Users</Typography>
          <Stack direction="row" spacing={1}>
            <NextLink href="/users/new" passHref>
            <Button component={Link} href="/users/new" variant="contained" color="secondary">
              + Create User
            </Button>
            </NextLink>
            <Button variant="outlined" color="error" onClick={() => signOut()}>
              Sair
            </Button>
          </Stack>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(u => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <NextLink href={`/users/${u.id}/edit`} passHref>
                        <Button component={Link} href={`/users/${u.id}/edit`} size="small" variant="outlined" color="primary">
                          Edit
                        </Button>
                      </NextLink>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => delMutation.mutate(u.id)}
                        disabled={delMutation.isLoading}
                      >
                        {delMutation.isLoading ? 'Deleting…' : 'Delete'}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}
