export const loginRequest = Object.freeze({
   scopes: ['Switchboard.UIAccess'].map((scope) => `${process.env.REACT_APP_APP_ID_URL}/${scope}`)
});