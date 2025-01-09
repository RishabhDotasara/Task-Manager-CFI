# Setting Up Docker Compose for Contributors

Docker Compose is a tool for defining and running multi-container Docker applications. With Docker Compose, you can easily manage and configure your application's services.

## Prerequisites

Before starting Docker Compose, ensure you have the following installed:
- Docker Engine 🐳
- Docker Compose 📦

## Steps to Start Docker Compose

1. **Clone the Repository**
    ```sh
    git clone https://github.com/RishabhDotasara/Task-Manager-CFI.git
    cd Task-Manager-CFI
    ```

2. **Start the Containers**
    Use the following command to start your containers:
    ```sh
    docker-compose up
    ```

3. **Access the Application**
    Once the containers are up and running, you can access the application at `http://localhost:3000`.

## Common Commands

- **Start Services**: `docker-compose up`
- **Stop Services**: `docker-compose down`
- **Rebuild Services**: `docker-compose up --build`
- **View Logs**: `docker-compose logs`

By following these steps, contributors can easily start and run the application using Docker Compose.
