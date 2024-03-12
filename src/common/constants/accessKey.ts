import { Permission } from '../enums/Permission';

export const accessKey = {
   campaignAddCampaignTags: {
      feature: 'Campaign ➝ Detail Tab ➝ Add Campaign Tags',
      permissions: Permission.marketerWrite,
   },
   campaignAddValues: {
      feature: 'Campaign ➝ Add Values',
      permissions: Permission.marketerWrite,
   },
   campaignClone: {
      feature: 'Campaign ➝ Clone',
      permissions: Permission.marketerWrite,
   },
   campaignsListActivateCampaign: {
      feature: 'Campaigns List ➝ Activate Campaign',
      permissions: Permission.marketerWrite,
   },
   campaignsListCreateCampaign: {
      feature: 'Campaigns List ➝ Create Campaign',
      permissions: Permission.marketerWrite,
   },
   campaignsListDeleteCampaign: {
      feature: 'Campaigns List ➝ Delete Campaign',
      permissions: Permission.marketerWrite,
   },
   campaignsListGoToCampaignDetail: {
      feature: 'Campaigns List ➝ Go To Campaign Detail',
      permissions: [
         Permission.marketerRead,
         Permission.marketerWrite,
      ],
   },
   campaignsListViewPage: {
      feature: 'Campaigns List ➝ View Page',
      permissions: [
         Permission.marketerRead,
         Permission.marketerWrite,
      ],
   },
   campaignUpdateDetails: {
      feature: 'Campaign ➝ Detail Tab ➝ Update Details',
      permissions: Permission.marketerWrite,
   },
   campaignViewPage: {
      feature: 'Campaign ➝ View Page',
      permissions: [
         Permission.marketerRead,
         Permission.marketerWrite,
      ],
   },
   experimentAddExperimentTags: {
      feature: 'Experiment ➝ Detail Tab ➝ Add Experiment Tags',
      permissions: Permission.scientistWrite,
   },
   experimentAddMessageTags: {
      feature: 'Experiment ➝ Messages Tab ➝ Add Message Tags',
      permissions: Permission.scientistWrite,
   },
   experimentAddValues: {
      feature: 'Experiment ➝ Add Values',
      permissions: Permission.scientistWrite,
   },
   experimentClone: {
      feature: 'Experiment ➝ Clone',
      permissions: Permission.scientistWrite,
   },
   experimentDeleteCohort: {
      feature: 'Experiment ➝ Audience Tab ➝ Delete Cohort',
      permissions: Permission.scientistWrite,
   },
   experimentDeleteTemplate: {
      feature: 'Experiment ➝ Messages Tab ➝ Delete Template',
      permissions: Permission.scientistWrite,
   },
   experimentDeleteHypothesis: {
      feature: 'Experiment ➝ Hypothesis Tab ➝ Delete Hypothesis',
      permissions: Permission.scientistWrite,
   },
   experimentSaveEmailTemplate: {
      feature: 'Experiment ➝ Messages Tab ➝ Save Email Template',
      permissions: Permission.scientistWrite,
   },
   experimentSaveHypothesis: {
      feature: 'Experiment ➝ Hypothesis Tab ➝ Save Hypothesis',
      permissions: Permission.scientistWrite,
   },
   experimentUpdateDetails: {
      feature: 'Experiment ➝ Detail Tab ➝ Update Details',
      permissions: Permission.scientistWrite,
   },
   experimentViewPage: {
      feature: 'Experiment ➝ View Page',
      permissions: [
         Permission.scientistRead,
         Permission.scientistWrite,
      ],
   },
   experimentsListActivateExperiment: {
      feature: 'Experiments List ➝ Activate Experiment',
      permissions: Permission.scientistWrite,
   },
   experimentsListCreateExperiment: {
      feature: 'Experiments List ➝ Create Experiment',
      permissions: Permission.scientistWrite,
   },
   experimentsListDeleteExperiment: {
      feature: 'Experiments List ➝ Delete Experiment',
      permissions: Permission.scientistWrite,
   },
   experimentsListGoToExperimentDetail: {
      feature: 'Experiments List ➝ Go To Experiment Detail',
      permissions: [
         Permission.scientistRead,
         Permission.scientistWrite,
      ],
   },
   experimentsListViewPage: {
      feature: 'Experiments List ➝ View Page',
      permissions: [
         Permission.scientistRead,
         Permission.scientistWrite,
      ],
   },
   leftNavAdmin: {
      feature: 'Left Nav ➝ Admin',
      permissions: [
         Permission.adminRead,
         Permission.adminWrite,
      ],
   },
   leftNavAdminPermissionsList: {
      feature: 'Left Nav ➝ Admin ➝ Permissions List',
      permissions: [
         Permission.adminRead,
         Permission.adminWrite,
      ],
   },
   leftNavAdminRolesList: {
      feature: 'Left Nav ➝ Admin ➝ Roles List',
      permissions: [
         Permission.adminRead,
         Permission.adminWrite,
      ],
   },
   leftNavAdminUsersList: {
      feature: 'Left Nav ➝ Admin ➝ Users List',
      permissions: [
         Permission.adminRead,
         Permission.adminWrite,
      ],
   },
   leftNavCampaignsList: {
      feature: 'Left Nav ➝ Campaigns',
      permissions: [
         Permission.marketerAdmin,
         Permission.marketerRead,
         Permission.marketerWrite,
      ],
   },
   leftNavExperimentsList: {
      feature: 'Left Nav ➝ Experiments',
      permissions: [
         Permission.scientistAdmin,
         Permission.scientistRead,
         Permission.scientistWrite,
      ],
   },
   leftNavHome: {
      feature: 'Left Nav ➝ Home',
      permissions: [
         Permission.adminRead,
         Permission.read,
         Permission.scientistRead,
      ]
   },
   leftNavReviewsList: {
      feature: 'Left Nav ➝ Reviews',
      permissions: [
         Permission.adminRead,
         Permission.read,
         Permission.scientistRead,
      ]
   },
   permissionActivatePermission: {
      feature: 'Permission ➝ Activate Permission',
      permissions: Permission.adminWrite,
   },
   permissionSavePermission: {
      feature: 'Permission ➝ Save Permission',
      permissions: Permission.adminWrite,
   },
   permissionViewPage: {
      feature: 'Permission ➝ View Page',
      permissions: [
         Permission.adminRead,
         Permission.adminWrite,
      ],
   },
   permissionsListActivatePermission: {
      feature: 'Permissions List ➝ Activate Permission',
      permissions: Permission.adminWrite,
   },
   permissionsListCreatePermission: {
      feature: 'Permissions List ➝ Create Permission',
      permissions: Permission.adminWrite,
   },
   permissionsListDeletePermission: {
      feature: 'Permissions List ➝ Delete Permission',
      permissions: Permission.adminWrite,
   },
   permissionsListGoToPermissionDetail: {
      feature: 'Permissions List ➝ Go To Permission Detail',
      permissions: [
         Permission.adminRead,
         Permission.adminWrite,
      ],
   },
   permissionsListViewPage: {
      feature: 'Permissions List ➝ View Page',
      permissions: [
         Permission.adminRead,
         Permission.adminWrite,
      ],
   },
   roleAddPermissionsAndUsers: {
      feature: 'Role ➝ Add Permissions And Users',
      permissions: Permission.adminWrite,
   },
   roleRemovePermission: {
      feature: 'Role ➝ Remove Permission',
      permissions: Permission.adminWrite,
   },
   roleRemoveUser: {
      feature: 'Role ➝ Remove User',
      permissions: Permission.adminWrite,
   },
   roleSaveRole: {
      feature: 'Role ➝ Save Role',
      permissions: Permission.adminWrite,
   },
   roleViewPage: {
      feature: 'Role ➝ View Page',
      permissions: [
         Permission.adminRead,
         Permission.adminWrite,
      ],
   },
   rolesListActivateRole: {
      feature: 'Roles List ➝ Activate Role',
      permissions: Permission.adminWrite,
   },
   rolesListDeleteRole: {
      feature: 'Roles List ➝ Delete Role',
      permissions: Permission.adminWrite,
   },
   rolesListGoToRoleDetail: {
      feature: 'Roles List ➝ Go To Role Detail',
      permissions: [
         Permission.adminRead,
         Permission.adminWrite,
      ],
   },
   rolesListViewPage: {
      feature: 'Roles List ➝ View Page',
      permissions: [
         Permission.adminRead,
         Permission.adminWrite,
      ],
   },
   userActivateUser: {
      feature: 'User ➝ Activate User',
      permissions: Permission.adminWrite,
   },
   userAssignRole: {
      feature: 'User ➝ Assign Role',
      permissions: Permission.adminWrite,
   },
   userUpdateDetails: {
      feature: 'User ➝ Update Details',
      permissions: Permission.adminWrite,
   },
   userViewPage: {
      feature: 'User ➝ View Page',
      permissions: [
         Permission.adminRead,
         Permission.adminWrite,
      ],
   },
   usersListActivateUser: {
      feature: 'Users List ➝ Activate User',
      permissions: Permission.adminWrite,
   },
   usersListGoToUserDetail: {
      feature: 'Users List ➝ Go To User Detail',
      permissions: [
         Permission.adminRead,
         Permission.adminWrite,
      ],
   },
   usersListViewPage: {
      feature: 'Users List ➝ View Page',
      permissions: [
         Permission.adminRead,
         Permission.adminWrite,
      ],
   },
}