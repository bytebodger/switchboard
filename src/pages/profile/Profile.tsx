import { Key } from '@mui/icons-material';
import { TextField, Tooltip, Typography } from '@mui/material';
import { TreeItem, TreeView } from '@mui/x-tree-view';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TbBrandRedhat } from 'react-icons/tb';
import { useEndpointStore } from '../../app/hooks/useEndpointStore';
import { Column } from '../../common/components/Column';
import { Row } from '../../common/components/Row';
import { TranslatedText } from '../../common/components/TranslatedText';
import { arg } from '../../common/constants/arg';
import { component } from '../../common/constants/component';
import { HtmlElement } from '../../common/enums/HtmlElement';
import { getNumber } from '../../common/functions/getNumber';
import { getString } from '../../common/functions/getString';
import { useLookup } from '../../common/hooks/useLookup';

const Profile = () => {
   const [getUser] = useEndpointStore(state => [state.getUser]);
   const [email, setEmail] = useState('');
   const [firstName, setFirstName] = useState('');
   const [lastName, setLastName] = useState('');
   const lookup = useLookup();
   const { t: translate } = useTranslation();

   const getRelationships = () => {
      if (!getUser()) return null;
      const roleNodes = lookup.rolesByUser(getNumber(getUser()?.id)).map(role => `role-${role.id}`);
      return <>
         <Row sx={{ marginTop: 2 }}>
            <Column xs={12}>
               <Typography variant={HtmlElement.h6}>
                  <TranslatedText text={'Your Roles & Permissions'}/>
               </Typography>
               <TreeView
                  defaultCollapseIcon={component.expandMore}
                  defaultExpandIcon={component.chevronRight}
                  expanded={roleNodes}
               >
                  {getRoleTreeRoleItems()}
               </TreeView>
            </Column>
         </Row>
      </>;
   }

   const getRoleTreePermissionItems = (roleId: number) => lookup.permissionsByRole(roleId, arg.includeDisabled)
      .map(permission => {
         const { id, isDisabled, name } = permission;
         return (
            <TreeItem
               disabled={isDisabled}
               icon={
                  <Tooltip title={translate('Permission')}>
                     <Key sx={{ marginLeft: '12px' }}/>
                  </Tooltip>
               }
               key={`permission-${id}`}
               label={
                  <TranslatedText
                     elementProps={{ style: { marginLeft: 8 } }}
                     text={name}
                  />
               }
               nodeId={`permission-${id}`}
            />
         );
      });

   const getRoleTreeRoleItems = () => {
      if (!getUser()) return null;
      return lookup.rolesByUser(getNumber(getUser()?.id))
         .map(role => {
            const { id, isDisabled, name } = role;
            return (
               <TreeItem
                  disabled={isDisabled}
                  icon={
                     <Tooltip title={translate('Role')}>
                        <span>
                           <TbBrandRedhat/>
                        </span>
                     </Tooltip>
                  }
                  key={`role-${id}`}
                  label={
                     <TranslatedText text={name}/>
                  }
                  nodeId={`role-${id}`}
               >
                  {getRoleTreePermissionItems(id)}
               </TreeItem>
            );
         });
   }

   useEffect(() => {
      if (!getUser()) return;
      setEmail(getString(getUser()?.email));
      setFirstName(getString(getUser()?.firstName));
      setLastName(getString(getUser()?.lastName));
   }, []);

   return <>
      <Typography
         sx={{ marginBottom: 2 }}
         variant={HtmlElement.h5}
      >
         <TranslatedText text={'Profile'}/>
      </Typography>
      <Row
         columnSpacing={0}
         rowSpacing={0}
      >
         <Column xs={12} sm={12} md={12} lg={12} xl={10}>
            <Row>
               <Column xs={12} md={6}>
                  <TextField
                     aria-label={translate('First Name')}
                     disabled={true}
                     label={translate('First Name')}
                     name={'first-name-field'}
                     size={'small'}
                     sx={{ width: '100%' }}
                     value={getString(firstName)}
                  />
               </Column>
            </Row>
            <Row>
               <Column xs={12} md={6}>
                  <TextField
                     aria-label={translate('Last Name')}
                     disabled={true}
                     label={translate('Last Name')}
                     name={'last-name-field'}
                     size={'small'}
                     sx={{ width: '100%' }}
                     value={getString(lastName)}
                  />
               </Column>
            </Row>
            <Row>
               <Column xs={12} md={6}>
                  <TextField
                     aria-label={translate('Email')}
                     disabled={true}
                     label={translate('Email')}
                     name={'email-field'}
                     size={'small'}
                     sx={{ width: '100%' }}
                     value={getString(email)}
                  />
               </Column>
            </Row>
            {getRelationships()}
         </Column>
      </Row>
   </>
}

export default Profile;