# ToDoList FullStack

## How to install

-   How to run Client
    `cd server && npm i && npm run dev`
-   How to run Server
    `cd client && npm i && npm run dev`

## How to name tasks

Template:
`type(scope): short description`

-   `type` → prefix (feat, fix, chore…)
-   `scope` (optional) → a specific area (auth, todos, client, server)
-   `short description` → a concise summary

Common commit types:

-   `feat`: — a new feature <br>
    `feat(auth): add login and register endpoints`
-   `fix`: — a bug fix
    `fix(todos): correct filter for completed tasks`
-   `chore`: — maintenance work (dependencies, configs, migrations, not affecting app behavior)
    `chore(server): setup prisma and add initial migration`
-   `refactor`: — code changes that don’t affect functionality (improve structure, readability)
    `refactor(client): simplify TodoItem component`
-   `style`: — code style changes (eslint, prettier, formatting, but not CSS)
    `style: format code with prettier`
-   `docs`: — documentation changes
    `docs: update README with install instructions`
-   `test`: — add or fix tests
    `test(auth): add unit tests for login service`
-   `build`: — changes to build system, CI/CD, or tooling (like Vite, Webpack)
    `build(client): add tailwindcss and postcss config`
