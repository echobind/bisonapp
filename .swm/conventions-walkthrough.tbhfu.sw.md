---
id: tbhfu
name: Conventions Walkthrough
file_version: 1.0.2
app_version: 0.9.1-5
file_blobs:
  packages/create-bison-app/template/package.json.ejs: 3244255a51c09581a81d367220eb735794977ae1
  packages/create-bison-app/template/components/LoginForm.tsx: 7e2384a4db76a320dae8d474ea1e3cade6359aa8
---

## Templates

*   Don't copy/paste files, use generators and [Hygen templates.](https://www.hygen.io/) Templates reside in `_/templates` and by default we have provided templates to create the following:
    
    *   cell
        
    *   component
        
    *   graphql type
        
    *   page
        
    *   tests
        
        *   component
            
        *   factory
            
        *   request
            
*   As your project evolves you can add, remove, and update the \_templates
    
*   Convenience commands have been provided in the package for the original templates, any changes can be made within this file. Note - these are aliasing the hygen commands which can also be used directly

<br/>

Convenience commands
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 packages/create-bison-app/template/package.json.ejs
```ejs
⬜ 23         "db:setup": "yarn db:reset",
⬜ 24         "dev": "concurrently -n \"WATCHERS,NEXT\" -c \"black.bgYellow.dim,black.bgCyan.dim\" \"yarn watch:all\" \"next dev\"",
⬜ 25         "dev:typecheck": "tsc --noEmit",
🟩 26         "g:cell": "hygen cell new --name",
🟩 27         "g:component": "hygen component new --name",
🟩 28         "g:graphql": "hygen graphql new --name",
🟩 29         "g:page": "hygen page new --name",
🟩 30         "g:migration": "yarn -s prisma migrate dev",
🟩 31         "g:test:component": "hygen test component --name",
🟩 32         "g:test:factory": "hygen test factory --name",
🟩 33         "g:test:request": "hygen test request --name",
🟩 34         "g:test:util": "hygen test util --name",
⬜ 35         "lint": "yarn eslint . --ext .ts,.tsx --ignore-pattern tmp",
⬜ 36         "lint:fix": "yarn lint --fix",
⬜ 37         "run:script": "yarn ts-node prisma/scripts/run.ts -f",
```

<br/>

## Types

Don't manually write types for GraphQL responses, use the generated query hooks from GraphQL Codegen.

Here is a walk through of what this looks like from defining a query or mutation, to using the generated hook.




<br/>

Using the `gql` syntax anywhere in the project and then running codegen with `yarn codegen` the proper graphql types and variables will be generated for the queries you are using. This will give a better Developer Experience (DX) to know what variables are needed, their types, and what type and shape your data will be returned in.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 packages/create-bison-app/template/components/LoginForm.tsx
```tsx
⬜ 11     import { setErrorsFromGraphQLErrors } from '@/utils/setErrors';
⬜ 12     import { LoginMutationVariables, useLoginMutation } from '@/types';
⬜ 13     
🟩 14     export const LOGIN_MUTATION = gql`
🟩 15       mutation login($email: String!, $password: String!) {
🟩 16         login(email: $email, password: $password) {
🟩 17           token
🟩 18         }
🟩 19       }
🟩 20     `;
🟩 21     
⬜ 22     /** Form to Login */
⬜ 23     export function LoginForm() {
⬜ 24       const {
```

<br/>

Here we have imported generated query hooks to utilize them in our component.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 packages/create-bison-app/template/components/LoginForm.tsx
```tsx
⬜ 9      import { ErrorText } from '@/components/ErrorText';
⬜ 10     import { Link } from '@/components/Link';
⬜ 11     import { setErrorsFromGraphQLErrors } from '@/utils/setErrors';
🟩 12     import { LoginMutationVariables, useLoginMutation } from '@/types';
⬜ 13     
⬜ 14     export const LOGIN_MUTATION = gql`
⬜ 15       mutation login($email: String!, $password: String!) {
```

<br/>

Preparing to use the mutation by assigning a variable that will be able to call this function and be aware of the variables required to call it.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 packages/create-bison-app/template/components/LoginForm.tsx
```tsx
⬜ 29       } = useForm<LoginMutationVariables>();
⬜ 30     
⬜ 31       const [isLoading, setIsLoading] = useState(false);
🟩 32       const [login] = useLoginMutation();
⬜ 33       const { login: loginUser } = useAuth();
⬜ 34       const router = useRouter();
⬜ 35     
```

<br/>

Calling the async function `login`
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 packages/create-bison-app/template/components/LoginForm.tsx
```tsx
⬜ 40       async function handleLogin(formData: LoginMutationVariables) {
⬜ 41         try {
⬜ 42           setIsLoading(true);
🟩 43           const { data } = await login({ variables: formData });
⬜ 44     
⬜ 45           if (!data?.login?.token) {
⬜ 46             throw new Error('Login failed.');
```

<br/>

This file was generated by Swimm. [Click here to view it in the app](https://app.swimm.io/repos/Z2l0aHViJTNBJTNBYmlzb25hcHAlM0ElM0FlY2hvYmluZA==/docs/tbhfu).