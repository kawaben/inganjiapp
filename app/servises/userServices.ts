interface User {
  id: string;
  email: string;
  firstname?: string | null;
  lastname?: string | null;
  username?: string | null;
  image?: string | null;
  phone?: string | null;
  location?: string | null;
  country?: string | null;
  bio?: string | null;
}

export const getUser = async (id: string): Promise<User> => {
  const response = await fetch(`/api/users/${id}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch user');
  }

  return response.json();
};

export const updateUser = async (user: User): Promise<User> => {
  const response = await fetch(`/api/users/${user.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update user');
  }

  return response.json();
};