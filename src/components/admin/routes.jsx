import { AdminHome } from './AdminHome';
import { Invite } from './Invite';

export const adminRoutes = [
  { path: '', element: <AdminHome /> },
  { path: 'invite', element: <Invite /> },
];
