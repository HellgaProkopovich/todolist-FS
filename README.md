# ToDoList FullStack

This is a fullstack Todo List app with user authentication.  
Users can register, login, and manage their personal tasks (add, edit, delete, mark completed).  
The project includes backend with JWT tokens and Prisma database, and frontend built with React, Redux Toolkit, and TailwindCSS.

-   **Secure auth** with access/refresh tokens
-   **Todos per user** (each user sees only their own)
-   **Simple UI** with filters (All / Active / Completed)
-   **REST API** with Express + Prisma
-   **Frontend** with protected routes, styles built with TailwindCSS, and responsive design

## Stack

-   **Server:** Node.js, TypeScript, Express, Prisma, JWT, bcrypt
-   **DB:** SQLite (default)
-   **Client:** React + Vite, TypeScript, Redux Toolkit (RTK Query), TailwindCSS

## DEMO

![IMG_6668-ezgif com-video-to-gif-converter (1)](https://github.com/user-attachments/assets/1a598608-a812-4f35-ad71-28d215d2949c)

## How to install

```bash
git clone https://github.com/HellgaProkopovich/todolist-FS.git
cd todolist-FS
```

-   How to run `client`
    ```bash
    cd server && npm i && npm run dev
    ```
-   How to run `server`
    ```bash
    cd client && npm i && npm run dev
    ```

Ports: server **4000**, client **5173**, Prisma Studio **5555**

## API (short)

Base URL: http://127.0.0.1:4000

Auth

-   POST /auth/register `{ username, password }`
-   POST /auth/login `{ username, password }` → `{ accessToken, refreshToken }`
-   POST /auth/refresh `{ refreshToken }`
-   GET /auth/me` (protected)

Todos (protected)

-   GET /todos → `Todo[]`
-   POST /todos `{ title }`
-   PUT /todos/:id `{ title?, completed? }`
-   DELETE /todos/:id

## Tokens on client

-   access/refresh stored in Redux + localStorage
-   Axios interceptor refreshes access token automatically
-   Protected route `/todos` redirects to `/login` if no access token

---

### How to name tasks

Template:
`type(scope): short description`

-   `type` → prefix (feat, fix, chore…)
-   `scope` (optional) → a specific area (auth, todos, client, server)
-   `short description` → a concise summary

Common commit types:

-   `feat`: — a new feature <br>
    `feat(auth): add login and register endpoints`
-   `fix`: — a bug fix <br>
    `fix(todos): correct filter for completed tasks`
-   `chore`: — maintenance work (dependencies, configs, migrations, not affecting app behavior) <br>
    `chore(server): setup prisma and add initial migration`
-   `refactor`: — code changes that don’t affect functionality (improve structure, readability) <br>
    `refactor(client): simplify TodoItem component`
-   `style`: — code style changes (eslint, prettier, formatting, \* but not CSS) <br>
    `style: format code with prettier`
-   `docs`: — documentation changes <br>
    `docs: update README with install instructions`
-   `test`: — add or fix tests <br>
    `test(auth): add unit tests for login service`
-   `build`: — changes to build system, CI/CD, or tooling (like Vite, Webpack) <br>
    `build(client): add tailwindcss and postcss config`
