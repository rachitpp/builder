# Resume Builder Application

A comprehensive full-stack resume builder application built with the MERN stack, TypeScript, Next.js, and Tailwind CSS. This application allows users to create, edit, download, and share professional resumes with ease.

![Resume Builder](https://via.placeholder.com/1200x630?text=Resume+Builder+Application)

## Features

- **User Authentication**: Sign up, login, logout, password reset
- **Dashboard**: Overview of user's resumes, stats, and recent activity
- **Multiple Templates**: Choose from various professionally designed resume templates
- **Resume Creation**: Easy-to-use form-based resume creation with step-by-step guidance
- **Resume Editing**: Full editing capabilities for all sections of the resume
- **Export Options**: Download resumes in PDF format
- **Public Sharing**: Option to make resumes public with a shareable link
- **Profile Management**: Update personal information and profile picture
- **Responsive Design**: Works on mobile, tablet, and desktop devices

## Tech Stack

### Frontend
- **Next.js**: React framework for server-side rendering and static site generation
- **TypeScript**: For type safety and better developer experience
- **Redux Toolkit**: For state management
- **Tailwind CSS**: For styling
- **Formik & Yup**: For form handling and validation
- **Axios**: For API requests

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework for Node.js
- **TypeScript**: For type safety and better developer experience
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: For authentication with refresh token support
- **Multer**: For file uploads (profile pictures)
- **Nodemailer**: For sending emails (verification, password reset)
- **Winston**: For advanced logging
- **Express Validator**: For input validation
- **Helmet**: For security headers
- **Compression**: For response compression

## Project Structure

```
├── backend/                   # Backend code
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   ├── app.ts         # Express app configuration
│   │   │   └── database.ts    # MongoDB connection setup
│   │   ├── controllers/       # Request handlers
│   │   │   ├── authController.ts
│   │   │   ├── resumeController.ts
│   │   │   ├── templateController.ts
│   │   │   └── userController.ts
│   │   ├── middlewares/       # Express middlewares
│   │   │   ├── authMiddleware.ts
│   │   │   └── errorMiddleware.ts
│   │   ├── models/            # Mongoose models
│   │   │   ├── userModel.ts
│   │   │   ├── resumeModel.ts
│   │   │   └── templateModel.ts
│   │   ├── routes/            # API routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── resumeRoutes.ts
│   │   │   ├── templateRoutes.ts
│   │   │   └── userRoutes.ts
│   │   ├── services/          # Business logic
│   │   │   ├── userService.ts
│   │   │   ├── resumeService.ts
│   │   │   └── templateService.ts
│   │   ├── types/             # TypeScript type definitions
│   │   │   ├── express.d.ts
│   │   │   └── environment.d.ts
│   │   ├── utils/             # Utility functions
│   │   │   ├── tokenUtil.ts
│   │   │   ├── emailUtil.ts
│   │   │   └── logger.ts
│   │   └── server.ts          # Entry point
│   ├── .env.example           # Environment variables example
│   ├── package.json           # Dependencies and scripts
│   └── tsconfig.json          # TypeScript configuration
│
├── frontend/                  # Frontend code
│   ├── app/                   # Next.js app directory
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (dashboard)/       # Dashboard related pages
│   │   ├── components/        # React components
│   │   ├── features/          # Redux slices
│   │   ├── lib/               # Utility functions and API client
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout component
│   │   ├── page.tsx           # Home page
│   │   └── providers.tsx      # Context providers
│   ├── public/                # Static files
│   ├── next.config.js         # Next.js configuration
│   ├── package.json           # Dependencies and scripts
│   ├── postcss.config.js      # PostCSS configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── tsconfig.json          # TypeScript configuration
│
└── README.md                  # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/resume-builder.git
   cd resume-builder
   ```

   Or download and extract the project if you received it as a zip file.

2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```

3. Create and configure environment variables
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. Install frontend dependencies
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Deployment

### Backend
- The backend can be deployed to platforms like Heroku, Render, or a VPS.
- Make sure to set up environment variables in your production environment.
- For production deployment:
  ```bash
  cd backend
  npm run build
  npm start
  ```

### Frontend
- The Next.js application can be deployed to Vercel, Netlify, or any static site hosting.
- Configure the production API URL in your environment variables.
- For production build:
  ```bash
  cd frontend
  npm run build
  npm start
  ```

## Architecture

### Backend Architecture
- **RESTful API Design**: Well-structured endpoints following REST principles
- **Service Layer Pattern**: Business logic is separated into service classes
- **Error Handling**: Centralized error handling with custom AppError class
- **Authentication**: JWT-based authentication with refresh tokens
- **Validation**: Request validation using express-validator
- **Logging**: Centralized logging with Winston

### Frontend Architecture
- **Component-Based**: Reusable UI components
- **State Management**: Centralized state management with Redux Toolkit
- **Form Handling**: Form management with Formik and Yup
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Routing**: Next.js app router for page navigation
- **API Communication**: Axios for API requests with interceptors

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Create Next App](https://nextjs.org/docs/api-reference/create-next-app)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)