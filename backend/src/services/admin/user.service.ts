export const getUserByIdService = async (id: string) => {
  return {
    id,
    username: process.env.LOCAL_ADMIN_USERNAME ?? 'local-admin',
    email: `${process.env.LOCAL_ADMIN_USERNAME ?? 'local-admin'}@local`,
    role: { name: 'Admin' },
  };
};
