# User Management CRUD

## Local development

Requirements: Node.js 20.19+ and a PostgreSQL database.

1. Set `DATABASE_URL` in `backend/.env` to your PostgreSQL connection string.
2. From `backend`, run `npm install`, `npx prisma migrate deploy`, then `npm run dev`.
3. From `crud`, run `npm install` then `npm run dev`.

The API listens on port 5000 by default. The frontend calls
`http://localhost:5000/api` unless `VITE_API_URL` is set.

## Deployment

- On Render, set `DATABASE_URL` and `PORT` as needed, and start the backend with
  `npm start`.
- On Vercel, set `VITE_API_URL` to the Render API base URL ending in `/api`
  (for example, `https://your-service.onrender.com/api`) before building.
