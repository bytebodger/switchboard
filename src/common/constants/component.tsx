import { ChevronRight, ExpandMore } from '@mui/icons-material';
import { lazy } from 'react';

const Access = lazy(async () => import('../../pages/access/Access'));
const Admin = lazy(async () => import('../../pages/admin/Admin'));
const Campaign = lazy(async () => import('../../pages/campaigns/campaign/Campaign'));
const Campaigns = lazy(async () => import('../../pages/campaigns/Campaigns'));
const Experiment = lazy(async () => import('../../pages/experiments/experiment/Experiment'));
const Experiments = lazy(async () => import('../../pages/experiments/Experiments'));
const Home = lazy(async () => import('../../pages/home/Home'));
const Permission = lazy(async () => import('../../pages/admin/permissions/permission/Permission'));
const Permissions = lazy(async () => import('../../pages/admin/permissions/Permissions'));
const Profile = lazy(async () => import('../../pages/profile/Profile'));
const ReleaseNotes = lazy(async () => import('../../pages/release-notes/ReleaseNotes'));
const Role = lazy(async () => import('../../pages/admin/roles/role/Role'));
const Roles = lazy(async () => import('../../pages/admin/roles/Roles'));
const Unauthorized = lazy(async () => import('../../pages/unauthorized/Unauthorized'));
const User = lazy(async () => import('../../pages/admin/users/user/User'));
const Users = lazy(async () => import('../../pages/admin/users/Users'));

export const component = {
   access: <Access/>,
   admin: <Admin/>,
   campaign: <Campaign/>,
   campaigns: <Campaigns/>,
   chevronRight: <ChevronRight/>,
   expandMore: <ExpandMore/>,
   experiment: <Experiment/>,
   experiments: <Experiments/>,
   home: <Home/>,
   permission: <Permission/>,
   permissions: <Permissions/>,
   profile: <Profile/>,
   releaseNotes: <ReleaseNotes/>,
   role: <Role/>,
   roles: <Roles/>,
   unauthorized: <Unauthorized/>,
   user: <User/>,
   users: <Users/>,
}