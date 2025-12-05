# 11/20 Define the simple layout od the web
Previously I ran `flask run` to have a url that can render html. 
However, I don't know how react works in thicase because I am not returning html with `render_template` anymore as in cs50.

Modern web apps separate:

Backend = API that returns JSON, which are data

Frontend = React app that renders HTML in the browser

FastAPI is NOT responsible for your UI.

React is.

### Development Style
Basically, it is just different styles of developing a web application
- Approach A — Server-Rendered Web App (Flask/Jinja, Django, Rails, etc.)
✔ Advantages
1. Very simple architecture

Only one server, one codebase.

2. Easier to deploy

Upload, run gunicorn/uwsgi. Done.

3. No complicated frontend build

HTML templates + CSS.

4. SEO friendly

Great for blogs, portfolios, documentation sites.

5. Less JavaScript needed

Backend can generate everything.

6. Very fast to prototype

A full CRUD app can be built quickly.

❌ Disadvantages
1. Hard to build highly interactive UI

Autosave, instant filtering, live updating lists, drag & drop → all painful.

2. Frontend becomes messy

JS in templates, jQuery spaghetti.

3. Limited reactivity

Whenever data changes, page must reload.

4. Backend becomes too heavy

Backend does:

HTML templating

session management

API

view logic

forms

Everything mixed together.

5. Not suitable for mobile apps

You cannot reuse code for iOS / Android.

2. Approach B — SPA + API (React + FastAPI)

✔ Advantages
1. Modern, interactive UI

Perfect for:

autosave

dynamic lists

filtering

modals

real-time UI

dashboards

2. Separation of concerns

Backend = data and logic
Frontend = UI and UX

Cleaner long-term architecture.

3. Easier scaling

Backend and frontend deploy independently.

4. Mobile-ready

Backend API can be reused by mobile apps.

5. Better developer experience

React gives powerful component structure.

6. Better performance for dynamic apps

Only data loads, not entire pages.

❌ Disadvantages
1. More moving parts

You now have:

React dev server

FastAPI server

CORS

bundlers (Vite)

npm

routing issues

2. More complex deployment

You need:

a place for the backend

a place for the frontend static files

3. More initial setup

You have to configure:

API routes

client-side routing

state management

fetch logic

##  what is npm and vite
Great — this is a perfect moment to build a clear mental model of how modern web apps work.
CS50 teaches classic web apps (Flask + server-rendered HTML).
React, Vite, npm, and modern tooling are part of the modern web development ecosystem.

Let’s place npm and Vite in the bigger picture so you fully understand what role they play.

🌐 First: What is a Web App (High-Level Architecture)?

There are two major architectures:

⭐ 1. Traditional Server-Rendered Web Apps

(What CS50 taught: Flask + Jinja)

- Browser requests a URL

- backend returns HTML directly

- browser displays the HTML
```
Browser → Flask → HTML → Browser
```
Backend handles:

HTML

Templates

Forms

Cookies

Sessions

Database

Routing

Everything lives on the backend.

⭐ 2. Modern Web Apps: SPA + API

(What you’re building: React + FastAPI)

Frontend renders UI in the browser

Frontend requests JSON, not HTML

Backend is purely API (data)
```Browser (React)  ←→  API (FastAPI)
```
Frontend handles:

UI

Routing

State

User actions

Backend handles:

Data

Business logic

Database

API endpoints

To build modern frontends you need tools.
That’s where npm and Vite come in.

⭐ What is npm?
npm = Node Package Manager

Think of it as:

✔ pip, but for JavaScript

pip → used to install Python packages

npm → used to install JavaScript packages

Everything React uses is installed via npm.

For example:
```npm install react
npm install axios
npm install tailwindcss
```
npm also:

runs scripts (npm run dev, npm run build)

downloads dependencies into node_modules

keeps versions tracked in package.json

You can think of npm as the package ecosystem for JavaScript + frontend tools.

⭐ What is Vite?

Vite is a modern frontend tooling system.

It does 3 major things:

1️⃣ Development Server

When you run:
```
npm run dev
Vite starts a fast server at:
http://localhost:5173

and automatically updates your UI when you save files
("hot module reload").

This is your “view the webpage” equivalent of:
flask run → http://localhost:5000
```
But for React.
2️⃣ Build Tool

Vite bundles your frontend code into optimized static files:
```
npm run build
producing:
dist/
  index.html
  assets/
```
These files are what eventually get deployed to production.

React code → HTML/CSS/JS bundle.

3️⃣ Compiler for modern JavaScript + TypeScript

Vite:

transpiles TypeScript

bundles JSX

loads modules

compiles imports

optimizes performance

Browsers cannot run .tsx → Vite transforms everything into browser-compatible JavaScript.

⭐ How do npm and Vite relate to React?
✔ npm = manages dependencies (React, libraries, tooling)
✔ Vite = runs your project, builds your UI, compiles TS/JS
✔ React = your UI framework

Together they form the frontend dev environment:
```
React code → compiled by Vite → served to browser
npm → manages dependencies used by both
```
⭐ How do npm + Vite fit into your development?

Here is your architecture:

```
Frontend:
    React + TypeScript + Vite + npm
Backend:
    FastAPI + SQLAlchemy + SQLite/Postgres
```
Flow:

Write React components in .tsx

Vite compiles + hot-reloads

Browser shows the UI at localhost:5173

UI sends API calls to FastAPI at localhost:8000

You test UI → backend → DB → UI flow

When done, Vite builds dist/ folder for deployment

Backend hosting + frontend hosting (Docker or separate)

⭐ Summary: In one sentence
🔥 **npm installs & manages JavaScript dependencies.

Vite runs & builds your React frontend.
FastAPI serves your backend API.**

This is the modern, scalable architecture for web apps.

Because react uses jsx, I think is different from javascript ? 
It needs to be compiled so in html it uses babel (as in cs50)
and in our stuff we use vite.

### Begin
So now you know that the structure is not just backend + html because the backend doesn't respond the html files anymore. 

So I should run a React + TS app but before that you have to run commands to create a react project

#### Install 
Don't use ubuntu's apt package manager to install npm
Remove them if you accidentally installed them because it will conflict when you install the new ones with the following instruction.
```
sudo apt install curl -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v

## Then create 
npm create vite@latest . -- --template react-ts

```



## Folder structure 
 Assume a frontend/ folder after scaffolding:

- package.json: scripts (dev, build, lint), dependencies. You’ll edit this rarely (add deps).
- vite.config.ts: Vite build config; usually leave it alone unless you need aliases or plugins.
- tsconfig.json / tsconfig.app.json: TypeScript settings; minor tweaks for paths or strictness.
- public/: static assets (favicons, logos). Rarely touched.
- src/ (where you’ll work):
    - main.tsx: entry point; renders <App /> into the DOM. Almost never touched beyond initial setup.
    - App.tsx: root component; often minimal router/layouter. Sometimes you adjust providers here.
    - pages/: route-level screens (e.g., PurchasePage.tsx).
    - components/: reusable UI pieces (e.g., PurchaseForm.tsx, LineItemRow.tsx).
    - hooks/: custom hooks (e.g., useDebouncedSave.ts).
    - lib/ or api/: API client helpers (fetch wrappers, base URLs).
    - types/: shared TypeScript types for requests/responses.
    - styles/: global CSS, design tokens, or CSS modules.
    - Optional: .eslintrc*, .prettierrc*: lint/format rules; usually no daily edits.
Essential for you to develop right now:

- src/App.tsx: wire your layout and routes.
- src/pages/*: build your screens.
- src/components/*: build forms/controls.
- src/hooks/useDebouncedSave.ts (or similar): your autosave logic.
- src/lib/api.ts: define patchPurchase, patchExpense, etc.
Most other files are build tooling and rarely changed. Focus on src/** plus adding dependencies in package.json when needed.

## Webpage Components

1. Sidebar 
2. MainLayout
3. Purchase List
4. Purchase Card
5. AddPurchaseCard
> ---------------------------------------------------------
> |  Sidebar (Navigation)  |       Main Workspace         |
> |                        |                               |
> |                       |   Page Header (optional)      |
> |                       |                               |
> |                       |   Main Blocks Area            |
> |                       |   - Purchase Blocks           |
> |                       |   - Add Purchase Block        |
> |                       |                               |
> ---------------------------------------------------------

# 11/28 

# 12/5
