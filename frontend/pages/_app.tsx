'use client';
import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from '../src/context/AuthContext';
import { QueryClientProvider } from 'react-query';
import { queryClient } from '../src/lib/queryClient';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
  },
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}