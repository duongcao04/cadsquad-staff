# 🚀 Nextjs Sample Template

Welcome to **`nextjs-sample`**, a modern and extensible starter template for **Next.js 15** using **React 19**, **Tailwind CSS**, and essential tools for building fast, scalable, production-ready apps.

This template is built to help developers start faster with best practices, common utilities, and powerful packages already pre-configured.

---

## 📦 Tech Stack

This template includes:

- ✅ **Next.js 15.3.4** – App Router support, latest updates
- ⚛️ **React 19** – Concurrent rendering, improved performance
- 🎨 **Tailwind CSS** – Utility-first styling with `tailwind-merge` and `clsx`
- 🌐 **next-intl** – Built-in internationalization (i18n)
- 🧾 **Formik** + **Yup** – Form management and schema validation
- ✉️ **Nodemailer** – Backend email sending
- 🎞 **Motion** – Smooth animations
- 🧩 **Lucide React** – Icon system with React components
- 🧹 **Prettier Plugin** – Auto-sorted imports with `@trivago/prettier-plugin-sort-imports`

---

## 🛠️ How to Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/nextjs-sample.git
cd nextjs-sample
```

### 2. Install Dependencies

Choose your package manager:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Start the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then open http://localhost:3000 in your browser to view the app.

### 4. Start Editing

Open the main page:

```bash
app/page.tsx
```

Make changes, and they’ll reflect automatically thanks to hot reloading.

## 📁 Project Structure

```bash
.
├── src/
│   ├── app/            		  # App Router pages
│   ├── components/     		  # Shared and reusable UI components
│   ├── styles/         		  # Tailwind CSS and global styles
│   ├── fonts/         			  # App fonts
│   ├── validationSchemas/    # Validation schema with Yup
│   ├── lib/            		  # Business logic, API, DB, or framework-level code
│	  │   ├── utils.ts    		  # pure helper functions (e.g., string, number helpers)
│	  │   ├── auth.ts    			  # functions for session/user management
│	  │   ├── db.ts				      # db connection setup, Prisma client, etc.
│	  │   ├── motion.ts				  # motion wrapper tag config
│	  │   ├── api.ts				    # functions to call external/internal APIs
│	  │   └── formatDate.ts 	  # date formatting logic
│   └── i18n/           		  # i18n locale files for next-intl
├── public/             		  # Static assets
├── .prettierrc         		  # Prettier config with import sorting
└── package.json        		  # Dependencies and scripts
```

## 🔧 Configuration Highlights

Prettier (with sorted imports)

```json
"prettier": {
  "plugins": ["@trivago/prettier-plugin-sort-imports"],
  "importOrder": ["^react", "^next", "^[a-z]", "^@", "^[./]"],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true
}
```

Example Scripts

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```
