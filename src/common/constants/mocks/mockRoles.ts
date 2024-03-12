export const mockRoles = {
   get: [
      {
         disabled_datetime_utc: null,
         disabled_flag: false,
         dp_request_access_flag: true,
         ref_role_id: 1,
         role_desc: 'Only uses the app for reviewing/approving Messages.',
         role_name: 'Approver',
      },
      {
         disabled_datetime_utc: null,
         disabled_flag: false,
         dp_request_access_flag: true,
         ref_role_id: 2,
         role_desc: 'Only uses the app in readonly mode.',
         role_name: 'Viewer',
      },
      {
         disabled_datetime_utc: null,
         disabled_flag: false,
         dp_request_access_flag: false,
         ref_role_id: 4,
         role_desc: 'Creates/updates all content related to Experiments.',
         role_name: 'Scientist',
      },
      {
         disabled_datetime_utc: null,
         disabled_flag: false,
         dp_request_access_flag: false,
         ref_role_id: 5,
         role_desc: 'Administers the app',
         role_name: 'Admin',
      }
   ],
}