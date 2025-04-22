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
