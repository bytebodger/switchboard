## Switchboard

This codebase is a React/TypeScript UI for handling email campaigns and A/B split testing via email messages.

## Code Organization
The following are core directories:

```
\src
    \common
        \assets
            \css
            \images
        \components
        \constants
        \functions
        \hooks
    \paths
```

### Paths

`\src\paths` is a hierarchal directory that mirrors the pathing that is observable in the browser.

If the application has a path (route) that is accessible at `some.domain.com/admin`, then there should be an `Admin.tsx` component located here:

```
\src
    \common
    \paths
        \admin
            Admin.tsx
```

If there's a path (route) that is accessible at `some.domain.com/admin/users`, there should be a `Users.tsx` component located here:

```
\src
    \common
    \paths
        \admin
            Admin.tsx
            \users
                Users.tsx
```

And if there's a path (route) that is accessible at `some.domain.com/admin/users/create`, there should be a `Create.tsx` component located here:

```
\src
    \common
    \paths
        \admin
            Admin.tsx
            \users
                Users.tsx
                \create
                    Create.tsx
```

### Route Helper Files

If a route uses helper files that are _specific to that route_, then those file should be organized, by type, in the same folder where the route resides.

For example, in the following code:

```
\src
    \common
    \paths
        \admin
            Admin.tsx
            \components
                AdminHeader.tsx
            \functions
                isAdmin.ts
            \users
                Users.tsx
                \hooks
                    useUsersEndpoint.ts
                \create
                    Create.tsx
```

It's presumed that `AdminHeader.tsx` and `isAdmin.ts` are only used in the `/admin` route, or its child paths, and that `useUsersEndpoint.ts` is only used in the `/admin/users` route, or its child paths.

### Common Files

The files saved under the `/src/common/` directory are those that could potentially be used amongst any of the paths.  If a file is specific to a given route, it should be saved under that route.  The `/src/common/` directory is for near-universal functionality.

For example:

```
\src
    \common
        \assets
            \css
                base-site.css
            \images
                company-logo.png
        \components
            CommonModal.tsx
        \constants
            userStatus.ts
        \functions
            getCurrentViewport.ts
        \hooks
            useApiGateway.ts
    \paths
        \admin
            Admin.tsx
            \components
                AdminHeader.tsx
            \functions
                isAdmin.ts
            \users
                Users.tsx
                \hooks
                    useUsersEndpoint.ts
                \create
                    Create.tsx
```

## Tests

All components, and any significant piece of _logic_, should be accompanied by unit tests.  Those tests should live in the same directory as the logic they're testing.

For example:

```
\src
    \common
        \assets
            \css
                base-site.css
            \images
                company-logo.png
        \components
            CommonModal.tsx
            CommonModal.test.tsx
        \constants
            userStatus.ts
            userStatus.test.ts
        \functions
            getCurrentViewport.ts
            getCurrentViewport.test.ts
        \hooks
            useApiGateway.ts
            useApiGateway.test.ts
    \paths
        \admin
            Admin.tsx
            Admin.test.tsx
            \components
                AdminHeader.tsx
                AdminHeader.test.tsx
            \functions
                isAdmin.ts
                isAdmin.test.tsx
            \users
                Users.tsx
                Users.test.tsx
                \hooks
                    useUsersEndpoint.ts
                    useUsersEndpoint.test.tsx
                \create
                    Create.tsx
                    Create.test.tsx
```

Tests are configured to run before creating a test build - and to fail the build if any tests do not pass.  This should not be changed.

## Linting

ESLint is configured to run before creating a test build - and to fail the build if the linter does not pass.  Based on team consensus, the linting rules can be altered.  But they should never be fully disabled.

## Translations

Unless it's explicitly known that an application will _never_ require _any_ sort of translations, great effort should be made to avoid hardcoding plain English text inside the application.  Instead, all text should be drawn from a central translations file using i18n to dynamically show the user's content.

Whenever possible, translation keys should represent all-or-most of the text that's seen on screen.

For example, translated apps often use a key that looks like this:

```javascript
const resources = {
   en: {
      translation: {
         welcome_text: 'Welcome to Switchboard!',
      },
   },
}
```

This is problematic because the key `welcome_text` is generic and there could be a need for "welcome text" in many places throughout the app.  Instead, the translation key should look like this:

```javascript
const resources = {
   en: {
      translation: {
         'Welcome to Switchboard!': 'Welcome to Switchboard!',
      },
   },
}
```

This also makes the application easier to troubleshoot.  When a new developer sees "Welcome to Switchboard!" on the screen, they can easily find the code that's driving that display.  Because they only need to search the code for that literal string.

## Toolset

The following are not required for every project, but are preferred tools/approaches:

* **Language:** TypeScript
* **Library:** React, with a heavy focus on Hooks, functional components, and the Context API
* **Design:** Material UI (which would be switched out for Ionic if the site must be compiled into native apps)
* **State Management:** Ideally, this is handled with no outside libaries - but when one is needed, Zustand is preferred due its simplicity and lack of boilerplate
* **Pathing:** React Router
* **Asynchronous Calls:** React Query
* **Translations:** i18n