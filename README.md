## Routes

### Auth

| Method | Route           | Description          |
| ------ | --------------- | -------------------- |
| `POST` | `/auth/login`   | Login (public route) |
| `POST` | `/auth/refresh` | Refresh token        |
| `POST` | `/auth/logout`  | Logout refresh token |

### Users

| Method  | Route        | Description    |
| ------- | ------------ | -------------- |
| `GET`   | `/users`     | Get all users  |
| `GET`   | `/users/me`  | Get self       |
| `GET`   | `/users/:id` | Get user by id |
| `PATCH` | `/users/me`  | Update self    |
| `GET`   | `/users/:id` | Get user by id |

#### Admin only

| Method   | Route        | Description       |
| -------- | ------------ | ----------------- |
| `POST`   | `/users`     | Create user       |
| `PATCH`  | `/users/:id` | Update user by id |
| `DELETE` | `/users/:id` | Delete user by id |

### Profiles

| Method   | Route           | Description          |
| -------- | --------------- | -------------------- |
| `POST`   | `/profiles`     | Create profile       |
| `GET`    | `/profiles`     | Get all profiles     |
| `GET`    | `/profiles/:id` | Get profile by id    |
| `PATCH`  | `/profiles/:id` | Update profile by id |
| `DELETE` | `/profiles/:id` | Delete profile by id |

### Log

| Method   | Route        | Description                |
| -------- | ------------ | -------------------------- |
| `POST`   | `/log`       | Create qso                 |
| `POST`   | `/log/many`  | Create multiple qsos       |
| `GET`    | `/log/count` | Get qso count              |
| `GET`    | `/log`       | Get qsos (paginated)       |
| `GET`    | `/log/:id`   | Get qso by id              |
| `PATCH`  | `/log/:id`   | Update qso by id           |
| `DELETE` | `/log/:id`   | Delete qso by id           |
| `DELETE` | `/log`       | Delete multiple qsos by id |
