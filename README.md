# Backend - Challenge API Documentation

# To start
1. Open your terminal and make sure you're in the backend-challenge folder.
2. Run `npm i` command to install all dependencies.
4. Add a `.env` file in the root.
5. Add the `MONGO_URI` connection string I provided in the email & your `JWT_SECRET` to the .env
7. Run `npm start` to start your server.

# User Registration & Login API
I added the ability to register a user and to use those credentials to login. 

The register endpoint is http://localhost:8080/api/users/register (POST)

The login endpoint is http://localhost:8080/api/users/login (POST)

The request body must include `email` and `password`.

Example -> `{ "email": "test@test.com", "password": "1234" }`.

A successful response will show a status code of `200` and include a user object with id, a hashed password, 

email and a token that can be added in the authorization headers in the organization routes that require authentication. 

Unsuccessful responses will show a status code of `401` with a message of `User not found` or `Invalid password`.


# Organization Api

### Authentication

All routes, except the two GET methods (`GET /api/organizations` and `GET /api/organizations/:id`), require authentication. You must log in and attach the bearer token to the headers when making requests to the create, update, and delete endpoints.

## Endpoints

### Get All Organizations

- **URL:** `GET /api/organizations`
- **Description:** Retrieves all organizations.
- **Testing:** Send a GET request to the endpoint URL with appropriate authentication headers.
- **Success Response (Status Code 200):** 
  ```json
  [
    {
      "_id": "611f0b2929f37b001bd5b786",
      "name": "Example Organization 1",
      "addresses": [
        {
          "street": "123 Main St",
          "city": "Anytown",
          "state": "CA",
          "zip": "12345",
          "country": "USA"
        },
        ...
      ],
      "__v": 0
    },
    {
      "_id": "611f0b2929f37b001bd5b787",
      "name": "Example Organization 2",
      "addresses": [
        {
          "street": "456 Elm St",
          "city": "Othertown",
          "state": "NY",
          "zip": "67890",
          "country": "USA"
        },
        ...
      ],
      "__v": 0
    }
  ]

- **Error Responses:**
- Status Code 404 (Organization Not Found)
- Status Code 500 (Internal Server Error)


### Get by ID

- **URL:** `GET /api/organizations/:id`
- **Description:** Retrieves an organization by ID. You can also provide query parameters to filter the organization's addresses.
- **Request Params:**
  - `id`: The ID of the organization to retrieve.
- **Query Parameters (Optional):**
  - `city`: Filter organizations by city.
  - `state`: Filter organizations by state.
  - `zip`: Filter organizations by ZIP code.
  - `country`: Filter organizations by country.
- **Example URL with Query Parameters:** `GET /api/organizations/611f0b2929f37b001bd5b786?city=Example%20City&state=Example%20State`
- **Response (Success):** 
  ```json
  {
    "_id": "611f0b2929f37b001bd5b786",
    "name": "Example Organization",
    "addresses": [
      {
        "_id": "611f0b2929f37b001bd5b787",
        "street": "123 Example St",
        "city": "Example City",
        "state": "Example State",
        "zip": "12345",
        "country": "Example Country"
      },
      {
        "_id": "611f0b2929f37b001bd5b788",
        "street": "456 Example St",
        "city": "Example City",
        "state": "Example State",
        "zip": "54321",
        "country": "Example Country"
      }
    ],
    "__v": 0
  }
- **NOTE** A success response from a request with query param will be an array or orgaizations.
- Response (Error):
Status Code 404 (Organization Not Found) or 500 (Internal Server Error)

### Create Organization

- **URL:** `POST /api/organizations`
- **Description:** Creates a new organization.
- **Authentication Required:** Yes (Attach Bearer token to headers)
- **Request Body:** JSON object representing the organization data. 
  ```json
  {
    "name": "Example Organization",
    "addresses": [
      {
        "street": "123 Example St",
        "city": "Example City",
        "state": "Example State",
        "zip": "12345",
        "country": "Example Country"
      }
    ]
  }


- **Response (Success):**
Status Code 201
  ```json
  {
    "_id": "611f0b2929f37b001bd5b786",
    "name": "Example Organization",
    "addresses": [
      {
        "_id": "611f0b2929f37b001bd5b787",
        "street": "123 Example St",
        "city": "Example City",
        "state": "Example State",
        "zip": "12345",
        "country": "Example Country"
      }
    ],
    "__v": 0
  }

- **Response (Error):**
Status Code 400 (Validation Error) or 500 (Internal Server Error)

### Update Organization

- **URL:** `PUT /api/organizations/:id`
- **Description:** Updates an existing organization by ID.
- **Authentication Required:** Yes (Attach Bearer token to headers)
- **Request Params:** 
  - `id`: The ID of the organization to update.
- **Request Body:** JSON object representing the updated organization data. 
  ```json
  {
    "city": "your new city",
  }

- **Response (Success):**
Status Code 200
  ```json
  {
    "_id": "611f0b2929f37b001bd5b786",
    "name": "Updated Organization Name",
    "addresses": [
      {
        "_id": "611f0b2929f37b001bd5b787",
        "street": "Updated Street Address",
        "city": "your new city",
        "state": "Updated State",
        "zip": "54321",
        "country": "Updated Country"
      }
    ],
    "__v": 0
  }


- **Response (Error):**
Status Code 404 (Organization Not Found) or 500 (Internal Server Error)


### Delete Organization

- **URL:** `DELETE /api/organizations/:id`
- **Description:** Deletes an organization by ID.
- **Authentication Required:** Yes (Attach Bearer token to headers)
- **Request Params:** 
  - `id`: The ID of the organization to delete.
- **Response (Success):** 
  - Status Code 204 (No Content)
- **Response (Error):** 
  - Status Code 404 (Organization Not Found) or 500 (Internal Server Error)


## Testing
- I added Mocha testing that can be found inside the **Test** folder located in the root of the project folder.
- The file is called **organizationController.mjs**.
- Use the command `npm run test` or `npm test` to run the test file.
