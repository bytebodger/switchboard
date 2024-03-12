import { Biotech, Campaign, Group, Home, Key, Security } from '@mui/icons-material';
import { ListItem, ListItemButton, ListItemText, Tooltip } from '@mui/material';
import type { MouseEvent, ReactNode } from 'react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { TbBrandRedhat } from 'react-icons/tb';
import { useLocation, useNavigate } from 'react-router-dom';
import { RestrictAccess } from '../../common/components/RestrictAccess';
import { ShowIf } from '../../common/components/ShowIf';
import { accessKey } from '../../common/constants/accessKey';
import { Color } from '../../common/enums/Color';
import { Path } from '../../common/enums/Path';
import { useViewport } from '../../common/hooks/useViewport';
import type { NavLink } from '../../common/interfaces/NavLink';

export const LeftNav = () => {
   const navigate = useNavigate();
   const { t: translate } = useTranslation();
   const location = useLocation();
   const viewport = useViewport();

   const navLinks: NavLink[] = [
      {
         accessKey: accessKey.leftNavHome,
         icon: <Home/>,
         name: translate('Home'),
         page: Path.home,
         children: [],
      },
      {
         accessKey: accessKey.leftNavAdmin,
         icon: <Security/>,
         name: translate('Admin'),
         page: Path.admin,
         children: [
            {
               accessKey: accessKey.leftNavAdminPermissionsList,
               icon: <Key/>,
               name: translate('Permissions'),
               page: Path.adminPermissions,
               children: [],
            },
            {
               accessKey: accessKey.leftNavAdminRolesList,
               icon: <TbBrandRedhat
                  fontSize={22}
                  style={{ marginRight: 2 }}
               />,
               name: translate('Roles'),
               page: Path.adminRoles,
               children: [],
            },
            {
               accessKey: accessKey.leftNavAdminUsersList,
               icon: <Group/>,
               name: translate('Users'),
               page: Path.adminUsers,
               children: [],
            },
         ],
      },
      {
         accessKey: accessKey.leftNavCampaignsList,
         icon: <Campaign/>,
         name: translate('Campaigns'),
         page: Path.campaigns,
         children: [],
      },
      {
         accessKey: accessKey.leftNavExperimentsList,
         icon: <Biotech/>,
         name: translate('Experiments'),
         page: Path.experiments,
         children: [],
      },
   ]

   const getNavLinks = (links: NavLink[], level: number): ReactNode[] => links.map(link => {
      const getChildLinks = (links: NavLink[]) => getNavLinks(links, level + 1);

      const { accessKey, children, icon, name, page } = link;
      const isCurrentLink = [Path.admin, Path.home].includes(page) ? page === location.pathname : location.pathname.includes(page);
      const backgroundColor = isCurrentLink ? Color.greenTemplate : Color.white;
      const color = isCurrentLink ? Color.white : Color.grey;
      return (
         <Fragment key={name}>
            <RestrictAccess accessKey={accessKey}>
               <ShowIf condition={!viewport.isMobile}>
                  <ListItem
                     disablePadding={true}
                     key={`leftNavLink-${name}`}
                     sx={{
                        '& .MuiListItemButton-root:hover': {
                           bgcolor: isCurrentLink ? Color.greenTemplate : Color.greyLight,
                           '&, & .MuiListItemIcon-root': {
                              color,
                           },
                        },
                     }}
                  >
                     <ListItemButton
                        data-value={page}
                        onClick={navigateTo}
                        sx={{
                           backgroundColor,
                           color,
                           opacity: '1 !important',
                           paddingBottom: 0,
                           paddingLeft: (level * 4) + 1,
                           paddingTop: 0,
                        }}
                     >
                        {icon}
                        <ListItemText sx={{
                           marginLeft: 1,
                           paddingTop: '4px',
                        }}>
                           {name}
                        </ListItemText>
                     </ListItemButton>
                  </ListItem>
               </ShowIf>
               <ShowIf condition={viewport.isMobile}>
                  <Tooltip title={name}>
                     <ListItem
                        disablePadding={true}
                        key={`leftNavLink-${name}`}
                     >
                        <ListItemButton
                           data-value={page}
                           onClick={navigateTo}
                           sx={{
                              backgroundColor,
                              color,
                              opacity: '1 !important',
                              paddingBottom: 0.9,
                              paddingLeft: (level * 2) + 1,
                              paddingTop: 0.9,
                           }}
                        >
                           {icon}
                        </ListItemButton>
                     </ListItem>
                  </Tooltip>
               </ShowIf>
               {getChildLinks(children)}
            </RestrictAccess>
         </Fragment>
      )
   });

   const navigateTo = (event: MouseEvent<HTMLElement>) => {
      const { value: navigateTo } = event.currentTarget.dataset;
      if (navigateTo) navigate(navigateTo);
   }

   return getNavLinks(navLinks, 0);
}