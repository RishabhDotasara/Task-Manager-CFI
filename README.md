# Teamify Project

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Introduction

**Teamify** is a team management platform developed by the **WebOps Club, IITM**. It is specifically designed to cater to the hierarchy and needs of **CFI**, our innovation hub. Teamify aims to simplify task organization and enhance team collaboration.

## Features

- 🌟 Seamlessly manage and organize tasks team-wise.
- 📅 Add session schedules for better planning(coming soon!).
- 🗳️ Polling feature (coming soon!).
- 🚀 Built for innovation hubs like CFI.
## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

```plaintext
DATABASE_URL=postgresql://admin:admin@localhost:5432/postgres
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```
## Technologies Used

- 🛠️ **Next.js**: The React framework for building user interfaces.
- 🔑 **NextAuth**: Secure and flexible authentication.
- 📦 **Prisma**: ORM for database management.
- 🐘 **PostgreSQL**: Database for storing application data.

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/RishabhDotasara/Task-Manager-CFI.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Task-Manager-CFI
   ```
3. Start a PostgreSQL container locally for convenient development:
   ```bash
   docker run --name postgres -e POSTGRES_USERNAME=admin -e POSTGRES_PASSWORD=admin -p 5432:5432 -d postgres
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Apply Prisma migrations:
   ```bash
   npx prisma migrate dev --name "init"
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

## Docker Setup

For detailed instructions on setting up Docker Compose, please refer to the [Docker Setup Guide](./contributing/dockerSetup.md).


## Usage

Use **Teamify** to manage your team’s tasks and schedules efficiently. Features like polling and advanced scheduling will be available in future updates. Simply log in using the secure authentication system and start organizing your team.

## Contributing

We welcome contributions from the community! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Submit a pull request.

## License

This project is licensed under the [MIT LICENSE](./LICENSE.md) license. See the LICENSE file for details.

## Acknowledgments

- Developed by **WebOps Club, IITM**.
- Special thanks to the **CFI community** and contributors.
- Inspired by the need for effective team management within innovation hub.
