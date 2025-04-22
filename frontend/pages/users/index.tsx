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
