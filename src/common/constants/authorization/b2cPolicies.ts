export const b2cPolicies = {
   authorities: {
      editProfile: {
         authority: `${process.env.REACT_APP_AUTHORITY}/${process.env.REACT_APP_EDIT_PROFILE_POLICY}/`,
      },
      signUpSignIn: {
         authority: `${process.env.REACT_APP_AUTHORITY}/${process.env.REACT_APP_SIGNIN_POLICY}/`,
      },
   },
   authorityDomain: `${process.env.REACT_APP_AUTHORITY_DOMAIN}`,
   names: {
      editProfile: `${process.env.REACT_APP_EDIT_PROFILE_POLICY}`,
      signUpSignIn: `${process.env.REACT_APP_SIGNIN_POLICY}`,
   },
};