# IRO GEMS Backend

This is the Node.js/Express backend for the IRO GEMS e-commerce website.

## Prerequisites
- Node.js installed
- MongoDB Atlas account (for database)

## Setup
1.  Navigate to the `Backend` directory:
    ```bash
    cd Backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    - Open `.env` file.
    - Replace `your_mongodb_connection_string_here` with your actual MongoDB Atlas connection string.
    - Ensure `PORT` is set to 5000 (default).

## Running the Server
- Development mode (restarts on changes):
    ```bash
    npm run dev
    ```
- Production mode:
    ```bash
    npm start
    ```

## API Endpoints
- **Products**: `GET /api/products`, `POST /api/products` (Create), `DELETE /api/products/:id`
- **Feedback**: `POST /api/feedback`, `GET /api/feedback`
- **Orders**: `POST /api/orders`, `GET /api/orders`

## Frontend Integration
The frontend files (`shop.js`, `payment.js`, `feedback.html`) have been updated to communicate with this backend running on `http://localhost:5000`.
