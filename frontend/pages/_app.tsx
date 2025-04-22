import { AppProps } from 'next/app'
import { QueryClientProvider } from 'react-query'
import { queryClient } from '../src/lib/queryClient'
import { AuthProvider } from '../src/context/AuthContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </AuthProvider>
  )
}
