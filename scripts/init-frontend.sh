#!/usr/bin/env bash
set -e

# 1. Create folder structure
mkdir -p frontend/{pages/users/[id],src/{lib,services,context}}

# 2. Write package.json
cat > frontend/package.json << 'EOF'
{
  "name": "ambev-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "next lint"
  },
  "dependencies": {
    "axios": "^1.4.0",
    "jwt-decode": "^3.1.2",
    "next": "13.5.4",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-query": "^3.39.3"
  },
  "devDependencies": {
    "@types/jwt-decode": "^3.1.1",
    "@types/node": "20.4.2",
    "@types/react": "18.2.7",
    "eslint": "8.43.0",
    "eslint-config-next": "13.5.4",
    "typescript": "5.1.6"
  }
}
EOF

# 3. Write tsconfig.json
cat > frontend/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2021",
    "lib": ["dom","dom.iterable","esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "incremental": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "baseUrl": ".",
    "paths": {}
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
EOF

# 4. Write next.config.js
cat > frontend/next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}
module.exports = nextConfig
EOF

# 5. Write .env.local
cat > frontend/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3000
EOF

# 6. Write QueryClient
cat > frontend/src/lib/queryClient.ts << 'EOF'
import { QueryClient } from 'react-query'

export const queryClient = new QueryClient()
EOF

# 7. Write api.ts
cat > frontend/src/services/api.ts << 'EOF'
import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use(config => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (token && config.headers) {
    config.headers.Authorization = \`Bearer \${token}\`
  }
  return config
})
EOF

# 8. Write authService.ts
cat > frontend/src/services/authService.ts << 'EOF'
import { api } from './api'

export interface LoginResponse {
  access_token: string
}

export const login = async (email: string, password: string) => {
  const { data } = await api.post<LoginResponse>('/auth/login', { email, password })
  localStorage.setItem('token', data.access_token)
  return data.access_token
}
EOF

# 9. Write userService.ts
cat > frontend/src/services/userService.ts << 'EOF'
import { api } from './api'

export interface UserDTO {
  id: string
  name: string
  email: string
  createdAt: string
}

export const fetchUsers = async (): Promise<UserDTO[]> => {
  const { data } = await api.get<UserDTO[]>('/users')
  return data
}

export const createUser = async (name: string, email: string, password: string) => {
  const { data } = await api.post<UserDTO>('/users', { name, email, password })
  return data
}

export const fetchUser = async (id: string): Promise<UserDTO> => {
  const { data } = await api.get<UserDTO>(\`/users/\${id}\`)
  return data
}

export const updateUser = async (id: string, name: string) => {
  const { data } = await api.patch<UserDTO>(\`/users/\${id}\`, { name })
  return data
}

export const deleteUser = async (id: string) => {
  await api.delete(\`/users/\${id}\`)
}
EOF

# 10. Write AuthContext.tsx
cat > frontend/src/context/AuthContext.tsx << 'EOF'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import jwt_decode from 'jwt-decode'

interface AuthContextType {
  user: { id: string; email: string } | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)

  const loginFn = async (email: string, password: string) => {
    const { login } = await import('../services/authService')
    const token = await login(email, password)
    const payload = jwt_decode<{ sub: string; email: string }>(token)
    setUser({ id: payload.sub, email: payload.email })
  }

  const logoutFn = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = jwt_decode<{ sub: string; email: string }>(token)
        setUser({ id: payload.sub, email: payload.email })
      } catch {
        logoutFn()
      }
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, login: loginFn, logout: logoutFn }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
EOF

# 11. Write _app.tsx
cat > frontend/pages/_app.tsx << 'EOF'
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
EOF

# 12. Write index.tsx
cat > frontend/pages/index.tsx << 'EOF'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../src/context/AuthContext'

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    router.replace(user ? '/users' : '/login')
  }, [user, router])

  return null
}
EOF

# 13. Write login.tsx
cat > frontend/pages/login.tsx << 'EOF'
import { useState } from 'react'
import { useAuth } from '../src/context/AuthContext'
import { useRouter } from 'next/router'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      router.push('/users')
    } catch (err: any) {
      setError(err.response?.data?.message || err.message)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <input type="email" placeholder="Email" value={email}
               onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password}
               onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
EOF

# 14. Write users list
cat > frontend/pages/users/index.tsx << 'EOF'
import Link from 'next/link'
import { useQuery, useMutation } from 'react-query'
import { fetchUsers, deleteUser } from '../../src/services/userService'
import { queryClient } from '../../src/lib/queryClient'

export default function UsersList() {
  const { data: users, isLoading, error } = useQuery('users', fetchUsers)
  const delMutation = useMutation(deleteUser, {
    onSuccess: () => queryClient.invalidateQueries('users')
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error!</p>

  return (
    <div>
      <h1>Usuários</h1>
      <Link href="/users/new">Novo Usuário</Link>
      <ul>
        {users?.map(u => (
          <li key={u.id}>
            {u.name} ({u.email})
            <Link href={`/users/${u.id}/edit`}>Editar</Link>
            <button onClick={() => delMutation.mutate(u.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
EOF

# 15. Write new user
cat > frontend/pages/users/new.tsx << 'EOF'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import { createUser } from '../../src/services/userService'
import { queryClient } from '../../src/lib/queryClient'

export default function NewUser() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const createMutation = useMutation(
    () => createUser(name, email, password),
    { onSuccess: () => {
        queryClient.invalidateQueries('users')
        router.push('/users')
      }
    }
  )

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate()
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Novo Usuário</h1>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Salvar</button>
    </form>
  )
}
EOF

# 16. Write edit user
cat > frontend/pages/users/[id]/edit.tsx << 'EOF'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from 'react-query'
import { fetchUser, updateUser } from '../../../src/services/userService'
import { queryClient } from '../../../src/lib/queryClient'

export default function EditUser() {
  const router = useRouter()
  const { id } = router.query as { id: string }
  const { data: user, isLoading } = useQuery(['user', id], () => fetchUser(id), { enabled: !!id })
  const [name, setName] = useState('')

  useEffect(() => {
    if (user) setName(user.name)
  }, [user])

  const updateMutation = useMutation(() => updateUser(id, name), {
    onSuccess: () => {
      queryClient.invalidateQueries('users')
      router.push('/users')
    }
  })

  if (isLoading) return <p>Loading...</p>
  if (!user) return <p>User not found</p>

  return (
    <form onSubmit={e => { e.preventDefault(); updateMutation.mutate() }}>
      <h1>Editar Usuário</h1>
      <input value={name} onChange={e => setName(e.target.value)} required />
      <button type="submit">Atualizar</button>
    </form>
  )
}
EOF

echo "✅ Frontend scaffold complete.  cd frontend && npm install && npm run dev"
