
# Real-time Collaborative Kanban Task Manager

A modern, real-time collaborative Kanban board built with React, Node.js, Socket.IO, and MongoDB. Features smart task assignment, conflict resolution, and live activity tracking.

## 🚀 Features

- **Real-time Collaboration**: Live updates using Socket.IO
- **Smart Task Assignment**: Automatically assigns tasks to least busy team members
- **Conflict Resolution**: Handles simultaneous editing with merge/overwrite options
- **Drag & Drop**: Intuitive task management with smooth animations
- **Activity Feed**: Live tracking of all team actions
- **Card Flip Animation**: Click cards to see detailed information
- **Responsive Design**: Works seamlessly on desktop and mobile
- **JWT Authentication**: Secure user authentication
- **Priority Management**: Visual priority indicators
- **Status Tracking**: Todo, In Progress, Done columns

## 🛠 Tech Stack

**Frontend:**
- React 18 with TypeScript
- Custom CSS (no UI libraries)
- Socket.IO Client
- Drag & Drop API

**Backend:**
- Node.js + Express
- MongoDB with Mongoose
- Socket.IO for real-time features
- JWT for authentication
- bcryptjs for password hashing

## 📦 Installation

### Backend Setup

1. Navigate to server directory:
```bash
cd server
npm install
```

2. Create `.env` file with provided credentials
3. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm run dev
```

## 🎯 Usage

1. **Register/Login**: Create an account or sign in
2. **Create Tasks**: Click "New Task" to add tasks
3. **Drag & Drop**: Move tasks between columns
4. **Smart Assign**: Use the 🎯 button for automatic assignment
5. **View Details**: Click cards to flip and see details
6. **Track Activity**: Open the activity panel to see live updates
7. **Resolve Conflicts**: Handle simultaneous edits with merge/overwrite options

## 🎨 Key Features Explained

### Smart Assignment Algorithm
The smart assign feature automatically assigns tasks to the team member with the fewest active (Todo/In Progress) tasks, ensuring balanced workload distribution.

### Conflict Resolution
When two users edit the same task simultaneously, the system detects conflicts and provides three resolution options:
- **Keep Current**: Use the server version
- **Use My Version**: Overwrite with your changes  
- **Merge Changes**: Combine both versions (recommended)

### Real-time Updates
All changes are instantly synchronized across all connected clients using Socket.IO, providing a truly collaborative experience.

### Activity Logging
Every action (create, update, delete, assign) is logged and displayed in the live activity feed with timestamps and user information.

### Backend (Render/Railway/Cyclic)
1. Create new service
2. Connect your GitHub repository
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set environment variables with production API URLs
4. Deploy

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 📱 Mobile Responsive

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)  
- Mobile (320px - 767px)

## 🎨 Animations & UX

- Smooth card transitions and hover effects
- Drag and drop visual feedback
- Card flip animation on click
- Loading states and spinners
- Real-time connection status indicator
- Gradient backgrounds and modern styling

## 🔧 Environment Variables

### Backend (.env)
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Frontend (.env)
```
REACT_APP_API_URL=your_backend_api_url
REACT_APP_SOCKET_URL=your_backend_socket_url
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email your-email@example.com or create an issue in the GitHub repository.
