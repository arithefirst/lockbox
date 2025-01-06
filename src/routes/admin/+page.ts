import type { PageLoad } from './$types';
export const load: PageLoad = async ({ data }) => {
  return {
    users: data.users,
    current: typeof data.current === 'string'?data.current:data.current.username
  };
};