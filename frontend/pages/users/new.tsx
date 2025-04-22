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
