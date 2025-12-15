# Cadsquad Staff Platform

## Description

This project is a full-stack web application designed for Cadsquad's internal staff. It provides a comprehensive platform for managing jobs, user accounts, notifications, and other core business operations. The system consists of a modern, reactive frontend built with Next.js and a robust backend API powered by Nest.js.

**Main Features:**

* **Job Management:** Create, update, and track jobs with different statuses and types.
* **User Authentication:** Secure login and role-based access control.
* **Real-time Notifications:** Keep users informed about important events.
* **Internationalization (i18n):** Support for multiple languages (English and Vietnamese).
* **File Uploads:** Functionality for handling file storage and management.

## Tech Stack

The project is built with a modern technology stack:

* **Frontend (Client):**
  * **Framework:** [Next.js](https://nextjs.org/) (using App Router)
  * **Language:** [TypeScript](https://www.typescriptlang.org/)
  * **Styling:** [Tailwind CSS](https://tailwindcss.com/)
  * **UI Components:** Custom components, potentially using a library like Shadcn/UI or similar.
  * **State Management:** [Zustand](https://github.com/pmndrs/zustand)
  * **Data Fetching:** TanStack Query (`@tanstack/react-query`)
  * **HTTP Client:** [Axios](https://axios-http.com/)
* **Backend (Server):**
  * **Framework:** [Nest.js](https://nestjs.com/)
  * **Language:** [TypeScript](https://www.typescriptlang.org/)
  * **ORM:** [Prisma](https://www.prisma.io/)
  * **Containerization:** [Docker](https://www.docker.com/)
* **Database:**
  * The database is managed by Prisma. The specific database (e.g., PostgreSQL, MySQL) is defined in the `prisma/schema.prisma` file.
* **Package Manager:**
  * [Bun](https://bun.sh/) or [NPM](https://www.npmjs.com/)

## Installation Guide

Follow these steps to set up the project locally.

1. **Clone the Repository**

    ```bash
    git clone <your-repository-url>
    cd next-cadsquad-staff
    ```

2. **Set Up the Backend Server**

    ```bash
    # Navigate to the server directory
    cd server

    # Install dependencies
    npm install
    # or
    bun install

    # Create a .env file from the example
    cp .env.example .env
    ```

    Next, open the `server/.env` file and fill in the required environment variables, especially the `DATABASE_URL`.

3. **Run Database Migrations**
    With the server's `.env` file configured, run the Prisma migrations to set up your database schema.

    ```bash
    # From the server/ directory
    npx prisma migrate dev
    ```

4. **Set Up the Frontend Client**

    ```bash
    # Navigate to the client directory from the root
    cd client

    # Install dependencies
    npm install
    # or
    bun install

    # Create a local environment file
    cp .env.development .env.local
    ```

    Open `client/.env.local` and set the `NEXT_PUBLIC_API_URL` to point to your local backend server (e.g., `http://localhost:3001`).

## Usage

To run the application, you need to start both the backend and frontend servers.

* **Run the Backend (Development Mode)**

    ```bash
    # In the server/ directory
    npm run start:dev
    ```

    The server will start, typically on `http://localhost:3001`.

* **Run the Frontend (Development Mode)**

    ```bash
    # In the client/ directory
    npm run dev
    ```

    The frontend development server will start, typically on `http://localhost:3000`.

## Configuration

Environment variables are crucial for configuring the application.

* **`server/.env`**: Contains backend-specific variables, including:
  * `DATABASE_URL`: The connection string for your database.
  * `JWT_SECRET`: Secret key for signing JSON Web Tokens.
  * Other API keys and service credentials.
* **`client/.env.local`**: Contains frontend-specific variables, including:
  * `NEXT_PUBLIC_API_URL`: The public URL of the backend API.

## Folder Structure

The project is a monorepo with two main packages: `client` and `server`.

```bash
/
├── client/         # Next.js frontend application
│   ├── src/
│   │   ├── app/        # Next.js App Router pages, layouts, and route handlers
│   │   ├── lib/        # Core libraries, helpers, and configurations (Axios, Prisma Client)
│   │   ├── queries/    # React Query hooks for data fetching
│   │   ├── components/ # Shared React components
│   │   └── ...
│   ├── prisma/         # Prisma schema and generated client for type safety
│   └── public/         # Static assets (images, fonts)
│
└── server/         # Nest.js backend application
    ├── src/
    │   ├── modules/    # Business logic organized by feature (Auth, Job, User, etc.)
    │   ├── common/     # Shared decorators, interceptors, and exceptions
    │   └── main.ts     # Application entry point
    └── prisma/         # Prisma schema, migrations, and seed scripts
```

## Contributing

We welcome contributions! If you'd like to contribute, please follow these guidelines:

1. Fork the repository.
2. Create a new branch for your feature or bug fix (`git checkout -b feature/my-new-feature`).
3. Make your changes and commit them with a clear message.
4. Push your branch to your fork (`git push origin feature/my-new-feature`).
5. Open a pull request against the `main` branch of the original repository.

## License

This project is licensed under the terms specified in the `LICENSE.md` file.

## Contact Info

For questions, support, or other inquiries, please contact the development team at `[ch.duong@cadsquad.vn]`.
