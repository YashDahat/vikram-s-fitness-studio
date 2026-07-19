# Feature Enrichment — Attempt 1

Generated: 2026-07-19

Each section is one LLM call (~5–8K tokens). The instruction tells the generator how all files in the feature interact and what contracts they must honour.

---

## Shared Backend

**Name:** `shared-backend`  
**Type:** SHARED  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/vikramsfitnessstudio/model/User.java` — MODEL layer — defines the User entity for persistence, including authentication details and roles.
- `backend/src/main/java/com/vikramsfitnessstudio/model/Role.java` — MODEL layer — defines an enumeration for user roles within the application.
- `backend/src/main/java/com/vikramsfitnessstudio/repository/UserRepository.java` — REPOSITORY layer — provides data access methods for User entities, including finding by username.
- `backend/src/main/java/com/vikramsfitnessstudio/util/JwtUtil.java` — UTIL layer — provides utility methods for JWT generation, validation, and parsing.
- `backend/src/main/java/com/vikramsfitnessstudio/security/JwtAuthFilter.java` — CONFIG layer — Spring Security filter for JWT authentication, intercepting requests to validate tokens.
- `backend/src/main/java/com/vikramsfitnessstudio/config/SecurityConfig.java` — CONFIG layer — configures Spring Security, including the filter chain, password encoder, and authentication manager.
- `backend/src/main/java/com/vikramsfitnessstudio/controller/SpaController.java` — CONTROLLER layer — forwards all non-API requests to the frontend's index.html for client-side routing.
- `backend/src/main/java/com/vikramsfitnessstudio/config/AdminInitializer.java` — CONFIG layer — creates a default admin user on application startup if one does not already exist.
- `backend/src/main/java/com/vikramsfitnessstudio/config/DataSeeder.java` — CONFIG layer — populates the database with initial sample data for development and demonstration.
- `backend/src/main/java/com/vikramsfitnessstudio/exception/GlobalExceptionHandler.java` — EXCEPTION layer — provides centralized exception handling for the application, returning consistent error responses.
- `backend/src/main/java/com/vikramsfitnessstudio/dto/ErrorResponse.java` — DTO layer — defines the standard structure for API error responses.
- `backend/src/main/java/com/vikramsfitnessstudio/exception/ResourceNotFoundException.java` — EXCEPTION layer — custom exception for indicating that a requested resource was not found.

**Feature Instruction:**

This `shared-backend` feature provides foundational components and configurations for the entire Vikram's Fitness Studio backend application. It includes core models for `User` and `Role`, a `UserRepository` for data access, JWT utility for authentication, Spring Security configurations, a `SpaController` for single-page application routing, initial data seeding, and global exception handling. These components are essential for user management, security, and overall application structure.

### User and Role Management

`User.java` defines the `User` entity with fields such as `id`, `username`, `password`, `email`, and `roles`. It is mapped to the `users` table in the database. `Role.java` is an enum defining `ADMIN` and `MEMBER` roles, which are associated with `User` entities. `UserRepository.java` extends `JpaRepository` and provides standard CRUD operations for `User` entities, along with a custom method `findByUsername(String username)` to retrieve a user by their username.

### Security Configuration

`JwtUtil.java` is responsible for generating, validating, and extracting information from JWTs. It provides methods like `generateToken(String username)`, `validateToken(String token, UserDetails userDetails)`, and `extractUsername(String token)`. This utility is crucial for securing API endpoints.

`JwtAuthFilter.java` is a custom Spring Security filter that intercepts incoming requests. It extracts the JWT from the `Authorization` header, validates it using `JwtUtil`, and sets the authentication context for the request. This filter is integrated into the Spring Security filter chain.

`SecurityConfig.java` configures the Spring Security filter chain. It defines which endpoints are public, authenticated, or admin-only. It also configures the `PasswordEncoder` (using `BCryptPasswordEncoder`) and the `AuthenticationManager`. The `JwtAuthFilter` is added to the security filter chain to ensure JWT-based authentication.

### Application Initialization and Data Seeding

`AdminInitializer.java` is an `@Component` that runs on application startup. It checks if an admin user exists in the database. If not, it creates a default admin user with a predefined username and password, assigning them the `ADMIN` role. This ensures that there's always an admin account available for initial setup.

`DataSeeder.java` is an `@Component` that populates the database with initial sample data for development and demonstration purposes. This can include default membership plans, fitness classes, or other relevant data for the application.

### SPA Routing and Global Exception Handling

`SpaController.java` is a `@Controller` that handles all non-API requests by forwarding them to `index.html`. This enables client-side routing for the React single-page application, ensuring that direct access to frontend routes works correctly.

`ErrorResponse.java` is a DTO that defines a standard structure for API error responses, including fields like `timestamp`, `status`, `error`, and `message`. This ensures consistent error reporting across the API.

`ResourceNotFoundException.java` is a custom exception class extending `RuntimeException`, used to indicate that a requested resource could not be found. This exception is typically thrown by services when an entity is not found by its ID or other criteria.

`GlobalExceptionHandler.java` is an `@ControllerAdvice` that provides centralized exception handling for the application. It contains `@ExceptionHandler` methods to catch specific exceptions (e.g., `ResourceNotFoundException`, `MethodArgumentNotValidException`) and return a consistent `ErrorResponse` with appropriate HTTP status codes. For `ResourceNotFoundException`, it returns a `404 Not Found` status. For other generic exceptions, it returns a `500 Internal Server Error`.

---

## Authentication (Backend)

**Name:** `authentication-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/vikramsfitnessstudio/service/UserService.java` — SERVICE layer — implements registerUser(RegisterRequest): AuthResponse and authenticateUser(AuthRequest): AuthResponse; delegates persistence to UserRepository and token generation to JwtUtil.
- `backend/src/main/java/com/vikramsfitnessstudio/controller/AuthController.java` — CONTROLLER layer — exposes /api/v1/auth/register (POST) and /api/v1/auth/login (POST) endpoints for user authentication and registration.
- `backend/src/main/java/com/vikramsfitnessstudio/dto/AuthRequest.java` — DTO — defines the structure for user login requests.
- `backend/src/main/java/com/vikramsfitnessstudio/dto/AuthResponse.java` — DTO — defines the structure for authentication responses, containing the JWT.
- `backend/src/main/java/com/vikramsfitnessstudio/dto/RegisterRequest.java` — DTO — defines the structure for user registration requests.

**Feature Instruction:**

The Authentication (Backend) feature provides the core API endpoints for user registration and login. It integrates with the `shared-backend` feature for user persistence via `UserRepository` and JWT token generation/validation via `JwtUtil`. 

`AuthController` exposes two public endpoints: `/api/v1/auth/register` for new user registration and `/api/v1/auth/login` for user authentication. Both endpoints consume DTOs (`RegisterRequest` and `AuthRequest` respectively) and return an `AuthResponse` containing a JWT token upon successful operation.

`UserService` encapsulates the business logic for user management. When a user registers, `UserService.registerUser` creates a new `User` entity, encrypts the password, and saves it using `UserRepository.save`. During login, `UserService.authenticateUser` verifies the provided credentials against the stored user data and, if valid, generates a JWT using `JwtUtil.generateToken`.

Error Handling: If a username already exists during registration, `UserService.registerUser` should throw an `IllegalArgumentException`. If authentication fails (e.g., invalid username or password), `UserService.authenticateUser` should throw an `IllegalArgumentException`. These exceptions will be caught by the `GlobalExceptionHandler` (from `shared-backend`) and translated into appropriate HTTP responses (e.g., 400 Bad Request or 401 Unauthorized).

---

## Membership Management (Core)

**Name:** `membership-core`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/vikramsfitnessstudio/model/MembershipPlan.java` — MODEL layer — defines the data structure for a purchasable membership plan.
- `backend/src/main/java/com/vikramsfitnessstudio/model/Membership.java` — MODEL layer — defines the data structure for a user's active membership subscription.
- `backend/src/main/java/com/vikramsfitnessstudio/model/MembershipStatus.java` — MODEL layer — defines the enumeration for membership statuses.
- `backend/src/main/java/com/vikramsfitnessstudio/repository/MembershipPlanRepository.java` — REPOSITORY layer — provides data access methods for MembershipPlan entities, including `findByIsActiveTrue()`.
- `backend/src/main/java/com/vikramsfitnessstudio/repository/MembershipRepository.java` — REPOSITORY layer — provides data access methods for Membership entities, including `findByUserId(Long userId)` and `findByUserIdAndStatus(Long userId, MembershipStatus status)`.
- `backend/src/main/java/com/vikramsfitnessstudio/service/MembershipService.java` — SERVICE layer — implements `createMembershipPlan(MembershipPlan membershipPlan)`, `updateMembershipPlan(UUID id, MembershipPlan membershipPlanDetails)`, `deleteMembershipPlan(UUID id)`, `getAllMembershipPlans()`, `getMembershipPlanById(UUID id)`, `assignMembershipToUser(Long userId, UUID planId)`, `updateMembershipStatus(UUID membershipId, MembershipStatus newStatus)`, and `getUserMemberships(Long userId)`.

**Feature Instruction:**

This feature, Membership Management (Core), is responsible for defining the core data models and persistence logic for membership plans and user memberships within Vikram's Fitness Studio. It includes the `MembershipPlan` and `Membership` entities, the `MembershipStatus` enumeration, and their corresponding Spring Data JPA repositories (`MembershipPlanRepository` and `MembershipRepository`). The `MembershipService` class encapsulates the business logic for managing membership plans (e.g., creating, updating, retrieving) and user memberships (e.g., assigning, updating status). This feature interacts with the `shared-backend` feature to access `User` entities for associating memberships with specific users. The `MembershipService` will expose methods for other features, such as `membership-api` and `order-processing-backend`, to interact with membership data. For example, `membership-api` will call `MembershipService.getAllMembershipPlans()` to display available plans, and `order-processing-backend` will call `MembershipService.assignMembershipToUser(Long userId, Long planId)` upon successful order completion.

### MembershipPlan.java
This JPA entity represents a purchasable membership plan. It will have fields for `id` (UUID), `name` (String), `description` (String), `price` (BigDecimal), `durationInMonths` (Integer), and `isActive` (Boolean). The `name` must be unique and not null. `price` must be positive. `durationInMonths` must be a positive integer.

### Membership.java
This JPA entity represents an active membership subscription for a specific user. It will have fields for `id` (UUID), `user` (ManyToOne relationship with `User` from `shared-backend`), `membershipPlan` (ManyToOne relationship with `MembershipPlan`), `startDate` (LocalDate), `endDate` (LocalDate), and `status` (EnumType.STRING for `MembershipStatus`). The `user` and `membershipPlan` fields are mandatory. `startDate` and `endDate` must be valid dates, with `endDate` after `startDate`.

### MembershipStatus.java
This enum defines the possible states of a user's membership: `ACTIVE`, `EXPIRED`, `CANCELLED`.

### MembershipPlanRepository.java
This repository extends `JpaRepository<MembershipPlan, UUID>` and provides standard CRUD operations for `MembershipPlan` entities. It will also include a custom query method `findByIsActiveTrue()` to retrieve all currently active membership plans.

### MembershipRepository.java
This repository extends `JpaRepository<Membership, UUID>` and provides standard CRUD operations for `Membership` entities. It will include custom query methods such as `findByUserId(Long userId)` to retrieve all memberships for a given user, and `findByUserIdAndStatus(Long userId, MembershipStatus status)` to find memberships by user and status.

### MembershipService.java
This service class will be responsible for the following public methods:

1.  `MembershipPlan createMembershipPlan(MembershipPlan membershipPlan)`:
    -   **Signature:** `MembershipPlan createMembershipPlan(MembershipPlan membershipPlan)`
    -   **Logic:**
        1.  Validate that the `membershipPlan` object is not null and its `name` is unique.
        2.  Set `isActive` to `true` by default.
        3.  Save the new `membershipPlan` using `membershipPlanRepository.save()`.
        4.  Return the saved `MembershipPlan`.
    -   **Error Cases:** Throws `IllegalArgumentException` if the plan name already exists or if validation fails (HTTP 400).

2.  `MembershipPlan updateMembershipPlan(UUID id, MembershipPlan membershipPlanDetails)`:
    -   **Signature:** `MembershipPlan updateMembershipPlan(UUID id, MembershipPlan membershipPlanDetails)`
    -   **Logic:**
        1.  Find the existing `MembershipPlan` by `id` using `membershipPlanRepository.findById()`. If not found, throw `ResourceNotFoundException`.
        2.  Update the fields of the existing plan with `membershipPlanDetails` (name, description, price, durationInMonths, isActive).
        3.  Save the updated `MembershipPlan` using `membershipPlanRepository.save()`.
        4.  Return the updated `MembershipPlan`.
    -   **Error Cases:** Throws `ResourceNotFoundException` if the plan is not found (HTTP 404), `IllegalArgumentException` if validation fails (HTTP 400).

3.  `void deleteMembershipPlan(UUID id)`:
    -   **Signature:** `void deleteMembershipPlan(UUID id)`
    -   **Logic:**
        1.  Check if the `MembershipPlan` exists by `id` using `membershipPlanRepository.existsById()`. If not, throw `ResourceNotFoundException`.
        2.  Delete the `MembershipPlan` using `membershipPlanRepository.deleteById()`.
    -   **Error Cases:** Throws `ResourceNotFoundException` if the plan is not found (HTTP 404).

4.  `List<MembershipPlan> getAllMembershipPlans()`:
    -   **Signature:** `List<MembershipPlan> getAllMembershipPlans()`
    -   **Logic:**
        1.  Retrieve all `MembershipPlan` entities using `membershipPlanRepository.findAll()`.
        2.  Return the list of plans.

5.  `MembershipPlan getMembershipPlanById(UUID id)`:
    -   **Signature:** `MembershipPlan getMembershipPlanById(UUID id)`
    -   **Logic:**
        1.  Find the `MembershipPlan` by `id` using `membershipPlanRepository.findById()`.
        2.  Return the `MembershipPlan` if found, otherwise throw `ResourceNotFoundException`.
    -   **Error Cases:** Throws `ResourceNotFoundException` if the plan is not found (HTTP 404).

6.  `Membership assignMembershipToUser(Long userId, UUID planId)`:
    -   **Signature:** `Membership assignMembershipToUser(Long userId, UUID planId)`
    -   **Logic:**
        1.  Retrieve `User` by `userId` from `userRepository.findById(userId)` (from `shared-backend`). If not found, throw `ResourceNotFoundException`.
        2.  Retrieve `MembershipPlan` by `planId` using `membershipPlanRepository.findById(planId)`. If not found, throw `ResourceNotFoundException`.
        3.  Calculate `startDate` as `LocalDate.now()` and `endDate` by adding `durationInMonths` to `startDate`.
        4.  Create a new `Membership` entity, setting `user`, `membershipPlan`, `startDate`, `endDate`, and `status` to `ACTIVE`.
        5.  Save the new `Membership` using `membershipRepository.save()`.
        6.  Return the newly created `Membership`.
    -   **Error Cases:** Throws `ResourceNotFoundException` if user or plan not found (HTTP 404), `IllegalStateException` if the user already has an active membership for the same plan (HTTP 409).

7.  `Membership updateMembershipStatus(UUID membershipId, MembershipStatus newStatus)`:
    -   **Signature:** `Membership updateMembershipStatus(UUID membershipId, MembershipStatus newStatus)`
    -   **Logic:**
        1.  Find the existing `Membership` by `membershipId` using `membershipRepository.findById()`. If not found, throw `ResourceNotFoundException`.
        2.  Update the `status` of the `Membership` to `newStatus`.
        3.  Save the updated `Membership` using `membershipRepository.save()`.
        4.  Return the updated `Membership`.
    -   **Error Cases:** Throws `ResourceNotFoundException` if membership not found (HTTP 404), `IllegalArgumentException` if `newStatus` is invalid for the current state (HTTP 400).

8.  `List<Membership> getUserMemberships(Long userId)`:
    -   **Signature:** `List<Membership> getUserMemberships(Long userId)`
    -   **Logic:**
        1.  Retrieve `User` by `userId` from `userRepository.findById(userId)` (from `shared-backend`). If not found, throw `ResourceNotFoundException`.
        2.  Retrieve all `Membership` entities for the given `userId` using `membershipRepository.findByUserId(userId)`.
        3.  Return the list of memberships.
    -   **Error Cases:** Throws `ResourceNotFoundException` if user not found (HTTP 404).

This feature relies on `UserRepository` from `shared-backend` to fetch `User` entities when assigning or retrieving user-specific memberships. It does not expose any direct API endpoints; these will be handled by the `membership-api` feature, which will inject `MembershipService`.

---

## Membership Management (API)

**Name:** `membership-api`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/vikramsfitnessstudio/controller/MembershipController.java` — CONTROLLER layer — exposes public endpoints for fetching active membership plans via `getMembershipPlans()` and authenticated endpoints for users to view their own memberships via `getUserMemberships(Principal principal)`.
- `backend/src/main/java/com/vikramsfitnessstudio/controller/admin/AdminMembershipPlanController.java` — CONTROLLER layer — provides admin-only CRUD endpoints for managing membership plans via `getAllMembershipPlans()`, `getMembershipPlanById(UUID id)`, `createMembershipPlan(MembershipPlanDto membershipPlanDto)`, `updateMembershipPlan(UUID id, MembershipPlanDto membershipPlanDto)`, and `deleteMembershipPlan(UUID id)`.
- `backend/src/main/java/com/vikramsfitnessstudio/dto/MembershipPlanDto.java` — DTO layer — defines the data structure for transferring membership plan details.
- `backend/src/main/java/com/vikramsfitnessstudio/dto/UserMembershipDto.java` — DTO layer — defines the data structure for transferring a user's current membership status.

**Feature Instruction:**

This feature provides the backend API for managing membership plans and user memberships for Vikram's Fitness Studio. It consists of two DTOs, MembershipPlanDto and UserMembershipDto, and two controllers: MembershipController for public and authenticated user access, and AdminMembershipPlanController for administrative CRUD operations on membership plans. All business logic and persistence are delegated to the `membership-core` feature's `MembershipService`.

### MembershipPlanDto.java
This DTO is used for transferring membership plan details between the controllers and the frontend. It mirrors the `MembershipPlan` entity from `membership-core`.

### UserMembershipDto.java
This DTO is used for transferring a user's current membership status and details. It mirrors the `Membership` entity from `membership-core`.

### MembershipController.java
This controller exposes public endpoints to retrieve all active membership plans and authenticated endpoints for users to view their own memberships. It injects `MembershipService` from the `membership-core` feature.

#### Public Endpoints:
1.  `GET /api/v1/memberships/plans`:
    -   **Description**: Retrieves a list of all active membership plans available at Vikram's Fitness Studio.
    -   **Logic**:
        1.  Call `membershipService.getAllMembershipPlans()`.
        2.  Filter the returned list to include only plans where `isActive` is `true`.
        3.  Map the filtered `MembershipPlan` entities to `MembershipPlanDto`.
        4.  Return a `200 OK` response with the list of `MembershipPlanDto`.

#### Authenticated Endpoints:
1.  `GET /api/v1/memberships/my-memberships`:
    -   **Description**: Retrieves a list of all memberships for the currently authenticated user.
    -   **Logic**:
        1.  Extract the `userId` from the authenticated principal.
        2.  Call `membershipService.getUserMemberships(userId)`.
        3.  Map the returned `Membership` entities to `UserMembershipDto`.
        4.  Return a `200 OK` response with the list of `UserMembershipDto`.
    -   **Error Cases**:
        -   If `userId` cannot be determined from the principal, return `401 Unauthorized`.

### AdminMembershipPlanController.java
This controller provides admin-only CRUD (Create, Read, Update, Delete) operations for membership plans. It injects `MembershipService` from the `membership-core` feature.

#### Admin Endpoints:
1.  `GET /api/v1/admin/memberships/plans`:
    -   **Description**: Retrieves a list of all membership plans, including inactive ones.
    -   **Logic**:
        1.  Call `membershipService.getAllMembershipPlans()`.
        2.  Map the returned `MembershipPlan` entities to `MembershipPlanDto`.
        3.  Return a `200 OK` response with the list of `MembershipPlanDto`.

2.  `GET /api/v1/admin/memberships/plans/{id}`:
    -   **Description**: Retrieves a specific membership plan by its ID.
    -   **Logic**:
        1.  Call `membershipService.getMembershipPlanById(id)`.
        2.  Map the returned `MembershipPlan` entity to `MembershipPlanDto`.
        3.  Return a `200 OK` response with the `MembershipPlanDto`.
    -   **Error Cases**:
        -   If the plan is not found, throw `ResourceNotFoundException` which will result in a `404 Not Found` response.

3.  `POST /api/v1/admin/memberships/plans`:
    -   **Description**: Creates a new membership plan.
    -   **Logic**:
        1.  Validate the `MembershipPlanDto` request body.
        2.  Map the `MembershipPlanDto` to a `MembershipPlan` entity.
        3.  Call `membershipService.createMembershipPlan(membershipPlan)`.
        4.  Map the returned `MembershipPlan` entity to `MembershipPlanDto`.
        5.  Return a `201 Created` response with the created `MembershipPlanDto`.
    -   **Error Cases**:
        -   If validation fails, return `400 Bad Request`.

4.  `PUT /api/v1/admin/memberships/plans/{id}`:
    -   **Description**: Updates an existing membership plan.
    -   **Logic**:
        1.  Validate the `MembershipPlanDto` request body.
        2.  Map the `MembershipPlanDto` to a `MembershipPlan` entity.
        3.  Call `membershipService.updateMembershipPlan(id, membershipPlanDetails)`.
        4.  Map the returned `MembershipPlan` entity to `MembershipPlanDto`.
        5.  Return a `200 OK` response with the updated `MembershipPlanDto`.
    -   **Error Cases**:
        -   If the plan is not found, throw `ResourceNotFoundException` which will result in a `404 Not Found` response.
        -   If validation fails, return `400 Bad Request`.

5.  `DELETE /api/v1/admin/memberships/plans/{id}`:
    -   **Description**: Deletes a membership plan by its ID.
    -   **Logic**:
        1.  Call `membershipService.deleteMembershipPlan(id)`.
        2.  Return a `204 No Content` response.
    -   **Error Cases**:
        -   If the plan is not found, throw `ResourceNotFoundException` which will result in a `404 Not Found` response.

---

## Booking System (Core)

**Name:** `booking-core`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/vikramsfitnessstudio/model/FitnessClass.java` — MODEL layer — defines the data structure for a scheduled fitness class.
- `backend/src/main/java/com/vikramsfitnessstudio/model/Booking.java` — MODEL layer — defines the data structure for a user's booking of a fitness class.
- `backend/src/main/java/com/vikramsfitnessstudio/model/BookingStatus.java` — MODEL layer — defines the enumeration for booking statuses.
- `backend/src/main/java/com/vikramsfitnessstudio/repository/FitnessClassRepository.java` — REPOSITORY layer — provides data access methods for FitnessClass entities.
- `backend/src/main/java/com/vikramsfitnessstudio/repository/BookingRepository.java` — REPOSITORY layer — provides data access methods for Booking entities, including custom queries for user-specific bookings and class availability.
- `backend/src/main/java/com/vikramsfitnessstudio/service/BookingService.java` — SERVICE layer — implements business logic for managing fitness classes and user bookings, including capacity checks and status updates.

**Feature Instruction:**

The Booking System (Core) feature manages the backend logic and data persistence for fitness classes and user bookings at Vikram's Fitness Studio. It defines the core domain models: `FitnessClass` for scheduled classes, `Booking` for user reservations, and `BookingStatus` for the lifecycle of a booking. This feature provides repositories for data access and a service layer (`BookingService`) that encapsulates the business rules for creating, retrieving, and managing fitness classes and bookings.

`FitnessClass.java` defines the structure for a fitness class, including its name, schedule, instructor, and capacity. `Booking.java` represents a user's reservation for a specific `FitnessClass`, linking to a `User` (from `shared-backend`) and having a `BookingStatus`. `BookingStatus.java` is an enum defining the possible states of a booking.

`FitnessClassRepository.java` and `BookingRepository.java` are Spring Data JPA repositories that provide standard CRUD operations and custom query methods for `FitnessClass` and `Booking` entities, respectively.

`BookingService.java` is the central business logic component. It orchestrates interactions with `FitnessClassRepository` and `BookingRepository`. It will expose methods for:

1.  **Retrieving all available fitness classes**: `getAllFitnessClasses(): List<FitnessClass>`
    *   Steps:
        1.  Retrieve all `FitnessClass` entities from `FitnessClassRepository`.
        2.  Return the list.

2.  **Retrieving a fitness class by ID**: `getFitnessClassById(Long classId): FitnessClass`
    *   Steps:
        1.  Attempt to find a `FitnessClass` by `classId` using `FitnessClassRepository.findById()`.
        2.  If not found, throw `ResourceNotFoundException`.
        3.  Return the `FitnessClass`.

3.  **Creating a new booking**: `createBooking(Long userId, Long classId): Booking`
    *   Steps:
        1.  Retrieve the `FitnessClass` by `classId` using `getFitnessClassById(classId)`.
        2.  Check if the class has available capacity. If `currentBookedSlots >= maxCapacity`, throw `IllegalStateException` with a message indicating the class is full.
        3.  Retrieve the `User` from the `shared-backend`'s `UserRepository` using `userId`. If the user is not found, throw `ResourceNotFoundException`.
        4.  Check if the user already has an active booking for this class. If `bookingRepository.findByUserIdAndFitnessClassIdAndStatusNot(userId, classId, BookingStatus.CANCELLED)` returns a non-empty list, throw `IllegalStateException`.
        5.  Create a new `Booking` entity with `userId`, `fitnessClass`, and `BookingStatus.CONFIRMED`.
        6.  Increment `currentBookedSlots` on the `FitnessClass` and save it via `fitnessClassRepository.save()`.
        7.  Save the new `Booking` entity using `bookingRepository.save()`.
        8.  Return the created `Booking`.
    *   Error cases:
        *   `ResourceNotFoundException` (HTTP 404) if `FitnessClass` or `User` not found.
        *   `IllegalStateException` (HTTP 400) if class is full or user already booked.

4.  **Cancelling a booking**: `cancelBooking(Long bookingId, Long userId): Booking`
    *   Steps:
        1.  Retrieve the `Booking` by `bookingId` using `bookingRepository.findById()`.
        2.  If not found, throw `ResourceNotFoundException`.
        3.  Verify that the `Booking` belongs to the `userId` provided. If `booking.getUser().getId() != userId`, throw `IllegalArgumentException`.
        4.  Check if the booking status is `CONFIRMED`. If not, throw `IllegalStateException`.
        5.  Set the `BookingStatus` to `CANCELLED`.
        6.  Decrement `currentBookedSlots` on the associated `FitnessClass` and save it via `fitnessClassRepository.save()`.
        7.  Save the updated `Booking` entity using `bookingRepository.save()`.
        8.  Return the updated `Booking`.
    *   Error cases:
        *   `ResourceNotFoundException` (HTTP 404) if `Booking` not found.
        *   `IllegalArgumentException` (HTTP 403) if booking does not belong to the user.
        *   `IllegalStateException` (HTTP 400) if booking is not in `CONFIRMED` status.

5.  **Retrieving bookings for a user**: `getUserBookings(Long userId): List<Booking>`
    *   Steps:
        1.  Retrieve all `Booking` entities associated with `userId` from `bookingRepository.findByUserId()`.
        2.  Return the list.

6.  **Retrieving all bookings (admin only)**: `getAllBookings(): List<Booking>`
    *   Steps:
        1.  Retrieve all `Booking` entities from `bookingRepository.findAll()`.
        2.  Return the list.

7.  **Updating a fitness class (admin only)**: `updateFitnessClass(Long classId, FitnessClass updatedClass): FitnessClass`
    *   Steps:
        1.  Retrieve the existing `FitnessClass` by `classId` using `getFitnessClassById(classId)`.
        2.  Update the fields of the existing `FitnessClass` with values from `updatedClass`.
        3.  Save the updated `FitnessClass` using `fitnessClassRepository.save()`.
        4.  Return the updated `FitnessClass`.
    *   Error cases:
        *   `ResourceNotFoundException` (HTTP 404) if `FitnessClass` not found.

8.  **Creating a fitness class (admin only)**: `createFitnessClass(FitnessClass newClass): FitnessClass`
    *   Steps:
        1.  Save the `newClass` entity using `fitnessClassRepository.save()`.
        2.  Return the created `FitnessClass`.

9.  **Deleting a fitness class (admin only)**: `deleteFitnessClass(Long classId): void`
    *   Steps:
        1.  Retrieve the `FitnessClass` by `classId` using `getFitnessClassById(classId)`.
        2.  Check if there are any active bookings for this class. If `bookingRepository.findByFitnessClassIdAndStatusNot(classId, BookingStatus.CANCELLED)` returns a non-empty list, throw `IllegalStateException`.
        3.  Delete the `FitnessClass` using `fitnessClassRepository.deleteById(classId)`.
    *   Error cases:
        *   `ResourceNotFoundException` (HTTP 404) if `FitnessClass` not found.
        *   `IllegalStateException` (HTTP 400) if there are active bookings for the class.

This feature depends on the `shared-backend` feature for `User` entity and `UserRepository` access.

---

## Booking System (API)

**Name:** `booking-api`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/vikramsfitnessstudio/controller/BookingController.java` — CONTROLLER layer — exposes public endpoints for viewing class schedules and member-only endpoints for creating/managing bookings, delegating business logic to BookingService.
- `backend/src/main/java/com/vikramsfitnessstudio/controller/admin/AdminFitnessClassController.java` — CONTROLLER layer — provides admin-only CRUD endpoints for managing fitness class schedules, delegating business logic to BookingService.
- `backend/src/main/java/com/vikramsfitnessstudio/controller/admin/AdminBookingController.java` — CONTROLLER layer — provides admin-only endpoints for viewing and managing all user bookings, delegating business logic to BookingService.
- `backend/src/main/java/com/vikramsfitnessstudio/dto/CreateBookingRequest.java` — DTO layer — defines the data structure for creating a new class booking.
- `backend/src/main/java/com/vikramsfitnessstudio/dto/BookingDto.java` — DTO layer — defines the data structure representing a booking.
- `backend/src/main/java/com/vikramsfitnessstudio/dto/FitnessClassDto.java` — DTO layer — defines the data structure representing a fitness class.

**Feature Instruction:**

The Booking System API feature provides backend services and controllers for managing fitness classes and user bookings at Vikram's Fitness Studio. It exposes public endpoints for viewing the class schedule and authenticated endpoints for members to create, view, and cancel their bookings. Additionally, it includes admin-only endpoints for full CRUD operations on fitness classes and for managing all user bookings.

### Data Transfer Objects (DTOs)

- `FitnessClassDto`: Represents a fitness class with details like `id`, `name`, `description`, `startTime`, `endTime`, `instructor`, `maxCapacity`, and `currentBookedSlots`. This DTO is used for both public display and admin management of fitness classes.
- `CreateBookingRequest`: Used by members to request a new booking, containing `fitnessClassId`.
- `BookingDto`: Represents a user's booking, including `id`, `userId`, `fitnessClassId`, `bookingTime`, and `status`.

### Core Logic (`BookingService` from `booking-core`)

This feature relies heavily on the `BookingService` from the `booking-core` feature for its business logic. The `BookingService` handles:
- Retrieving all fitness classes: `getAllFitnessClasses(): List<FitnessClass>`
- Retrieving a specific fitness class by ID: `getFitnessClassById(Long classId): FitnessClass`
- Creating a new booking: `createBooking(Long userId, Long classId): Booking`
- Cancelling an existing booking: `cancelBooking(Long bookingId, Long userId): Booking`
- Retrieving all bookings for a specific user: `getUserBookings(Long userId): List<Booking>`
- Retrieving all bookings (admin only): `getAllBookings(): List<Booking>`
- Creating a new fitness class (admin only): `createFitnessClass(FitnessClass newClass): FitnessClass`
- Updating an existing fitness class (admin only): `updateFitnessClass(Long classId, FitnessClass updatedClass): FitnessClass`
- Deleting a fitness class (admin only): `deleteFitnessClass(Long classId): void`

### Controllers

1. **`BookingController`**
   - Injects `BookingService`.
   - **`getAllFitnessClasses()`**: 
     1. Calls `bookingService.getAllFitnessClasses()`.
     2. Maps the list of `FitnessClass` entities to `FitnessClassDto`s.
     3. Returns a `ResponseEntity` with a list of `FitnessClassDto`s and HTTP status 200 OK.
   - **`createBooking(Principal principal, CreateBookingRequest request)`**: 
     1. Extracts `userId` from the `principal` (authenticated user).
     2. Validates `request` using `@Valid`.
     3. Calls `bookingService.createBooking(userId, request.getFitnessClassId())`.
     4. Maps the created `Booking` entity to a `BookingDto`.
     5. Returns a `ResponseEntity` with the `BookingDto` and HTTP status 201 Created. Throws `ResourceNotFoundException` if the class does not exist, or `IllegalStateException` if the class is full or the user already booked.
   - **`getUserBookings(Principal principal)`**: 
     1. Extracts `userId` from the `principal`.
     2. Calls `bookingService.getUserBookings(userId)`.
     3. Maps the list of `Booking` entities to `BookingDto`s.
     4. Returns a `ResponseEntity` with a list of `BookingDto`s and HTTP status 200 OK.
   - **`cancelBooking(Principal principal, Long bookingId)`**: 
     1. Extracts `userId` from the `principal`.
     2. Calls `bookingService.cancelBooking(bookingId, userId)`.
     3. Maps the cancelled `Booking` entity to a `BookingDto`.
     4. Returns a `ResponseEntity` with the `BookingDto` and HTTP status 200 OK. Throws `ResourceNotFoundException` if the booking does not exist or does not belong to the user, or `IllegalStateException` if the booking cannot be cancelled (e.g., too close to start time).

2. **`AdminFitnessClassController`**
   - Injects `BookingService`.
   - **`getAllFitnessClasses()`**: 
     1. Calls `bookingService.getAllFitnessClasses()`.
     2. Maps the list of `FitnessClass` entities to `FitnessClassDto`s.
     3. Returns a `ResponseEntity` with a list of `FitnessClassDto`s and HTTP status 200 OK.
   - **`getFitnessClassById(Long classId)`**: 
     1. Calls `bookingService.getFitnessClassById(classId)`.
     2. Maps the `FitnessClass` entity to a `FitnessClassDto`.
     3. Returns a `ResponseEntity` with the `FitnessClassDto` and HTTP status 200 OK. Throws `ResourceNotFoundException` if the class does not exist.
   - **`createFitnessClass(@Valid FitnessClassDto fitnessClassDto)`**: 
     1. Validates `fitnessClassDto` using `@Valid`.
     2. Maps `fitnessClassDto` to a `FitnessClass` entity.
     3. Calls `bookingService.createFitnessClass(newClass)`.
     4. Maps the created `FitnessClass` entity back to a `FitnessClassDto`.
     5. Returns a `ResponseEntity` with the `FitnessClassDto` and HTTP status 201 Created.
   - **`updateFitnessClass(Long classId, @Valid FitnessClassDto fitnessClassDto)`**: 
     1. Validates `fitnessClassDto` using `@Valid`.
     2. Maps `fitnessClassDto` to a `FitnessClass` entity.
     3. Calls `bookingService.updateFitnessClass(classId, updatedClass)`.
     4. Maps the updated `FitnessClass` entity back to a `FitnessClassDto`.
     5. Returns a `ResponseEntity` with the `FitnessClassDto` and HTTP status 200 OK. Throws `ResourceNotFoundException` if the class does not exist.
   - **`deleteFitnessClass(Long classId)`**: 
     1. Calls `bookingService.deleteFitnessClass(classId)`.
     2. Returns a `ResponseEntity` with no content and HTTP status 204 No Content. Throws `ResourceNotFoundException` if the class does not exist.

3. **`AdminBookingController`**
   - Injects `BookingService`.
   - **`getAllBookings()`**: 
     1. Calls `bookingService.getAllBookings()`.
     2. Maps the list of `Booking` entities to `BookingDto`s.
     3. Returns a `ResponseEntity` with a list of `BookingDto`s and HTTP status 200 OK.
   - **`getBookingById(Long bookingId)`**: 
     1. Calls `bookingService.getBookingById(bookingId)` (assuming `BookingService` has this method, if not, it should be added or derived from `getAllBookings` and filtering).
     2. Maps the `Booking` entity to a `BookingDto`.
     3. Returns a `ResponseEntity` with the `BookingDto` and HTTP status 200 OK. Throws `ResourceNotFoundException` if the booking does not exist.
   - **`cancelBooking(Long bookingId)`**: 
     1. Calls `bookingService.cancelBooking(bookingId, null)` (admin can cancel any booking without user ID check, assuming `BookingService` handles this or a dedicated admin cancel method exists).
     2. Maps the cancelled `Booking` entity to a `BookingDto`.
     3. Returns a `ResponseEntity` with the `BookingDto` and HTTP status 200 OK. Throws `ResourceNotFoundException` if the booking does not exist or `IllegalStateException` if the booking cannot be cancelled.

### Error Handling

- Controllers will throw `ResourceNotFoundException` (mapped to 404 Not Found by `GlobalExceptionHandler` from `shared-backend`) when an entity is not found.
- Controllers will throw `IllegalStateException` (mapped to 400 Bad Request or 409 Conflict by `GlobalExceptionHandler`) for business rule violations (e.g., class full, booking too late to cancel).
- `@Valid` annotations on DTOs will trigger `MethodArgumentNotValidException` (mapped to 400 Bad Request by `GlobalExceptionHandler`) for validation failures.

### Security

- Public endpoints (`GET /api/v1/classes`) are accessible without authentication.
- Member endpoints (`POST /api/v1/bookings`, `GET /api/v1/bookings/my-bookings`, `DELETE /api/v1/bookings/{bookingId}`) require authentication with the `MEMBER` role.
- Admin endpoints (`/api/v1/admin/**`) require authentication with the `ADMIN` role.

---

## Progress Tracking (Backend)

**Name:** `progress-tracking-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/vikramsfitnessstudio/model/WorkoutLog.java` — MODEL layer — Represents a member's workout session log, including exercises, sets, and reps.
- `backend/src/main/java/com/vikramsfitnessstudio/model/ProgressMetric.java` — MODEL layer — Represents a member's progress metric entry, such as weight or body fat percentage.
- `backend/src/main/java/com/vikramsfitnessstudio/repository/WorkoutLogRepository.java` — REPOSITORY layer — Provides data access methods for WorkoutLog entities, including findByUserIdOrderByDateDesc.
- `backend/src/main/java/com/vikramsfitnessstudio/repository/ProgressMetricRepository.java` — REPOSITORY layer — Provides data access methods for ProgressMetric entities, including findByUserIdAndMetricNameOrderByDateDesc.
- `backend/src/main/java/com/vikramsfitnessstudio/service/ProgressService.java` — SERVICE layer — implements logWorkout(Long userId, WorkoutLogDto workoutLogDto): WorkoutLogDto, getWorkoutLogsByUserId(Long userId): List<WorkoutLogDto>, logProgressMetric(Long userId, ProgressMetricDto progressMetricDto): ProgressMetricDto, and getProgressMetricsByUserIdAndMetricName(Long userId, String metricName): List<ProgressMetricDto>.
- `backend/src/main/java/com/vikramsfitnessstudio/controller/ProgressController.java` — CONTROLLER layer — Exposes member-only endpoints for logging and retrieving workout and progress data.
- `backend/src/main/java/com/vikramsfitnessstudio/dto/WorkoutLogDto.java` — DTO layer — Data transfer object for workout log entries.
- `backend/src/main/java/com/vikramsfitnessstudio/dto/ProgressMetricDto.java` — DTO layer — Data transfer object for progress metric entries.

**Feature Instruction:**

The Progress Tracking (Backend) feature enables members of Vikram's Fitness Studio to log their workout sessions and track various progress metrics over time. This feature consists of two core domain models: `WorkoutLog` and `ProgressMetric`, each with its own repository for data persistence. The `ProgressService` orchestrates the business logic for creating, retrieving, and managing these logs and metrics. The `ProgressController` exposes RESTful API endpoints, allowing authenticated members to interact with the progress tracking system. Data transfer objects (`WorkoutLogDto` and `ProgressMetricDto`) are used for all API interactions to ensure a clean separation between the internal domain models and the external API contract.

## Data Models

### WorkoutLog
Represents a single workout session. It includes a reference to the `User` who performed the workout, the `date` of the workout, a `description` of the workout, and a list of `exercises` performed, each with `sets` and `reps`.

### ProgressMetric
Represents a specific measurable metric of a member's progress, such as weight, body fat percentage, or muscle mass. It includes a reference to the `User`, the `date` the metric was recorded, the `metricName` (e.g., "Weight"), and the `metricValue`.

## Repositories

### WorkoutLogRepository
Extends `JpaRepository` to provide standard CRUD operations for `WorkoutLog` entities. It includes a custom query method `findByUserIdOrderByDateDesc` to retrieve workout logs for a specific user, ordered by date in descending order.

### ProgressMetricRepository
Extends `JpaRepository` to provide standard CRUD operations for `ProgressMetric` entities. It includes a custom query method `findByUserIdAndMetricNameOrderByDateDesc` to retrieve progress metrics for a specific user and metric name, ordered by date in descending order.

## Service Layer

### ProgressService
This service handles the business logic for progress tracking. It injects `WorkoutLogRepository` and `ProgressMetricRepository` to interact with the database.

#### `logWorkout(Long userId, WorkoutLogDto workoutLogDto): WorkoutLogDto`
1. Validates the `workoutLogDto`.
2. Converts the `WorkoutLogDto` to a `WorkoutLog` entity.
3. Sets the `User` for the `WorkoutLog` based on the `userId`.
4. Saves the `WorkoutLog` entity using `workoutLogRepository.save()`.
5. Converts the saved `WorkoutLog` entity back to `WorkoutLogDto` and returns it.
6. Throws `ResourceNotFoundException` if the user does not exist.

#### `getWorkoutLogsByUserId(Long userId): List<WorkoutLogDto>`
1. Retrieves all `WorkoutLog` entities for the given `userId` using `workoutLogRepository.findByUserIdOrderByDateDesc()`.
2. Converts the list of `WorkoutLog` entities to a list of `WorkoutLogDto` and returns it.
3. Throws `ResourceNotFoundException` if the user does not exist.

#### `logProgressMetric(Long userId, ProgressMetricDto progressMetricDto): ProgressMetricDto`
1. Validates the `progressMetricDto`.
2. Converts the `ProgressMetricDto` to a `ProgressMetric` entity.
3. Sets the `User` for the `ProgressMetric` based on the `userId`.
4. Saves the `ProgressMetric` entity using `progressMetricRepository.save()`.
5. Converts the saved `ProgressMetric` entity back to `ProgressMetricDto` and returns it.
6. Throws `ResourceNotFoundException` if the user does not exist.

#### `getProgressMetricsByUserIdAndMetricName(Long userId, String metricName): List<ProgressMetricDto>`
1. Retrieves all `ProgressMetric` entities for the given `userId` and `metricName` using `progressMetricRepository.findByUserIdAndMetricNameOrderByDateDesc()`.
2. Converts the list of `ProgressMetric` entities to a list of `ProgressMetricDto` and returns it.
3. Throws `ResourceNotFoundException` if the user does not exist.

## Controller Layer

### ProgressController
This controller exposes RESTful API endpoints for progress tracking. It injects `ProgressService` to handle business logic and `JwtUtil` (from `shared-backend`) to extract the user ID from the JWT.

#### `logWorkout(Principal principal, WorkoutLogDto workoutLogDto): ResponseEntity<WorkoutLogDto>`
- **Endpoint:** `POST /api/v1/progress/workouts`
- **Access:** `authenticated`
- Extracts the `userId` from the `Principal`.
- Calls `progressService.logWorkout()` with the `userId` and `workoutLogDto`.
- Returns `201 Created` with the created `WorkoutLogDto`.
- Returns `404 Not Found` if `ResourceNotFoundException` is thrown by the service.

#### `getWorkoutLogs(Principal principal): ResponseEntity<List<WorkoutLogDto>>`
- **Endpoint:** `GET /api/v1/progress/workouts`
- **Access:** `authenticated`
- Extracts the `userId` from the `Principal`.
- Calls `progressService.getWorkoutLogsByUserId()` with the `userId`.
- Returns `200 OK` with a list of `WorkoutLogDto`.
- Returns `404 Not Found` if `ResourceNotFoundException` is thrown by the service.

#### `logProgressMetric(Principal principal, ProgressMetricDto progressMetricDto): ResponseEntity<ProgressMetricDto>`
- **Endpoint:** `POST /api/v1/progress/metrics`
- **Access:** `authenticated`
- Extracts the `userId` from the `Principal`.
- Calls `progressService.logProgressMetric()` with the `userId` and `progressMetricDto`.
- Returns `201 Created` with the created `ProgressMetricDto`.
- Returns `404 Not Found` if `ResourceNotFoundException` is thrown by the service.

#### `getProgressMetrics(Principal principal, String metricName): ResponseEntity<List<ProgressMetricDto>>`
- **Endpoint:** `GET /api/v1/progress/metrics?metricName={metricName}`
- **Access:** `authenticated`
- Extracts the `userId` from the `Principal`.
- Calls `progressService.getProgressMetricsByUserIdAndMetricName()` with the `userId` and `metricName`.
- Returns `200 OK` with a list of `ProgressMetricDto`.
- Returns `404 Not Found` if `ResourceNotFoundException` is thrown by the service.

## DTOs

### WorkoutLogDto
Used for transferring workout log data between the client and the server. It includes `id`, `date`, `description`, and a list of `exercises` (each with `name`, `sets`, and `reps`).

### ProgressMetricDto
Used for transferring progress metric data between the client and the server. It includes `id`, `date`, `metricName`, and `metricValue`.

---

## Content Management (Backend)

**Name:** `content-management-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/vikramsfitnessstudio/model/BlogPost.java` — MODEL layer — defines the `BlogPost` entity with fields for `id`, `title`, `content`, `author`, `publicationDate`, and `lastModifiedDate`.
- `backend/src/main/java/com/vikramsfitnessstudio/repository/BlogPostRepository.java` — REPOSITORY layer — provides data access methods for `BlogPost` entities, including `findById(UUID id)` and `findAllByOrderByPublicationDateDesc(): List<BlogPost>`.
- `backend/src/main/java/com/vikramsfitnessstudio/service/BlogPostService.java` — SERVICE layer — implements `getAllBlogPosts(): List<BlogPostDto>`, `getBlogPostById(UUID id): BlogPostDto`, `createBlogPost(BlogPostDto blogPostDto): BlogPostDto`, `updateBlogPost(UUID id, BlogPostDto blogPostDto): BlogPostDto`, and `deleteBlogPost(UUID id): void`.
- `backend/src/main/java/com/vikramsfitnessstudio/controller/BlogPostController.java` — CONTROLLER layer — exposes public API endpoints for listing and viewing blog posts: `GET /api/v1/blog` and `GET /api/v1/blog/{id}`.
- `backend/src/main/java/com/vikramsfitnessstudio/controller/admin/AdminBlogPostController.java` — CONTROLLER layer — provides admin-only CRUD endpoints for managing blog posts: `GET /api/v1/admin/blog`, `GET /api/v1/admin/blog/{id}`, `POST /api/v1/admin/blog`, `PUT /api/v1/admin/blog/{id}`, and `DELETE /api/v1/admin/blog/{id}`.
- `backend/src/main/java/com/vikramsfitnessstudio/dto/BlogPostDto.java` — DTO layer — data transfer object for blog post data, used for API requests and responses.

**Feature Instruction:**

The Content Management (Backend) feature provides the API for managing blog posts for Vikram's Fitness Studio. It includes models for blog posts, a repository for data access, a service layer for business logic, and two controllers: one for public access to view blog posts and another for administrative CRUD operations.

### BlogPost Model
The `BlogPost` entity represents a single blog post. It will have fields for `id` (UUID), `title` (String), `content` (String), `author` (String), `publicationDate` (LocalDate), and `lastModifiedDate` (LocalDateTime). The `author` field will initially be a simple String, but can be linked to a `User` entity from the `shared-backend` feature in future iterations if user management for authors is implemented.

### BlogPostRepository
The `BlogPostRepository` extends `JpaRepository` and provides standard CRUD operations for `BlogPost` entities. It will include custom query methods to find blog posts by `id` and to retrieve all blog posts ordered by `publicationDate` in descending order.

### BlogPostService
The `BlogPostService` encapsulates the business logic for blog posts. It injects `BlogPostRepository` to perform database operations. It will expose the following public methods:

1.  `getAllBlogPosts(): List<BlogPostDto>`
    -   Retrieves all blog posts, ordered by `publicationDate` descending.
    -   Maps `BlogPost` entities to `BlogPostDto`.
    -   Throws no exceptions.

2.  `getBlogPostById(UUID id): BlogPostDto`
    -   Retrieves a single blog post by its `id`.
    -   Maps the `BlogPost` entity to `BlogPostDto`.
    -   Throws `ResourceNotFoundException` (from `shared-backend`) if no blog post with the given `id` is found.

3.  `createBlogPost(BlogPostDto blogPostDto): BlogPostDto`
    -   Creates a new blog post.
    -   Takes a `BlogPostDto` as input, sets `publicationDate` to the current date, and `lastModifiedDate` to the current date.
    -   Saves the new `BlogPost` entity via `BlogPostRepository`.
    -   Returns the saved `BlogPost` mapped to `BlogPostDto`.
    -   Throws `IllegalArgumentException` if `blogPostDto` contains invalid data (e.g., null title or content).

4.  `updateBlogPost(UUID id, BlogPostDto blogPostDto): BlogPostDto`
    -   Updates an existing blog post identified by `id`.
    -   Takes a `BlogPostDto` with updated details. The `id` in the DTO is ignored; the path variable `id` is used.
    -   Retrieves the existing `BlogPost` using `BlogPostRepository.findById()`. If not found, throws `ResourceNotFoundException`.
    -   Updates the `title`, `content`, `author`, and sets `lastModifiedDate` to the current date.
    -   Saves the updated `BlogPost` entity.
    -   Returns the updated `BlogPost` mapped to `BlogPostDto`.
    -   Throws `ResourceNotFoundException` if the blog post does not exist.
    -   Throws `IllegalArgumentException` if `blogPostDto` contains invalid data.

5.  `deleteBlogPost(UUID id): void`
    -   Deletes a blog post by its `id`.
    -   Retrieves the existing `BlogPost` using `BlogPostRepository.findById()`. If not found, throws `ResourceNotFoundException`.
    -   Deletes the `BlogPost` entity via `BlogPostRepository`.
    -   Throws `ResourceNotFoundException` if the blog post does not exist.

### BlogPostController
The `BlogPostController` exposes public read-only endpoints for blog posts. It injects `BlogPostService`.

1.  `getAllBlogPosts(): ResponseEntity<List<BlogPostDto>>`
    -   Handles GET requests to `/api/v1/blog`.
    -   Calls `blogPostService.getAllBlogPosts()`.
    -   Returns a `200 OK` response with a list of `BlogPostDto`.

2.  `getBlogPostById(UUID id): ResponseEntity<BlogPostDto>`
    -   Handles GET requests to `/api/v1/blog/{id}`.
    -   Calls `blogPostService.getBlogPostById(id)`.
    -   Returns a `200 OK` response with the `BlogPostDto`.
    -   If `ResourceNotFoundException` is thrown by the service, it will be handled by `GlobalExceptionHandler` (from `shared-backend`) returning a `404 Not Found`.

### AdminBlogPostController
The `AdminBlogPostController` provides administrative CRUD endpoints for blog posts. It injects `BlogPostService`.

1.  `getAllBlogPosts(): ResponseEntity<List<BlogPostDto>>`
    -   Handles GET requests to `/api/v1/admin/blog`.
    -   Calls `blogPostService.getAllBlogPosts()`.
    -   Returns a `200 OK` response with a list of `BlogPostDto`.

2.  `getBlogPostById(UUID id): ResponseEntity<BlogPostDto>`
    -   Handles GET requests to `/api/v1/admin/blog/{id}`.
    -   Calls `blogPostService.getBlogPostById(id)`.
    -   Returns a `200 OK` response with the `BlogPostDto`.
    -   If `ResourceNotFoundException` is thrown, returns `404 Not Found`.

3.  `createBlogPost(BlogPostDto blogPostDto): ResponseEntity<BlogPostDto>`
    -   Handles POST requests to `/api/v1/admin/blog`.
    -   Validates `blogPostDto` using `@Valid` annotations.
    -   Calls `blogPostService.createBlogPost(blogPostDto)`.
    -   Returns a `201 Created` response with the created `BlogPostDto`.
    -   If `IllegalArgumentException` is thrown, returns `400 Bad Request`.

4.  `updateBlogPost(UUID id, BlogPostDto blogPostDto): ResponseEntity<BlogPostDto>`
    -   Handles PUT requests to `/api/v1/admin/blog/{id}`.
    -   Validates `blogPostDto` using `@Valid` annotations.
    -   Calls `blogPostService.updateBlogPost(id, blogPostDto)`.
    -   Returns a `200 OK` response with the updated `BlogPostDto`.
    -   If `ResourceNotFoundException` is thrown, returns `404 Not Found`.
    -   If `IllegalArgumentException` is thrown, returns `400 Bad Request`.

5.  `deleteBlogPost(UUID id): ResponseEntity<Void>`
    -   Handles DELETE requests to `/api/v1/admin/blog/{id}`.
    -   Calls `blogPostService.deleteBlogPost(id)`.
    -   Returns a `204 No Content` response.
    -   If `ResourceNotFoundException` is thrown, returns `404 Not Found`.

### BlogPostDto
The `BlogPostDto` is a data transfer object used for exposing blog post data through the API. It will mirror the `BlogPost` entity's fields: `id` (UUID), `title` (String), `content` (String), `author` (String), `publicationDate` (LocalDate), and `lastModifiedDate` (LocalDateTime). It will include validation annotations like `@NotBlank` for `title` and `content`.


---

## Order Processing (Backend)

**Name:** `order-processing-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/vikramsfitnessstudio/model/Order.java` — MODEL layer — defines the structure of a customer order, including its status and associated items.
- `backend/src/main/java/com/vikramsfitnessstudio/model/OrderItem.java` — MODEL layer — defines a single item within an order, linking to a specific membership plan.
- `backend/src/main/java/com/vikramsfitnessstudio/model/OrderStatus.java` — MODEL layer — defines the enumeration for possible order statuses.
- `backend/src/main/java/com/vikramsfitnessstudio/repository/OrderRepository.java` — REPOSITORY layer — provides data access methods for `Order` entities, including finding orders by user ID.
- `backend/src/main/java/com/vikramsfitnessstudio/service/OrderService.java` — SERVICE layer — implements `createOrder(CreateOrderRequest): OrderDto`, `getOrdersByUserId(Long userId): List<OrderDto>`, and `getAllOrders(): List<OrderDto>`; delegates persistence to `OrderRepository` and membership plan retrieval to `MembershipService`.
- `backend/src/main/java/com/vikramsfitnessstudio/controller/OrderController.java` — CONTROLLER layer — exposes REST endpoints for authenticated members to `POST /api/v1/orders` to create orders and `GET /api/v1/orders/my-orders` to view their orders.
- `backend/src/main/java/com/vikramsfitnessstudio/controller/admin/AdminOrderController.java` — CONTROLLER layer — provides admin-only REST endpoint `GET /api/v1/admin/orders` to view all customer orders.
- `backend/src/main/java/com/vikramsfitnessstudio/dto/CreateOrderRequest.java` — DTO layer — defines the data transfer object for creating a new order.
- `backend/src/main/java/com/vikramsfitnessstudio/dto/OrderDto.java` — DTO layer — defines the data transfer object representing a customer order for API responses.

**Feature Instruction:**

This feature handles the backend logic for customer orders at Vikram's Fitness Studio, primarily for membership plan purchases. It defines the `Order` and `OrderItem` entities, manages their persistence via `OrderRepository`, and provides business logic through `OrderService`. The `OrderService` interacts with the `MembershipService` from the `membership-core` feature to retrieve membership plan details and potentially assign memberships upon order completion. The `OrderController` exposes endpoints for authenticated members to create and view their orders, while the `AdminOrderController` provides administrative access to view all orders. The `OrderStatus` enum defines the possible states of an order.

### Order Flow:
1.  A member initiates an order by sending a `CreateOrderRequest` to `OrderController.createOrder()`.
2.  `OrderController` calls `OrderService.createOrder()`.
3.  `OrderService.createOrder()` performs the following steps:
    a.  Validates the `membershipPlanId` by calling `membershipService.getMembershipPlanById(UUID planId)` from the `membership-core` feature.
    b.  Creates a new `Order` entity with `OrderStatus.PENDING`.
    c.  Creates `OrderItem` entities linked to the `Order` and the `MembershipPlan`.
    d.  Persists the `Order` and `OrderItem` entities using `orderRepository.save()`.
    e.  Returns an `OrderDto` representing the created order.
4.  The `OrderController` returns the `OrderDto` with HTTP status 201 Created.

### Member Order Retrieval:
1.  An authenticated member requests their orders via `OrderController.getMemberOrders()`.
2.  `OrderController` calls `OrderService.getOrdersByUserId(Long userId)`.
3.  `OrderService` retrieves orders from `orderRepository.findByUserId(Long userId)`.
4.  `OrderService` maps the `Order` entities to `OrderDto` and returns them.
5.  `OrderController` returns a list of `OrderDto` with HTTP status 200 OK.

### Admin Order Retrieval:
1.  An administrator requests all orders via `AdminOrderController.getAllOrders()`.
2.  `AdminOrderController` calls `OrderService.getAllOrders()`.
3.  `OrderService` retrieves all orders from `orderRepository.findAll()`.
4.  `OrderService` maps the `Order` entities to `OrderDto` and returns them.
5.  `AdminOrderController` returns a list of `OrderDto` with HTTP status 200 OK.

### Error Handling:
-   If a `MembershipPlan` is not found during order creation, `OrderService` throws a `ResourceNotFoundException` (from `shared-backend` feature), which `OrderController` translates to an HTTP 404 Not Found response.
-   Invalid input (e.g., missing fields in `CreateOrderRequest`) will result in `MethodArgumentNotValidException` (from `shared-backend` feature) handled globally, returning HTTP 400 Bad Request.

---

## Payment Integration (Backend)

**Name:** `payment-integration-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/vikramsfitnessstudio/service/PaymentService.java` — SERVICE layer — implements createPaymentOrder(UUID orderId, BigDecimal amount): PaymentOrderResponse and confirmPayment(PaymentConfirmationRequest request): void; delegates order status updates to OrderService.
- `backend/src/main/java/com/vikramsfitnessstudio/controller/PaymentController.java` — CONTROLLER layer — exposes API endpoints for creating payment orders and handling payment gateway webhooks.
- `backend/src/main/java/com/vikramsfitnessstudio/dto/PaymentConfirmationRequest.java` — DTO — defines the data structure for payment confirmation requests received from the payment gateway.
- `backend/src/main/java/com/vikramsfitnessstudio/dto/PaymentOrderResponse.java` — DTO — defines the data structure for responses containing payment gateway order details.

**Feature Instruction:**

This feature handles the backend integration with a payment gateway for processing membership purchases. It involves creating payment orders, handling payment confirmations via webhooks, and updating the order status in the `order-processing-backend` feature. The `PaymentService` orchestrates the interaction with the payment gateway, creating payment orders and verifying the integrity of payment confirmations. The `PaymentController` exposes an endpoint for the payment gateway to send webhook notifications, which are then processed by the `PaymentService`. DTOs like `PaymentConfirmationRequest` and `PaymentOrderResponse` facilitate data transfer between the frontend, backend, and payment gateway.

### PaymentService.java

This service is responsible for initiating payment orders and confirming payments. It will interact with a hypothetical external payment gateway API. For the purpose of this instruction, we will assume the payment gateway provides methods for creating an order and verifying a signature for a successful payment.

**`PaymentOrderResponse createPaymentOrder(UUID orderId, BigDecimal amount)`**
1.  **Input**: `orderId` (UUID) from the `order-processing-backend` and `amount` (BigDecimal) for the payment.
2.  **Logic**: Calls the external payment gateway API to create a new payment order. This involves sending the `orderId` and `amount`.
3.  **Output**: Returns a `PaymentOrderResponse` containing details like `paymentOrderId`, `currency`, `amount`, and `receipt` from the payment gateway.
4.  **Error Cases**: Throws `PaymentGatewayException` if the payment gateway API call fails.

**`void confirmPayment(PaymentConfirmationRequest request)`**
1.  **Input**: `request` (PaymentConfirmationRequest) containing payment confirmation details from the payment gateway webhook.
2.  **Logic**: 
    a.  Verifies the payment signature using the payment gateway's SDK or API to ensure the authenticity of the webhook.
    b.  If the signature is valid, extracts the `orderId` and `status` from the `request`.
    c.  Calls `orderService.updateOrderStatus(orderId, status)` from the `order-processing-backend` feature to update the order status.
3.  **Output**: Returns `void` upon successful confirmation and order status update.
4.  **Error Cases**: Throws `PaymentGatewayException` if signature verification fails or if the payment gateway reports an error. Throws `ResourceNotFoundException` if the `orderId` does not exist in the system.

### PaymentController.java

This controller exposes the API endpoint for the payment gateway webhook and for initiating payment orders from the frontend.

**`ResponseEntity<PaymentOrderResponse> createPaymentOrder(@RequestBody CreatePaymentOrderRequest createPaymentOrderRequest)`**
1.  **Endpoint**: `POST /api/v1/payments/orders`
2.  **Access**: `authenticated`
3.  **Input**: `createPaymentOrderRequest` (CreatePaymentOrderRequest) containing `orderId` and `amount`.
4.  **Logic**: Calls `paymentService.createPaymentOrder(createPaymentOrderRequest.getOrderId(), createPaymentOrderRequest.getAmount())`.
5.  **Output**: Returns `ResponseEntity` with `PaymentOrderResponse` and HTTP status 200 OK.
6.  **Error Cases**: Returns HTTP status 500 Internal Server Error if `PaymentGatewayException` occurs.

**`ResponseEntity<String> handlePaymentConfirmation(@RequestBody PaymentConfirmationRequest request)`**
1.  **Endpoint**: `POST /api/v1/payments/confirm`
2.  **Access**: `public` (as this is a webhook endpoint called by the payment gateway)
3.  **Input**: `request` (PaymentConfirmationRequest) from the payment gateway webhook.
4.  **Logic**: Calls `paymentService.confirmPayment(request)`.
5.  **Output**: Returns `ResponseEntity` with a success message and HTTP status 200 OK.
6.  **Error Cases**: Returns HTTP status 400 Bad Request if `PaymentGatewayException` occurs (e.g., invalid signature). Returns HTTP status 404 Not Found if `ResourceNotFoundException` occurs.

### PaymentConfirmationRequest.java

This DTO defines the structure of the payment confirmation payload received from the payment gateway webhook. It includes fields necessary for verifying the payment and updating the order status.

### PaymentOrderResponse.java

This DTO defines the structure of the response sent to the frontend after a payment order is successfully created with the payment gateway. It contains the necessary information for the frontend to proceed with the payment process (e.g., redirecting to the payment gateway or opening a payment modal).

**Interaction with OrderService:**
`PaymentService` depends on `OrderService` from the `order-processing-backend` feature to update the status of an order after a payment is confirmed. Specifically, `PaymentService.confirmPayment()` calls `orderService.updateOrderStatus(orderId, status)`.

---

## Inquiry Management (Backend)

**Name:** `inquiry-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/vikramsfitnessstudio/model/ContactMessage.java` — MODEL layer — represents a message submitted through the contact form, mapping to the 'contact_messages' database table.
- `backend/src/main/java/com/vikramsfitnessstudio/repository/ContactMessageRepository.java` — REPOSITORY layer — provides data access methods for ContactMessage entities, extending JpaRepository.
- `backend/src/main/java/com/vikramsfitnessstudio/service/ContactService.java` — SERVICE layer — implements submitContactMessage(ContactRequest): ContactMessage; delegates persistence to ContactMessageRepository and notification to NotificationService.
- `backend/src/main/java/com/vikramsfitnessstudio/controller/ContactController.java` — CONTROLLER layer — exposes a public API endpoint /api/v1/contact for submitting contact form messages.
- `backend/src/main/java/com/vikramsfitnessstudio/dto/ContactRequest.java` — DTO layer — data transfer object for contact form submissions.

**Feature Instruction:**

The Inquiry Management (Backend) feature handles the submission and processing of contact form messages from the website. It consists of a DTO for request data, a JPA entity for persistence, a repository for database operations, a service for business logic, and a controller for exposing the API endpoint.

### ContactRequest.java
This DTO defines the structure of the data submitted by users through the contact form. It includes fields for the sender's name, email, subject, and message, with appropriate validation annotations.

### ContactMessage.java
This is a JPA entity that maps to the `contact_messages` table in the database. It stores the details of each contact message, including a generated ID, the sender's name, email, subject, message content, and a timestamp for when the message was received.

### ContactMessageRepository.java
This Spring Data JPA repository provides standard CRUD operations for the `ContactMessage` entity. It extends `JpaRepository<ContactMessage, UUID>`, inheriting methods like `save()` and `findById()`.

### ContactService.java
This service class encapsulates the business logic for handling contact messages. It injects `ContactMessageRepository` to persist messages and `NotificationService` (from the `notification-service-backend` feature) to send email notifications. The `submitContactMessage` method performs the following steps:
1. Converts the `ContactRequest` DTO into a `ContactMessage` entity.
2. Sets the `receivedAt` timestamp to the current time.
3. Persists the `ContactMessage` entity using `contactMessageRepository.save()`.
4. Calls `notificationService.sendContactFormNotification()` to send an email to the studio administrators with the details of the submitted message.

**Public Functions:**
- `ContactMessage submitContactMessage(ContactRequest request)`:
  - Parameters: `ContactRequest request` - DTO containing contact form data.
  - Return Type: `ContactMessage` - The saved contact message entity.
  - Logic:
    1. Create a new `ContactMessage` instance from the `ContactRequest`.
    2. Set `receivedAt` to `LocalDateTime.now()`.
    3. Save the `ContactMessage` to the database using `contactMessageRepository.save()`.
    4. Call `notificationService.sendContactFormNotification(request.getName(), request.getEmail(), request.getSubject(), request.getMessage())`.
    5. Return the saved `ContactMessage`.
  - Error Cases: Throws `IllegalArgumentException` if the request is invalid (handled by `@Valid` in controller).

### ContactController.java
This REST controller exposes a public API endpoint for submitting contact messages. It injects `ContactService` to delegate the business logic. The `submitContactForm` method handles POST requests to `/api/v1/contact`.

**Public Functions:**
- `ResponseEntity<ContactMessage> submitContactForm(@Valid @RequestBody ContactRequest request)`:
  - Parameters: `@Valid @RequestBody ContactRequest request` - The contact form data.
  - Return Type: `ResponseEntity<ContactMessage>` - HTTP 201 Created with the saved `ContactMessage`.
  - Logic:
    1. Call `contactService.submitContactMessage(request)`.
    2. Return `ResponseEntity.status(HttpStatus.CREATED).body(savedMessage)`.
  - Error Cases:
    - `MethodArgumentNotValidException` (400 Bad Request) if `ContactRequest` validation fails (handled by `GlobalExceptionHandler`).
    - `Exception` (500 Internal Server Error) for other unexpected errors (handled by `GlobalExceptionHandler`).

**Inter-file Wiring:**
- `ContactController` injects `ContactService`.
- `ContactService` injects `ContactMessageRepository` and `NotificationService`.
- `ContactService.submitContactMessage()` calls `contactMessageRepository.save()` and `notificationService.sendContactFormNotification()`.


---

## Notification Service (Backend)

**Name:** `notification-service-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/vikramsfitnessstudio/service/NotificationService.java` — SERVICE layer — implements sendEmail(String to, String subject, String body): void; responsible for dispatching email notifications.

**Feature Instruction:**

The Notification Service (Backend) feature is responsible for sending various types of email notifications to users. This service integrates with an external email sending library (e.g., JavaMailSender) to dispatch emails for events such as booking confirmations, booking cancellations, and contact form submissions. It provides a single public method, `sendEmail`, which encapsulates the logic for constructing and sending emails based on the recipient's email address, subject, and content.

### `NotificationService.java`
This service class handles the core logic for sending emails. It will be injected into other services or controllers that need to send notifications. For example, the `inquiry-backend` feature's `ContactService` will inject `NotificationService` to send a confirmation email after a contact form submission.

#### Public Methods:

*   **`sendEmail(String to, String subject, String body)`**
    *   **Description:** Sends an email to the specified recipient with the given subject and body.
    *   **Parameters:**
        *   `String to`: The email address of the recipient.
        *   `String subject`: The subject line of the email.
        *   `String body`: The HTML or plain text content of the email.
    *   **Return Type:** `void`
    *   **Logic:**
        1.  Construct a `MimeMessage` using `JavaMailSender`.
        2.  Set the recipient (`to`), subject, and body of the email.
        3.  Set the `from` address (e.g., "noreply@vikramsfitnessstudio.com").
        4.  Send the email using `javaMailSender.send(mimeMessage)`.
    *   **Error Cases:**
        *   `MailException`: If there is an issue sending the email (e.g., invalid address, connection error). This exception should be caught and logged, but not re-thrown to avoid blocking the main business flow. The system should continue to operate even if a notification fails to send.

---

## Google Reviews Proxy (Backend)

**Name:** `google-reviews-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/vikramsfitnessstudio/controller/GoogleReviewController.java` — CONTROLLER layer — exposes a public API endpoint to fetch Google Reviews, acting as a secure proxy.
- `backend/src/main/java/com/vikramsfitnessstudio/dto/GoogleReviewDto.java` — DTO layer — defines the data structure for a single Google Review.

**Feature Instruction:**

This feature provides a secure backend proxy for fetching Google Reviews, preventing the exposure of the Google Places API key on the client-side. The `GoogleReviewController` exposes a single public endpoint `/api/v1/reviews` that frontend applications can call to retrieve a list of Google reviews. This controller internally calls the Google Places API to fetch reviews for 'Vikram's Fitness Studio' using a configured API key. The raw review data from Google is then mapped to a simplified `GoogleReviewDto` before being returned to the client. The `GoogleReviewDto` defines the structure of a single Google review, including fields like `authorName`, `profilePhotoUrl`, `rating`, `relativePublishTime`, and `text`.

---

## Authentication (Frontend)

**Name:** `authentication-frontend`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/api/client.ts` — Axios instance configuration — sets base URL and adds JWT interceptor for all API requests.
- `frontend/src/context/AuthContext.tsx` — React Context provider — manages global authentication state, providing `user`, `token`, `isAuthenticated`, `login(token: string, username: string, roles: string[]): void`, and `logout(): void` to the application.
- `frontend/src/hooks/useAuth.ts` — Custom React Hook — provides convenient access to authentication context values and actions via `useAuth(): { user: User | null, token: string | null, isAuthenticated: boolean, login: (token: string, username: string, roles: string[]) => void, logout: () => void, loading: boolean, loginUser: (credentials: AuthRequest) => Promise<void>, registerUser: (userData: RegisterRequest) => Promise<void> }`.
- `frontend/src/services/authService.ts` — Frontend Service — encapsulates API calls for user authentication, exposing `login(credentials: AuthRequest): Promise<AuthResponse>` and `register(userData: RegisterRequest): Promise<AuthResponse>`.
- `frontend/src/types/auth.ts` — Defines TypeScript types and interfaces for authentication data structures.
- `frontend/src/pages/LoginPage.tsx` — PAGE layer — displays login and registration forms, redirects authenticated users, and uses `Layout` from `core-ui-frontend`.
- `frontend/src/components/auth/LoginForm.tsx` — React Component — renders the user login form, uses `useAuth` for login logic, and applies client-side validation.
- `frontend/src/components/auth/RegisterForm.tsx` — React Component — renders the user registration form, uses `useAuth` for registration logic, and applies client-side validation.

**Feature Instruction:**

This feature implements the frontend authentication flow for Vikram's Fitness Studio, allowing users to register, log in, and manage their session. It includes API service calls, a React context for global authentication state, a custom hook for easy access to auth functions, and UI components for login and registration.

## Design Tokens
- Navbar: bg-[#0D1B2A] text-white
- Primary CTA: bg-[#F26419] hover:bg-[#E05A15] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#F26419]
- Section bg: bg-white (odd sections) / bg-[#F5F5F5] (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-[#333333] leading-relaxed

### `frontend/src/api/client.ts`
This file configures the global Axios instance. It sets the base URL for API requests to `/api/v1` and includes an interceptor to attach the JWT token from `localStorage` to every outgoing request's `Authorization` header. The token is stored under the key 'token'.

### `frontend/src/types/auth.ts`
This file defines the TypeScript interfaces for authentication-related data structures, including `AuthRequest`, `AuthResponse`, `RegisterRequest`, and `User`.

- `AuthRequest`: Represents the data sent for user login, containing `username: string` and `password: string`.
- `AuthResponse`: Represents the data received after successful login or registration, containing `token: string`, `username: string`, and `roles: string[]`.
- `RegisterRequest`: Represents the data sent for user registration, containing `username: string`, `password: string`, `email: string`, `firstName: string`, and `lastName: string`.
- `User`: Represents the authenticated user's profile, containing `username: string` and `roles: string[]`.

### `frontend/src/services/authService.ts`
This service provides asynchronous functions to interact with the backend authentication API endpoints. It uses the configured Axios instance from `frontend/src/api/client.ts`.

- `login(credentials: AuthRequest): Promise<AuthResponse>`:
  1. Makes a POST request to `/auth/login` with the provided `credentials`.
  2. Returns the `AuthResponse` data upon success.
  3. Throws an error if the API call fails.

- `register(userData: RegisterRequest): Promise<AuthResponse>`:
  1. Makes a POST request to `/auth/register` with the provided `userData`.
  2. Returns the `AuthResponse` data upon success.
  3. Throws an error if the API call fails.

### `frontend/src/context/AuthContext.tsx`
This React context manages the global authentication state of the application. It provides the `AuthContext` and `AuthProvider` components.

- `AuthContext` provides:
  - `user: User | null`: The currently authenticated user's details, or `null` if not authenticated.
  - `token: string | null`: The JWT token, or `null`.
  - `isAuthenticated: boolean`: A boolean indicating if a user is authenticated.
  - `login(token: string, username: string, roles: string[]): void`: Stores the token in `localStorage` under the key 'token', updates the context state with user details, and sets `isAuthenticated` to `true`.
  - `logout(): void`: Removes the token from `localStorage`, clears the user and token from context state, and sets `isAuthenticated` to `false`.
  - `loading: boolean`: A boolean indicating if the authentication state is currently being loaded (e.g., on initial app load).

- `AuthProvider`:
  1. On initial load, it attempts to retrieve the 'token' from `localStorage`.
  2. If a token is found, it would ideally validate it with the backend (though this feature does not implement token validation, it assumes a valid token implies authentication for the frontend).
  3. It initializes the `user`, `token`, and `isAuthenticated` states based on the presence and validity of the token.
  4. Provides the context values to its children.

### `frontend/src/hooks/useAuth.ts`
This custom React hook simplifies access to the `AuthContext`. It exports a `useAuth` function.

- `useAuth()`:
  1. Returns the `user`, `token`, `isAuthenticated`, `login`, `logout`, and `loading` values from the `AuthContext`.
  2. Provides convenience methods for `loginUser` and `registerUser` that wrap `authService.login` and `authService.register` respectively. These methods handle updating the `AuthContext` upon successful API calls.

### `frontend/src/components/auth/LoginForm.tsx`
This component renders the user login form.

- It uses `useAuth` to access the `loginUser` function.
- The form includes input fields for `username` and `password`.
- It implements basic client-side validation for required fields.
- On submission, it calls `loginUser` with the form data.
- Displays error messages for failed login attempts.
- The form elements should use Tailwind CSS for styling, adhering to the design tokens. The button should be a primary CTA style.

### `frontend/src/components/auth/RegisterForm.tsx`
This component renders the user registration form.

- It uses `useAuth` to access the `registerUser` function.
- The form includes input fields for `username`, `password`, `email`, `firstName`, and `lastName`.
- It implements basic client-side validation for required fields and password confirmation.
- On submission, it calls `registerUser` with the form data.
- Displays error messages for failed registration attempts.
- The form elements should use Tailwind CSS for styling, adhering to the design tokens. The button should be a primary CTA style.

### `frontend/src/pages/LoginPage.tsx`
This page serves as the entry point for user authentication, displaying both the `LoginForm` and `RegisterForm`.

- It wraps its content with the `Layout` component from `core-ui-frontend`.
- It uses `useAuth` to check `isAuthenticated` and redirects authenticated users to the dashboard or home page.
- The page should have a clear heading like "Welcome to Vikram's Fitness Studio" (text-[#333333]) and subheadings for "Login" and "Register" (text-[#0D1B2A]).
- The layout should present the login and registration forms side-by-side or in separate tabs/sections, allowing users to easily switch between them.
- The background should use `bg-[#F5F5F5]`.
- Placeholder copy for buttons should be "Login" and "Register" respectively, using the primary CTA design token.


---

## Core UI (Frontend)

**Name:** `core-ui-frontend`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/App.tsx` — Root component that sets up application-wide routing and provides authentication context.
- `frontend/src/components/Layout.tsx` — Main application layout component for public-facing pages, integrating Header, Footer, and content.
- `frontend/src/components/Header.tsx` — Application header component displaying navigation, logo, and user authentication status.
- `frontend/src/components/Footer.tsx` — Application footer component displaying contact information, social media links, and sitemap.
- `frontend/src/components/ProtectedRoute.tsx` — Wrapper component that restricts access to routes based on user authentication and roles.
- `frontend/src/components/AdminLayout.tsx` — Layout component for the admin dashboard, including a sidebar for navigation.
- `frontend/src/components/common/WhatsAppCta.tsx` — A floating action button for quick WhatsApp inquiries.

**Feature Instruction:**

The Core UI (Frontend) feature provides the foundational structure and common components for the entire React application. It includes the main application entry point (`App.tsx`), the public-facing layout (`Layout.tsx`), the admin-specific layout (`AdminLayout.tsx`), essential navigation elements (`Header.tsx`, `Footer.tsx`), a protected route wrapper (`ProtectedRoute.tsx`), and a common WhatsApp CTA component (`WhatsAppCta.tsx`).

## Design Tokens
- Navbar: bg-[#0D1B2A] text-white
- Primary CTA: bg-[#F26419] hover:bg-[#E05A15] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#F26419]
- Section bg: bg-[#F5F5F5] (odd sections) / bg-white (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-[#333333] leading-relaxed

### `App.tsx`
This file serves as the root component, responsible for setting up the application's routing using `react-router-dom`. It wraps the entire application within the `AuthProvider` from the `authentication-frontend` feature to provide authentication context to all child components. The main routes include public pages, authenticated member pages, and protected admin pages. Public routes like `/`, `/about`, `/contact`, `/classes`, `/memberships`, and `/blog` are accessible to all users. Authenticated routes like `/member/dashboard`, `/member/bookings`, and `/member/progress` are wrapped by `ProtectedRoute` to ensure only logged-in users can access them. Admin routes under `/admin/*` are also wrapped by `ProtectedRoute` and require the user to have an 'ADMIN' role.

### `Layout.tsx`
This component defines the standard layout for public-facing pages. It includes the `Header` at the top, the main content area (passed as `children`), and the `Footer` at the bottom. It also incorporates the `WhatsAppCta` component for easy access to support. The layout ensures a consistent look and feel across all public pages, applying global styling and responsive design principles.

### `Header.tsx`
The `Header` component displays the studio's logo, main navigation links, and user authentication status. It consumes the `useAuth` hook from the `authentication-frontend` feature to determine if a user is logged in and to display appropriate links (e.g., 'Login'/'Register' or 'Member Portal'/'Logout'). Navigation links should include 'Home', 'Classes', 'Memberships', 'Blog', 'About Us', and 'Contact'. The header should be responsive, adapting its layout for mobile and desktop views.

### `Footer.tsx`
This component provides consistent footer content across the application. It includes Vikram's Fitness Studio's contact information (address, phone), social media links, and a sitemap. The contact details should be displayed verbatim:
- Address: Chinar Heights, 33/9, Prabhat Rd, opp. Shri Mahila Griha Udyog Lijjat Papad Factory, Abhiman Society, Kachare Colony, Papad, Pune, Maharashtra 411004
- Phone: 095277 30493

### `ProtectedRoute.tsx`
This component acts as a guard for routes that require authentication or specific roles. It takes `children` (the component to render if authorized) and an optional `allowedRoles` array. It uses the `useAuth` hook to check the user's authentication status and roles. If the user is not authenticated, they are redirected to the `/login` page. If `allowedRoles` are specified, and the authenticated user does not possess any of the required roles, they are redirected to a `/` or `/member/dashboard` page, depending on whether they are a regular member or an unprivileged authenticated user. This component ensures that sensitive routes are only accessible to authorized users.

### `AdminLayout.tsx`
This component provides a distinct layout for the admin dashboard. It includes a sidebar for admin-specific navigation links (e.g., 'Dashboard', 'Manage Classes', 'Manage Memberships', 'Manage Blog Posts') and a main content area. This layout ensures that admin pages have a consistent interface separate from the public-facing site. The sidebar should be collapsible and responsive.

### `WhatsAppCta.tsx`
This component renders a floating WhatsApp button that, when clicked, opens a WhatsApp chat with the studio's contact number. The button should be positioned consistently (e.g., bottom-right) across all public pages, providing an easy way for users to inquire. The WhatsApp number should be `9527730493` (without the leading zero or spaces).

---

## Static Pages (Frontend)

**Name:** `static-pages-frontend`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/HomePage.tsx` — PAGE layer — serves as the main landing page for the studio, integrating various components to showcase services and build trust.
- `frontend/src/components/home/HeroSection.tsx` — COMPONENT layer — displays a full-bleed hero image with a headline, subheadline, and a call-to-action button.
- `frontend/src/components/home/ValueProposition.tsx` — COMPONENT layer — highlights the studio's core value propositions and unique selling points.
- `frontend/src/components/home/ClassHighlights.tsx` — COMPONENT layer — showcases a selection of featured fitness classes by consuming the `useBookings` hook.
- `frontend/src/components/home/Testimonials.tsx` — COMPONENT layer — displays a rotating carousel of Google Reviews by consuming the `useReviews` hook.
- `frontend/src/components/home/CtaSection.tsx` — COMPONENT layer — provides a prominent call-to-action to encourage user engagement.
- `frontend/src/pages/AboutPage.tsx` — PAGE layer — presents detailed information about the studio's philosophy, history, and trainers.
- `frontend/src/pages/ContactPage.tsx` — PAGE layer — provides contact details, an inquiry form, and an embedded map for the studio's location.
- `frontend/src/components/contact/ContactForm.tsx` — COMPONENT layer — provides a form for users to submit inquiries, utilizing the `useContact` hook.
- `frontend/src/components/contact/LocationMap.tsx` — COMPONENT layer — embeds a Google Map displaying the studio's physical location.
- `frontend/src/pages/NotFoundPage.tsx` — PAGE layer — displays a user-friendly message for invalid or non-existent routes.
- `frontend/src/hooks/useContact.ts` — HOOK layer — provides the `submitContactForm` function for submitting contact inquiries to the backend.
- `frontend/src/services/contactService.ts` — SERVICE layer — handles API communication for submitting contact messages.
- `frontend/src/types/contact.ts` — Generated from the backend API contract — defines TypeScript types for contact form requests and responses.
- `frontend/src/hooks/useReviews.ts` — HOOK layer — provides the `getReviews` function for fetching Google Reviews from the backend.
- `frontend/src/services/reviewService.ts` — SERVICE layer — handles API communication for fetching Google Reviews.
- `frontend/src/types/review.ts` — Generated from the backend API contract — defines TypeScript types for Google Review data.

**Feature Instruction:**

This feature implements all static public-facing pages of Vikram's Fitness Studio, including the homepage, about page, contact page, and a 404 not found page. It focuses on presenting the studio's brand, services, and contact information in an expert, encouraging, and supportive tone, utilizing a clean and professional design.

## Design Tokens
- Navbar: bg-[#0D1B2A] text-white
- Primary CTA: bg-[#F26419] hover:bg-[#E05A16] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200
- Secondary CTA: bg-[#1B998B] hover:bg-[#177F73] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#F26419]
- Section bg: bg-[#F5F5F5] (odd sections) / bg-white (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-[#333333] leading-relaxed

## HomePage.tsx
This page serves as the main landing page for Vikram's Fitness Studio. It will be structured into several key sections:
1.  **HeroSection**: A full-bleed hero image with a compelling headline and subheadline, and a primary call-to-action to 'Book a Free Trial'. The hero image should be relevant to fitness, such as https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80, with a dark overlay.
2.  **ValueProposition**: This section will highlight Vikram's Fitness Studio's unique selling points, focusing on sustainable weight loss and lifestyle disease management. It should include encouraging and expert copy.
3.  **ClassHighlights**: This section will showcase a few featured fitness classes. It will fetch class data using the `useBookings` hook from the `booking-frontend` feature and display them in an appealing grid or carousel format. Each class card should display `name`, `description`, `startTime`, `endTime`, and `instructor` from the `FitnessClassDto`.
4.  **Testimonials**: This section will display a rotating carousel of Google Reviews to build social proof. It will fetch review data using the `useReviews` hook, which in turn calls the `reviewService.getReviews()` function.
5.  **CtaSection**: A prominent call-to-action section, encouraging users to take the next step, such as 'Join Our Community' or 'View All Classes'.

All sections should use the defined design tokens for colors, typography, and spacing.

## HeroSection.tsx
This component will render the hero section for the `HomePage.tsx`. It will accept `headline`, `subheadline`, and `ctaText` as props. The background image will be a full-bleed image with a dark overlay, as specified in the design tokens. The CTA button will navigate to the `/classes` page.

## ValueProposition.tsx
This component will display the studio's core value propositions. It will consist of several distinct points, each with a heading and a descriptive paragraph, emphasizing the studio's health-first, sustainable approach.

## ClassHighlights.tsx
This component will display a selection of featured fitness classes. It will use the `useBookings` hook to fetch a list of `FitnessClassDto` objects. It should display a maximum of 3-4 classes, each in a card format. Each card will show the class `name`, `description`, `startTime`, `endTime`, and `instructor`. A 'View All Classes' CTA will navigate to the `/classes` page.

## Testimonials.tsx
This component will display a carousel of testimonials. It will use the `useReviews` hook to fetch `GoogleReviewDto` objects. Each testimonial card will display the `authorName`, `profilePhotoUrl`, `rating`, `relativePublishTime`, and `text` of the review.

## CtaSection.tsx
This component will render a prominent call-to-action section. It will include a headline, a brief supportive message, and a primary CTA button that navigates to the `/memberships` page.

## AboutPage.tsx
This page will provide detailed information about Vikram's Fitness Studio. It will include sections on:
1.  **Our Philosophy**: A section detailing the studio's health-first, sustainable approach to fitness.
2.  **Our Story**: A brief history of Vikram's Fitness Studio.
3.  **Meet Our Trainers**: Information about the studio's trainers, potentially including their specializations and a brief bio. This section should use placeholder trainer data.

All sections should use the defined design tokens for colors, typography, and spacing.

## ContactPage.tsx
This page will provide contact information and a form for inquiries. It will include:
1.  **ContactForm**: A component allowing users to submit inquiries. This form will use the `useContact` hook to handle form submission.
2.  **LocationMap**: An embedded Google Map showing the studio's location.
3.  **Contact Details**: Display the studio's address, phone number, and opening hours as provided in the business context.

All sections should use the defined design tokens for colors, typography, and spacing.

## ContactForm.tsx
This component will render a form with fields for `name`, `email`, `subject`, and `message`. It will use the `useContact` hook to manage form state and submission. Upon successful submission, a success message should be displayed, and the form should be reset. Error messages should be displayed for invalid inputs or failed submissions.

## LocationMap.tsx
This component will embed a Google Map centered on the studio's coordinates (18.513863, 73.829895). It should display a marker at the studio's location. The map should be responsive.

## NotFoundPage.tsx
This page will serve as a user-friendly 404 error page. It will display a clear message indicating that the requested page was not found and provide a link back to the homepage.

## useContact.ts
This hook provides the `submitContactForm` function for sending contact messages. It uses `contactService.submitContactMessage` to make the API call. It manages loading and error states.

### `submitContactForm(contactData: ContactRequest): Promise<void>`
1.  Calls `contactService.submitContactMessage(contactData)`.
2.  Handles success and error states, updating internal loading and error flags.
3.  Throws an error if the API call fails.

## contactService.ts
This service handles API calls related to contact form submissions. It exports `submitContactMessage`.

### `submitContactMessage(contactData: ContactRequest): Promise<ContactMessage>`
1.  Makes a POST request to `/api/v1/contact` with `contactData` as the request body.
2.  Returns the `ContactMessage` response from the backend.
3.  Throws an error if the request fails.

## contact.ts
This file defines the TypeScript interfaces for `ContactRequest` and `ContactMessage`.

## useReviews.ts
This hook provides the `getReviews` function for fetching Google Reviews. It uses `reviewService.getReviews` to make the API call and manages loading and error states.

### `getReviews(): Promise<GoogleReviewDto[]>`
1.  Calls `reviewService.getReviews()`.
2.  Handles success and error states, updating internal loading and error flags.
3.  Returns an array of `GoogleReviewDto`.
4.  Throws an error if the API call fails.

## reviewService.ts
This service handles API calls to the Google Reviews proxy endpoint. It exports `getReviews`.

### `getReviews(): Promise<GoogleReviewDto[]>`
1.  Makes a GET request to `/api/v1/reviews`.
2.  Returns a list of `GoogleReviewDto` from the backend.
3.  Throws an error if the request fails.

## review.ts
This file defines the TypeScript interface for `GoogleReviewDto`.

---

## Membership UI (Frontend)

**Name:** `membership-frontend`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/MembershipPage.tsx` — PAGE layer — displays available membership plans; consumes data from `useMemberships` hook.
- `frontend/src/components/membership/MembershipPlanCard.tsx` — COMPONENT layer — displays details of a single membership plan and initiates purchase via `useOrders`.
- `frontend/src/hooks/useMemberships.ts` — HOOK layer — provides functions for fetching membership plan data by calling `membershipService.getAllMembershipPlans()`.
- `frontend/src/services/membershipService.ts` — SERVICE layer — makes API calls to membership-related endpoints, specifically `getAllMembershipPlans()`.
- `frontend/src/types/membership.ts` — Generated from the backend API contract — defines TypeScript types for membership plans and user subscriptions.
- `frontend/src/pages/PaymentSuccessPage.tsx` — PAGE layer — displays a confirmation message after a successful membership payment.
- `frontend/src/hooks/useOrders.ts` — HOOK layer — provides functions for creating orders and handling payment redirection by calling `orderService`.
- `frontend/src/services/orderService.ts` — SERVICE layer — makes API calls to order and payment-related endpoints, specifically `createOrder()` and `createPaymentOrder()`.
- `frontend/src/types/order.ts` — Generated from the backend API contract — defines TypeScript types for orders and payment data.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#0D1B2A] text-white
- Primary CTA: bg-[#F26419] hover:bg-[#E05A15] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#F26419]
- Section bg: bg-[#F5F5F5] (odd sections) / bg-white (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-[#333333] leading-relaxed

## Feature Instruction: Membership UI (Frontend)

This feature provides the user interface for viewing and purchasing membership plans, as well as a confirmation page for successful payments. It interacts with the `membership-api` and `order-processing-backend` features to fetch membership plan data and create orders, respectively. It also integrates with the `payment-integration-backend` for handling payment processing.

### Data Flow and Interactions

1.  **`MembershipPage.tsx`**: This page is the entry point for users to browse membership plans. It utilizes the `useMemberships` hook to fetch all available membership plans. It renders these plans using `MembershipPlanCard` components.

2.  **`useMemberships.ts`**: This hook provides the `getAllMembershipPlans` function, which calls `membershipService.getAllMembershipPlans()` to retrieve membership plan data from the backend. It manages loading states and errors.

3.  **`membershipService.ts`**: This service is responsible for making API calls to the `membership-api` backend. It contains the `getAllMembershipPlans()` function, which performs a GET request to `/api/v1/memberships/plans`.

4.  **`MembershipPlanCard.tsx`**: This component displays the details of a single `MembershipPlanDto`. It includes a "Join Now" button that, when clicked, will initiate the purchase process. This button will trigger the `createOrder` function from the `useOrders` hook, passing the `membershipPlanId` and a quantity of 1. Upon successful order creation, it will redirect the user to the payment success page.

5.  **`useOrders.ts`**: This hook provides the `createOrder` function, which calls `orderService.createOrder()` to create a new order in the backend. It also handles the redirection to the payment success page upon successful order creation.

6.  **`orderService.ts`**: This service is responsible for making API calls to the `order-processing-backend` and `payment-integration-backend`. It contains:
    *   `createOrder(membershipPlanId: UUID, quantity: number)`: This function performs a POST request to `/api/v1/orders` with a `CreateOrderRequest` containing the `membershipPlanId` and `quantity`. Upon successful order creation, it then calls `paymentService.createPaymentOrder()` (from `payment-integration-backend`) to initiate the payment process.
    *   `createPaymentOrder(orderId: UUID, amount: BigDecimal)`: This function performs a POST request to `/api/v1/payments/orders` with the `orderId` and `amount` to get payment gateway details. It then redirects the user to the payment gateway if a redirect URL is provided.

7.  **`PaymentSuccessPage.tsx`**: This page is displayed after a successful membership payment. It will display a confirmation message. It can potentially use the `useOrders` hook to fetch order details based on a query parameter (e.g., `orderId`) to display specific information about the purchased membership.

8.  **`membership.ts` and `order.ts`**: These files define the TypeScript interfaces for `MembershipPlanDto`, `UserMembershipDto`, `OrderDto`, `OrderItemDto`, `CreateOrderRequest`, `PaymentOrderResponse`, and `PaymentConfirmationRequest`, ensuring type safety across the frontend application.

### Error Handling

All API calls should include appropriate error handling using `try-catch` blocks. Errors should be logged to the console and, where appropriate, displayed to the user using toast notifications or similar UI feedback mechanisms.

### Authentication

API calls to `/api/v1/memberships/plans` are public. However, creating an order via `/api/v1/orders` requires an authenticated user. The `api/client.ts` interceptor will automatically attach the JWT token from `localStorage.getItem('token')` to authenticated requests.

## File-Specific Instructions

### `MembershipPage.tsx`

*   **Structure**: The page should use the `Layout` component from `core-ui-frontend`. It will have a hero section with a headline and subheadline, followed by a section displaying the membership plans in a grid.
*   **Hero Section**: 
    *   Headline: "Unlock Your Potential with Vikram's Fitness Studio Memberships"
    *   Subheadline: "Invest in your long-term health and achieve sustainable results with our personalized plans."
    *   CTA Text: "View Our Classes"
    *   CTA Link: "/classes"
    *   Background Image: `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80` with a `bg-black bg-opacity-50` overlay.
*   **Membership Plans Section**: This section will display a loading spinner while `useMemberships` is fetching data. If an error occurs, it will display an error message. Otherwise, it will render a grid of `MembershipPlanCard` components, each displaying a `MembershipPlanDto`.

### `MembershipPlanCard.tsx`

*   **Props**: It will accept a `MembershipPlanDto` as a prop.
*   **Layout**: Each card will display the plan's `name`, `description`, `price`, and `durationInMonths`. The "Join Now" button will be styled using the Primary CTA design token.
*   **Action**: On clicking "Join Now", it will call `useOrders().createOrder` with the plan's `id` and a quantity of 1.

### `useMemberships.ts`

*   **Functionality**: This hook will provide a `memberships` state (type `MembershipPlanDto[]`), `isLoading` state, and `error` state. It will use `useEffect` to call `membershipService.getAllMembershipPlans()` on component mount.

### `membershipService.ts`

*   **Functionality**: This service will contain an `async` function `getAllMembershipPlans()` that makes a GET request to `/api/v1/memberships/plans` and returns a `Promise<MembershipPlanDto[]>`.

### `membership.ts`

*   **Types**: Define `MembershipPlanDto` and `UserMembershipDto` interfaces based on the `membership-api` data shapes.

### `PaymentSuccessPage.tsx`

*   **Structure**: The page should use the `Layout` component from `core-ui-frontend`. It will display a success message and potentially details about the purchased membership.
*   **Content**: Display a prominent "Payment Successful!" message. Include a message like "Thank you for becoming a member of Vikram's Fitness Studio. Your journey to a healthier you begins now!" Provide a button to navigate to the member dashboard.

### `useOrders.ts`

*   **Functionality**: This hook will provide an `async` function `createOrder(membershipPlanId: UUID, quantity: number)` that calls `orderService.createOrder()`. It will also manage loading and error states. Upon successful order creation, it will navigate to the `/payment-success` page.

### `orderService.ts`

*   **Functionality**: This service will contain two `async` functions:
    *   `createOrder(membershipPlanId: UUID, quantity: number)`: Makes a POST request to `/api/v1/orders` with a `CreateOrderRequest`. On success, it calls `createPaymentOrder`.
    *   `createPaymentOrder(orderId: UUID, amount: BigDecimal)`: Makes a POST request to `/api/v1/payments/orders` to initiate payment. It expects a `PaymentOrderResponse` and will handle redirection to the payment gateway if a `paymentGatewayOrderId` is returned.

### `order.ts`

*   **Types**: Define `OrderDto`, `OrderItemDto`, `CreateOrderRequest`, `PaymentOrderResponse`, and `PaymentConfirmationRequest` interfaces based on the `order-processing-backend` and `payment-integration-backend` data shapes.


---

## Booking UI (Frontend)

**Name:** `booking-frontend`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/ClassesPage.tsx` — PAGE layer — Displays the weekly class schedule by consuming data and functions from the `useBookings` hook and rendering the `ClassSchedule` component.
- `frontend/src/components/booking/ClassSchedule.tsx` — COMPONENT layer — A presentational component for displaying fitness classes and handling user interactions (booking/cancellation) via props.
- `frontend/src/hooks/useBookings.ts` — HOOK layer — Provides state and functions for fetching fitness classes and managing user bookings, abstracting API calls via `bookingService.ts`.
- `frontend/src/services/bookingService.ts` — SERVICE layer — Handles API calls to the backend booking endpoints, providing functions for fetching classes, creating bookings, getting user bookings, and canceling bookings.
- `frontend/src/types/booking.ts` — Generated from the backend API contract — Defines TypeScript interfaces for `FitnessClassDto`, `BookingDto`, and `CreateBookingRequest`.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#0D1B2A] text-white
- Primary CTA: bg-[#1B998B] hover:bg-[#157a6e] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#1B998B]
- Section bg: bg-[#F5F5F5] (odd sections) / bg-white (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-[#333333] leading-relaxed

## Feature Instruction: Booking UI (Frontend)

This feature provides the user interface for viewing fitness classes and managing personal bookings at Vikram's Fitness Studio. It consists of a main `ClassesPage.tsx` for displaying the weekly schedule, a reusable `ClassSchedule.tsx` component, a `useBookings.ts` hook for data fetching and mutation, a `bookingService.ts` for API interactions, and `booking.ts` for defining TypeScript types.

### Data Types (`booking.ts`)

The `booking.ts` file defines the TypeScript interfaces for `FitnessClassDto`, `BookingDto`, and `CreateBookingRequest` which mirror the backend DTOs from the `booking-api` feature. These types ensure strong typing throughout the frontend booking flow.

```

typescript
export interface FitnessClassDto {
  id: number;
  name: string;
  description: string;
  startTime: string; // LocalDateTime from backend, use string for ISO format
  endTime: string;   // LocalDateTime from backend, use string for ISO format
  instructor: string;
  maxCapacity: number;
  currentBookedSlots: number;
}

export interface BookingDto {
  id: number;
  userId: number;
  fitnessClassId: number;
  bookingTime: string; // LocalDateTime from backend, use string for ISO format
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
}

export interface CreateBookingRequest {
  fitnessClassId: number;
}


```

### API Service (`bookingService.ts`)

`bookingService.ts` is responsible for making HTTP requests to the `booking-api` backend. It uses the `apiClient` from `frontend/src/api/client.ts` to handle authenticated requests. It exports the following asynchronous functions:

- `getAllFitnessClasses(): Promise<FitnessClassDto[]>`: Fetches all available fitness classes. Calls `GET /api/v1/classes`.
- `createBooking(request: CreateBookingRequest): Promise<BookingDto>`: Creates a new booking for the authenticated user. Calls `POST /api/v1/bookings`.
- `getUserBookings(): Promise<BookingDto[]>`: Fetches all bookings for the authenticated user. Calls `GET /api/v1/bookings/my-bookings`.
- `cancelBooking(bookingId: number): Promise<BookingDto>`: Cancels a specific booking for the authenticated user. Calls `DELETE /api/v1/bookings/{bookingId}`.

Error handling in `bookingService.ts` should catch network errors or API errors and re-throw them for the hooks to handle.

### React Hook (`useBookings.ts`)

The `useBookings.ts` hook provides the state and functions necessary for the `ClassesPage.tsx` and `ClassSchedule.tsx` components. It leverages `react-query` or similar for data fetching, caching, and mutation management. It exports the following:

- `useBookings()`: A custom hook that returns an object with:
    - `fitnessClasses: FitnessClassDto[]`: A list of all available fitness classes.
    - `userBookings: BookingDto[]`: A list of bookings for the currently authenticated user.
    - `isLoadingClasses: boolean`: Loading state for fitness classes.
    - `isLoadingBookings: boolean`: Loading state for user bookings.
    - `errorClasses: Error | null`: Error object if fetching classes fails.
    - `errorBookings: Error | null`: Error object if fetching bookings fails.
    - `bookClass(fitnessClassId: number): Promise<void>`: Function to create a new booking. On success, it should invalidate and refetch `userBookings` and `fitnessClasses` to reflect the updated `currentBookedSlots`.
    - `cancelUserBooking(bookingId: number): Promise<void>`: Function to cancel an existing booking. On success, it should invalidate and refetch `userBookings` and `fitnessClasses`.
    - `isBookingLoading: boolean`: Loading state for booking creation.
    - `isCancelLoading: boolean`: Loading state for booking cancellation.

This hook will call the functions defined in `bookingService.ts`.

### Component (`ClassSchedule.tsx`)

The `ClassSchedule.tsx` component is a presentational component that displays a list or calendar view of fitness classes. It receives `fitnessClasses` and `userBookings` as props, along with `onBookClass` and `onCancelBooking` callback functions.

```

typescript
interface ClassScheduleProps {
  fitnessClasses: FitnessClassDto[];
  userBookings: BookingDto[];
  onBookClass: (fitnessClassId: number) => void;
  onCancelBooking: (bookingId: number) => void;
  isLoading: boolean;
  isBookingLoading: boolean;
  isCancelLoading: boolean;
}

const ClassSchedule: React.FC<ClassScheduleProps> = ({ fitnessClasses, userBookings, onBookClass, onCancelBooking, isLoading, isBookingLoading, isCancelLoading }) => {
  // ... component implementation
}


```

It should:
1. Display classes grouped by day and time.
2. For each class, show `name`, `instructor`, `startTime`, `endTime`, `description`, `currentBookedSlots`, and `maxCapacity`.
3. Indicate if a class is full (`currentBookedSlots === maxCapacity`).
4. For authenticated users, show a 'Book Now' button for available classes they haven't booked, and a 'Cancel Booking' button for classes they have booked.
5. Disable 'Book Now' if the class is full or `isBookingLoading` is true.
6. Disable 'Cancel Booking' if `isCancelLoading` is true.
7. Provide visual feedback (e.g., spinners) when `isBookingLoading` or `isCancelLoading` is true.
8. Use the design tokens for styling, particularly for buttons and card backgrounds.

### Page (`ClassesPage.tsx`)

The `ClassesPage.tsx` is the main page for displaying the fitness class schedule. It uses the `Layout` component from `core-ui-frontend` for consistent navigation and footer.

It should:
1. Fetch fitness classes and user bookings using the `useBookings` hook.
2. Display a prominent heading: "Our Class Schedule" with an encouraging sub-heading like "Find your perfect workout and book your spot today!"
3. Render the `ClassSchedule` component, passing the data and booking/cancellation functions from `useBookings`.
4. Show loading indicators while `isLoadingClasses` or `isLoadingBookings` is true.
5. Display error messages if `errorClasses` or `errorBookings` are present.
6. The page structure should follow the `Section container` design token.
7. The hero section should feature a background image relevant to fitness, with an overlay, and the studio's name and a compelling headline.

```

typescript
// Example structure for ClassesPage.tsx
import React from 'react';
import Layout from '@/components/Layout';
import { useBookings } from '@/hooks/useBookings';
import { ClassSchedule } from '@/components/booking/ClassSchedule';

const ClassesPage: React.FC = () => {
  const { fitnessClasses, userBookings, isLoadingClasses, isLoadingBookings, errorClasses, errorBookings, bookClass, cancelUserBooking, isBookingLoading, isCancelLoading } = useBookings();

  return (
    <Layout>
      <section className="relative bg-cover bg-center h-96" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white">Vikram's Fitness Studio</h1>
          <p className="mt-4 text-xl md:text-2xl font-light">Find your perfect workout and book your spot today!</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0D1B2A] text-center mb-8">Our Class Schedule</h2>
          {isLoadingClasses || isLoadingBookings ? (
            <p className="text-center text-[#333333]">Loading classes...</p>
          ) : errorClasses || errorBookings ? (
            <p className="text-center text-red-500">Error loading classes: {errorClasses?.message || errorBookings?.message}</p>
          ) : (
            <ClassSchedule
              fitnessClasses={fitnessClasses}
              userBookings={userBookings}
              onBookClass={bookClass}
              onCancelBooking={cancelUserBooking}
              isLoading={isLoadingClasses || isLoadingBookings}
              isBookingLoading={isBookingLoading}
              isCancelLoading={isCancelLoading}
            />
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ClassesPage;


```

---

## Content Display (Frontend)

**Name:** `content-frontend`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/BlogPage.tsx` — PAGE layer — displays a list of blog posts using the `useBlog` hook and `BlogCard` components.
- `frontend/src/pages/BlogPostDetailPage.tsx` — PAGE layer — displays the full content of a single blog post based on its ID from the URL, using the `useBlog` hook.
- `frontend/src/components/blog/BlogCard.tsx` — COMPONENT layer — displays a summary of a blog post, linking to its detail page.
- `frontend/src/hooks/useBlog.ts` — HOOK layer — provides functions for fetching blog posts from `blogService.ts` and manages their loading state and errors.
- `frontend/src/services/blogService.ts` — SERVICE layer — makes API calls to blog-related endpoints in the `content-management-backend` feature.
- `frontend/src/types/blog.ts` — Generated from the backend API contract — defines the TypeScript type for `BlogPostDto`.

**Feature Instruction:**

This feature, Content Display (Frontend), is responsible for rendering blog posts to the public. It consists of two main pages: `BlogPage.tsx` which displays a list of blog post summaries, and `BlogPostDetailPage.tsx` which shows the full content of a single blog post. These pages utilize the `useBlog.ts` hook to fetch data from the backend. The `useBlog.ts` hook, in turn, interacts with `blogService.ts` to make API calls to the `/api/v1/blog` and `/api/v1/blog/{id}` endpoints provided by the `content-management-backend` feature. The `BlogCard.tsx` component is used on the `BlogPage.tsx` to display individual blog post summaries, consuming the `BlogPostDto` type defined in `blog.ts`. All frontend components adhere to the design tokens derived from the provided color scheme and visual direction.

## Design Tokens
- Navbar: bg-[#0D1B2A] text-white
- Primary CTA: bg-[#F26419] hover:bg-[#E05A17] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#F26419]
- Section bg: bg-[#F5F5F5] (odd sections) / bg-white (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-[#333333] leading-relaxed

### `BlogPage.tsx`
This page displays a grid of blog posts. It should fetch all blog posts using `useBlog().getAllBlogPosts()` and render them using `BlogCard` components. The page should have a clear heading "Our Latest Insights" with an encouraging tone. Each `BlogCard` should link to the `BlogPostDetailPage` for the respective blog post.

### `BlogPostDetailPage.tsx`
This page displays the full content of a single blog post. It should extract the blog post ID from the URL parameters and use `useBlog().getBlogPostById(id)` to fetch the specific blog post. The content should be rendered with appropriate typography and spacing, reflecting the professional and encouraging tone. The page should display the title, author, publication date, and the full content of the blog post.

### `BlogCard.tsx`
This component receives a `BlogPostDto` as a prop. It should display the blog post's title, a truncated summary of its content, the author, and the publication date. It should also include a placeholder image (e.g., a relevant Unsplash image for fitness/health) and a "Read More" button that navigates to the `BlogPostDetailPage` for that post. The card should use the `Card` design token for its styling.

### `useBlog.ts`
This hook provides functions to interact with the `blogService.ts`. It should expose `getAllBlogPosts(): Promise<BlogPostDto[]>` and `getBlogPostById(id: UUID): Promise<BlogPostDto>`. It should manage loading states and errors for these operations.

### `blogService.ts`
This service is responsible for making actual API calls to the `content-management-backend`. It should have two asynchronous functions:
1. `getAllBlogPosts(): Promise<BlogPostDto[]>`: Makes a GET request to `/api/v1/blog`.
2. `getBlogPostById(id: UUID): Promise<BlogPostDto>`: Makes a GET request to `/api/v1/blog/{id}`.
Both functions should handle potential network errors and return the data or throw an error.

### `blog.ts`
This file defines the TypeScript interface for `BlogPostDto`, which mirrors the `BlogPostDto` data shape from the `content-management-backend` feature.

---

## Member Portal (Frontend)

**Name:** `member-portal-frontend`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/MemberDashboardPage.tsx` — PAGE layer — the main dashboard for logged-in members, displaying upcoming bookings, membership status, and progress summary.
- `frontend/src/pages/MyBookingsPage.tsx` — PAGE layer — displays all personal bookings and allows cancellation.
- `frontend/src/pages/MyProgressPage.tsx` — PAGE layer — allows members to log workouts and track fitness progress.
- `frontend/src/components/member/UpcomingBookings.tsx` — COMPONENT layer — displays a summary of the member's next few bookings.
- `frontend/src/components/member/MembershipStatus.tsx` — COMPONENT layer — displays the member's current membership plan and expiry date.
- `frontend/src/components/member/ProgressChart.tsx` — COMPONENT layer — displays a chart of the member's recent progress.
- `frontend/src/components/member/BookingsTable.tsx` — COMPONENT layer — displays a table of a member's booking history with options to cancel.
- `frontend/src/components/member/ProgressTrackerForm.tsx` — COMPONENT layer — a form for members to input new progress metrics or workout logs.
- `frontend/src/components/member/ProgressHistoryChart.tsx` — COMPONENT layer — a detailed chart visualizing a member's progress over a selected time period.
- `frontend/src/hooks/useProgress.ts` — HOOK layer — provides functions for fetching and submitting member progress data.
- `frontend/src/services/progressService.ts` — SERVICE layer — handles API calls to progress tracking endpoints, exposing logWorkout(WorkoutLogDto): Promise<WorkoutLogDto>, getWorkoutLogs(): Promise<WorkoutLogDto[]>, logProgressMetric(ProgressMetricDto): Promise<ProgressMetricDto>, and getProgressMetrics(string): Promise<ProgressMetricDto[]>.
- `frontend/src/types/progress.ts` — Generated from the backend API contract — TypeScript types for workout logs and progress metrics.

**Feature Instruction:**

This feature provides the frontend for the member portal of Vikram's Fitness Studio, allowing logged-in members to view their dashboard, manage bookings, and track their fitness progress. It consists of three main pages: `MemberDashboardPage.tsx`, `MyBookingsPage.tsx`, and `MyProgressPage.tsx`, along with several reusable components and custom hooks.

## Design Tokens
- Navbar: bg-[#0D1B2A] text-white
- Primary CTA: bg-[#1B998B] hover:bg-[#1B998B] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#1B998B]
- Section bg: bg-[#F5F5F5] (odd sections) / bg-white (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-[#333333] leading-relaxed

### MemberDashboardPage.tsx
This page serves as the central hub for members. It uses the `AdminLayout` component from `core-ui-frontend` for consistent navigation and styling. The page is divided into sections displaying key information:
1.  **Welcome Section**: A greeting to the logged-in member, emphasizing their fitness journey.
2.  **Upcoming Bookings**: This section renders the `UpcomingBookings` component, which fetches and displays a summary of the member's next few fitness class bookings using the `useBookings` hook. It shows `FitnessClassDto` details such as `name`, `startTime`, and `instructor`.
3.  **Membership Status**: This section renders the `MembershipStatus` component, which fetches and displays the member's current membership plan details using the `useMemberships` hook. It shows `UserMembershipDto` details like `membershipPlanName`, `startDate`, `endDate`, and `status`.
4.  **Progress Summary**: This section renders the `ProgressChart` component, which fetches and displays a visual summary of the member's recent fitness progress using the `useProgress` hook. It displays `ProgressMetricDto` data.

### MyBookingsPage.tsx
This page allows members to view and manage all their personal bookings. It uses the `AdminLayout` component. It utilizes the `useBookings` hook to fetch `BookingDto` and `FitnessClassDto` data. The page renders the `BookingsTable` component, which displays a list of bookings. The `BookingsTable` component will allow members to cancel bookings by calling the `cancelUserBooking(bookingId: number)` function from the `useBookings` hook.

### MyProgressPage.tsx
This page is dedicated to tracking and logging fitness progress. It uses the `AdminLayout` component. It leverages the `useProgress` hook to fetch and submit `WorkoutLogDto` and `ProgressMetricDto` data. The page includes:
1.  **Progress Tracker Form**: This section renders the `ProgressTrackerForm` component, allowing members to input new workout logs or progress metrics. The form will call `logWorkout(workoutLog: WorkoutLogDto)` or `logProgressMetric(metric: ProgressMetricDto)` from the `useProgress` hook.
2.  **Progress History Chart**: This section renders the `ProgressHistoryChart` component, which visualizes the member's historical progress data fetched via the `useProgress` hook.

### Components
-   **UpcomingBookings.tsx**: Displays a card-like summary of upcoming bookings. It consumes `useBookings` to get `BookingDto` and `FitnessClassDto` data.
-   **MembershipStatus.tsx**: Displays the member's current membership plan and its expiry. It consumes `useMemberships` to get `UserMembershipDto` data.
-   **ProgressChart.tsx**: Renders a chart visualizing recent progress. It consumes `useProgress` to get `ProgressMetricDto` data.
-   **BookingsTable.tsx**: Displays a detailed table of all bookings. It takes `BookingDto[]` as props and provides functionality to cancel bookings by calling `onCancelBooking(bookingId: number)` passed as a prop.
-   **ProgressTrackerForm.tsx**: A form for logging new workouts or metrics. It takes `onSubmit(data: WorkoutLogDto | ProgressMetricDto)` as a prop.
-   **ProgressHistoryChart.tsx**: Displays a detailed chart of historical progress. It takes `ProgressMetricDto[]` or `WorkoutLogDto[]` as props.

### Hooks
-   **useProgress.ts**: This custom hook provides an interface to interact with the `progressService.ts`. It exposes `progressMetrics: ProgressMetricDto[]`, `workoutLogs: WorkoutLogDto[]`, `isLoading: boolean`, `error: Error | null`, `logWorkout(workoutLog: WorkoutLogDto): Promise<void>`, `logProgressMetric(metric: ProgressMetricDto): Promise<void>`, `getWorkoutLogs(): Promise<void>`, and `getProgressMetrics(metricName: string): Promise<void>`. It uses `progressService.logWorkout`, `progressService.getWorkoutLogs`, `progressService.logProgressMetric`, and `progressService.getProgressMetrics`.

### Services
-   **progressService.ts**: This service handles API calls related to member progress tracking. It uses the `api/client.ts` for HTTP requests. It provides the following functions:
    -   `logWorkout(workoutLog: WorkoutLogDto): Promise<WorkoutLogDto>`: Makes a POST request to `/api/v1/progress/workouts` with the `WorkoutLogDto` as the request body. Returns the created `WorkoutLogDto`.
    -   `getWorkoutLogs(): Promise<WorkoutLogDto[]>`: Makes a GET request to `/api/v1/progress/workouts`. Returns a list of `WorkoutLogDto`.
    -   `logProgressMetric(metric: ProgressMetricDto): Promise<ProgressMetricDto>`: Makes a POST request to `/api/v1/progress/metrics` with the `ProgressMetricDto` as the request body. Returns the created `ProgressMetricDto`.
    -   `getProgressMetrics(metricName: string): Promise<ProgressMetricDto[]>`: Makes a GET request to `/api/v1/progress/metrics?metricName={metricName}`. Returns a list of `ProgressMetricDto`.

### Types
-   **progress.ts**: Defines TypeScript interfaces for `WorkoutLogDto` and `ProgressMetricDto`, mirroring the backend DTOs from `progress-tracking-backend`.

This feature relies on `authentication-frontend` for user authentication and `core-ui-frontend` for shared layout components. It consumes APIs from `booking-api`, `membership-api`, and `progress-tracking-backend`.

---

## Admin Portal (Frontend)

**Name:** `admin-portal-frontend`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/AdminDashboardPage.tsx` — PAGE layer — the main entry point for the admin portal, providing navigation to other management sections.
- `frontend/src/pages/AdminMembershipPlansPage.tsx` — PAGE layer — manages membership plans, displaying them in a table and providing forms for creation/editing.
- `frontend/src/components/admin/membership/MembershipPlansTable.tsx` — COMPONENT layer — displays a table of membership plans with edit and delete actions.
- `frontend/src/components/admin/membership/MembershipPlanForm.tsx` — COMPONENT layer — a form for creating or editing membership plans.
- `frontend/src/pages/AdminClassesPage.tsx` — PAGE layer — manages fitness classes, displaying them in a table and providing forms for creation/editing.
- `frontend/src/components/admin/classes/ClassesTable.tsx` — COMPONENT layer — displays a table of fitness classes with edit and delete actions.
- `frontend/src/components/admin/classes/ClassForm.tsx` — COMPONENT layer — a form for creating or editing fitness classes.
- `frontend/src/pages/AdminBlogPage.tsx` — PAGE layer — manages blog posts, displaying them in a table and providing forms for creation/editing.
- `frontend/src/components/admin/blog/BlogPostsTable.tsx` — COMPONENT layer — displays a table of blog posts with edit and delete actions.
- `frontend/src/components/admin/blog/BlogPostForm.tsx` — COMPONENT layer — a form for creating or editing blog posts.
- `frontend/src/components/admin/common/DeleteConfirmationDialog.tsx` — COMPONENT layer — a reusable dialog for confirming delete operations.

**Feature Instruction:**

The Admin Portal (Frontend) feature provides a comprehensive web interface for administrators of Vikram's Fitness Studio to manage various aspects of the business, including membership plans, fitness classes, and blog posts. It leverages the `AdminLayout` from the `core-ui-frontend` feature for consistent navigation and styling, and interacts with the backend APIs provided by `membership-api`, `booking-api`, and `content-management-backend` features.

## Design Tokens
- Admin Navbar: bg-[#0D1B2A] text-white
- Primary CTA: bg-[#1B998B] hover:bg-[#1B998B] text-white font-semibold rounded-md px-4 py-2 transition-all duration-200
- Secondary CTA: bg-[#F26419] hover:bg-[#F26419] text-white font-semibold rounded-md px-4 py-2 transition-all duration-200
- Brand text accent: text-[#1B998B]
- Section bg: bg-[#F5F5F5]
- Card: bg-white rounded-lg shadow-sm border border-gray-100 p-4
- Section container: <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
- Body: text-[#333333] leading-relaxed

### AdminDashboardPage.tsx
This page serves as the entry point for the admin portal, providing an overview and navigation links to other admin sections. It should display a welcoming message and cards or links to 'Manage Membership Plans', 'Manage Fitness Classes', and 'Manage Blog Posts'. It uses the `AdminLayout` component for consistent header and sidebar navigation.

### AdminMembershipPlansPage.tsx
This page allows administrators to manage membership plans. It fetches all membership plans using the `useMemberships` hook (from `membership-frontend` feature), which in turn calls the `getAllMembershipPlans` API from `membership-api`. It displays these plans in a `MembershipPlansTable` component. It also provides functionality to create and edit membership plans using the `MembershipPlanForm` component, and to delete plans, which will trigger a `DeleteConfirmationDialog`.

### MembershipPlansTable.tsx
This component displays a sortable and filterable table of `MembershipPlanDto` objects. Each row should include the plan's `name`, `description`, `price`, `durationInMonths`, and `isActive` status. It provides actions to 'Edit' and 'Delete' each plan. The 'Edit' action opens the `MembershipPlanForm` pre-filled with the plan's data. The 'Delete' action opens the `DeleteConfirmationDialog`.

### MembershipPlanForm.tsx
This component is a form for creating or editing a `MembershipPlanDto`. It should be rendered within a dialog or modal. When creating a new plan, the form fields will be empty. When editing, the form fields will be pre-populated with the existing plan's data. It includes fields for `name` (string, required), `description` (string, optional), `price` (BigDecimal, required), `durationInMonths` (Integer, required), and `isActive` (boolean, required). On submission, it calls the `createMembershipPlan` or `updateMembershipPlan` functions from the `useMemberships` hook, which then interacts with the `membership-api` backend.

### AdminClassesPage.tsx
This page allows administrators to manage fitness classes. It fetches all fitness classes using the `useBookings` hook (from `booking-frontend` feature), which in turn calls the `getAllFitnessClasses` API from `booking-api`. It displays these classes in a `ClassesTable` component. It also provides functionality to create and edit fitness classes using the `ClassForm` component, and to delete classes, which will trigger a `DeleteConfirmationDialog`.

### ClassesTable.tsx
This component displays a sortable and filterable table of `FitnessClassDto` objects. Each row should include the class's `name`, `description`, `startTime`, `endTime`, `instructor`, `maxCapacity`, and `currentBookedSlots`. It provides actions to 'Edit' and 'Delete' each class. The 'Edit' action opens the `ClassForm` pre-filled with the class's data. The 'Delete' action opens the `DeleteConfirmationDialog`.

### ClassForm.tsx
This component is a form for creating or editing a `FitnessClassDto`. It should be rendered within a dialog or modal. When creating a new class, the form fields will be empty. When editing, the form fields will be pre-populated with the existing class's data. It includes fields for `name` (string, required), `description` (string, optional), `startTime` (LocalDateTime, required), `endTime` (LocalDateTime, required), `instructor` (string, required), and `maxCapacity` (Integer, required). On submission, it calls the `createFitnessClass` or `updateFitnessClass` functions from the `useBookings` hook, which then interacts with the `booking-api` backend.

### AdminBlogPage.tsx
This page allows administrators to manage blog posts. It fetches all blog posts using the `useBlog` hook (from `content-frontend` feature), which in turn calls the `getAllBlogPosts` API from `content-management-backend`. It displays these posts in a `BlogPostsTable` component. It also provides functionality to create and edit blog posts using the `BlogPostForm` component, and to delete posts, which will trigger a `DeleteConfirmationDialog`.

### BlogPostsTable.tsx
This component displays a sortable and filterable table of `BlogPostDto` objects. Each row should include the post's `title`, `author`, `publicationDate`, and `lastModifiedDate`. It provides actions to 'Edit' and 'Delete' each post. The 'Edit' action opens the `BlogPostForm` pre-filled with the post's data. The 'Delete' action opens the `DeleteConfirmationDialog`.

### BlogPostForm.tsx
This component is a form for creating or editing a `BlogPostDto`. It should be rendered within a dialog or modal. When creating a new post, the form fields will be empty. When editing, the form fields will be pre-populated with the existing post's data. It includes fields for `title` (string, required), `content` (string, required), `author` (string, required), and `publicationDate` (LocalDate, required). On submission, it calls the `createBlogPost` or `updateBlogPost` functions from the `useBlog` hook, which then interacts with the `content-management-backend` backend.

### DeleteConfirmationDialog.tsx
This is a reusable dialog component that prompts the user for confirmation before performing a delete action. It accepts `isOpen` (boolean), `onClose` (function), `onConfirm` (function), and `resourceName` (string) as props. The dialog should have a clear title like "Confirm Deletion" and a message like "Are you sure you want to delete this [resourceName]? This action cannot be undone." It should have 'Cancel' and 'Delete' buttons, styled appropriately for a destructive action.

---

## Infrastructure

**Name:** `infrastructure`  
**Type:** INFRA  
**Change required:** true

**Feature Instruction:**

_Not enriched (INFRA or skipped)._

---

