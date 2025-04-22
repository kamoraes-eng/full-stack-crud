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

export const createUser = async (
  name: string,
  email: string,
  password: string
): Promise<UserDTO> => {
  const { data } = await api.post<UserDTO>('/users', { name, email, password })
  return data
}

export const fetchUser = async (id: string): Promise<UserDTO> => {
  try {
    const { data } = await api.get<UserDTO>(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const updateUser = async (
  id: string,
  name: string
): Promise<UserDTO> => {
  const { data } = await api.patch<UserDTO>(`/users/${id}`, { name })
  return data
}

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`)
}
