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
