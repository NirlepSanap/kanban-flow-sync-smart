
# Kanban Task Manager Backend

## Setup Instructions

1. Install dependencies:
```bash
cd server
npm install
```

2. Start the server:
```bash
npm run dev
```

The server will run on port 5000.

## Environment Variables

Create a `.env` file in the server directory with:
```
MONGO_URI=mongodb+srv://nirlepsanap2004:Nirlep%40123@cluster1.ygggny1.mongodb.net/kanban?retryWrites=true&w=majority&appName=Cluster1
JWT_SECRET=dsrsm72uadksq77hx9tmjgke4gr433p9
PORT=5000
```

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `PUT /api/tasks/:id/smart-assign` - Smart assign task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/logs` - Get activity logs

## WebSocket Events

- `task_created` - New task created
- `task_updated` - Task updated
- `task_deleted` - Task deleted
- `activity_logged` - New activity logged
