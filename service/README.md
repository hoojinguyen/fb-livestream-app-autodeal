# Installing

- Clone project:

  ```sh
      git init
      git remote add origin git@gitlab.com:kltn2/app-backend.git
      git fetch
      git checkout master
  ```

- Running with docker-compose:

  ```sh
      docker-compose up
  ```

- Connect with database (PostgreSQL)

  - Host: localhost
  - Database: db
  - UserName: user
  - Password: pass
  - Port: 35432

- Migration with Knex ORM:

  - Create a file migrate:

    ```sh
        docker-compose exec app knex migrate:make $name_file
    ```

  - Exec:

    ```sh
       docker-compose exec app knex migrate:latest
    ```

  - Rollback:

    ```sh
        docker-compose exec app knex migrate:rollback
    ```

  - Run Seed:

    ```sh
        docker-compose exec app knex seed:run
    ```

- Exec postgres to container:

  ```sh
      kubectl exec -ti postgres-0 -- psql -h 10.244.0.109 -U flad --password -p 5432 fladdb
  ```

- Run migration in container of k8s:
  ```sh
      kubectl exec --stdin --tty $name_pod_app -- /bin/bash
      npx knex migrate:latest
  ```

# Running

- API Graphql playground:
  ```sh
      http://localhost:1234/playground
  ```
- Fill HTTP HEADERS:
  `{ "authorization": "Bearer admin_token" }`

  > When start with docker-compose up, get admin_token on terminal

- Example query users:
  ```sh
      {
        users(first: 10){
        edges {
          node{
            name
            email
            role
            createdAt
            updatedAt
            deletedAt
            lastOnline
            profile {
              lastName
              firstName
            }
          }
        }
        }
      }
  ```
