--------------------STEP BY STEP--------------------
##|SET-UP|

---

(Can be done in frontend folder)
Install bunjs on windows with ' powershell -c "irm bun.sh/install.ps1 | iex" '.
Add (dependencies) shadcn/ui into project with cmd "bunx --bun shadcn@latest init":

- Install component "bunx --bun shadcn@latest add button" -> (app/components/ui).
- Install component "bunx --bun shadcn@latest add card input separator" -> (app/components/ui).
- Install component "bunx --bun shadcn@latest add avatar" -> (app/components/ui).
- Install component "bunx --bun shadcn@latest add dropdown-menu" -> (app/components/ui).
- Install component "bunx --bun shadcn@latest add dialog" -> (app/components/ui).
- Install component "bunx --bun shadcn@latest add sonner" -> (app/components/ui).
- Install component "bunx --bun shadcn@latest add resizable" -> (app/components/ui).
  Add react-icons with "bun add react-icons".
  Modify app/page.tsx, clear all content in function Home().

---

## |DATABASE SET-UP|

(Can be done in backend folder)
Add Convex Nextjs with "bun add convex".

- Log in and Run cmd "bun convex dev", input project name, checkout the https://dashboard.convex.dev.
- (No need to do this step, just for understand
  create a sampleData.jsonl, run cmd "bunx convex import --table tasks sampleData.jsonl".
  |=> "tasks" is table name.
  |=> 3 column value as sampleData)
- Create ConvexClientProvider.tsx -> (src/components).
  Add Convex Auth with cmd "bun add @convex-dev/auth @auth/core".
- Run cmd "bunx @convex-dev/auth".
- If you cannot get JWKS or JWT_PRIVATE_KEY, following the manual setup from step generateKeys.mjs.
- Following this https://labs.convex.dev/auth/setup to setup DB (select Nextjs).
  Github authentication:
- Go to convex/your-project/settings and copy the HTTP Actions URL
- Pass to https://github.com/settings/developers as callback URL -> "https://sample.site/api/auth/callback/github".
- Copy the Client ID from github, run cmd: "bunx convex env set AUTH_GITHUB_ID=<gitClientID>".
- Generate Client Secret Keys, run cmd: "bunx convex env set AUTH_GITHUB_SECRET=<cliSeKey>".
- Double-Check convex your-project/settings/Environment Variables.
  Google authentication:
- Go to https://console.cloud.google.com, select Project -> create new project.
- Select Project, search apis & Services, select OAuth consent screen -> External -> CREATE.
  -- Fill App Name, User Support Email, Authorized domains (ActionHTTPUrl), Developer contact information fields.
  -- Save and Continue until Test Users done.
- Go to Credentials -> CREATE CRENDTIALS -> OAuth client ID:
  -- Application type: [Web Application],
  -- Name: [no matter],
  -- Authorized JavaScript origins: [https://localhost:3000],
  -- Authorized redirect URIs: [https://sample.site/api/auth/callback/google]
- Copy Client ID, run cmd: "bunx convex env set AUTH_GOOGLE_ID=<clientID>".
- Copy Client Secret, run cmd: "bunx convex env set AUTH_GOOGLE_SECRET <cliSe>".

---

- run cmd :"bun add jotai".
  WARNING: MUST RUN BOTH COMMAND (inorder to mantain api's connection):
  - "bun run dev" for frontend.
  - "bun convex dev" for backend.
