# Car Rental Frontend - React Application

This is the React frontend for the Car Rental application. It provides a modern, responsive user interface for browsing vehicles, making bookings, and managing reservations.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project
- Backend API running (see Car-rental-Service directory)

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd car-rental-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your configuration:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   REACT_APP_API_BASE_URL=http://localhost:5000
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/                 # React components
│   ├── Home.js                # Homepage with hero section
│   ├── Navbar.js              # Navigation bar
│   ├── Login.js               # User login form
│   ├── Signup.js              # User registration form
│   ├── VehicleList.js         # Vehicle listing with filters
│   ├── VehicleDetails.js      # Vehicle details and booking
│   ├── MyBookings.js          # User's booking history
│   ├── AdminDashboard.js      # Admin management panel
│   ├── ProtectedRoute.js      # Route protection component
│   └── css/                   # Component-specific styles
├── contexts/                  # React contexts
│   └── AuthContext.js         # Authentication state management
├── services/                  # External services
│   └── apiService.js          # Backend API communication
├── assets/                    # Static assets
│   └── car.jpg               # Default car image
├── supabaseClient.js         # Supabase configuration
├── App.js                    # Main application component
├── App.css                   # Global styles
└── index.js                  # Application entry point
```

## 🎨 Components Overview

### Public Components

#### Home Component
- **Purpose**: Landing page with hero section and featured vehicles
- **Features**:
  - Hero section with call-to-action
  - Quick search form with date pickers
  - Featured vehicles showcase
  - Features section

#### VehicleList Component
- **Purpose**: Browse and filter available vehicles
- **Features**:
  - Grid layout of vehicle cards
  - Sidebar filters (type, transmission, price range)
  - Real-time filtering
  - Responsive design

#### VehicleDetails Component
- **Purpose**: Detailed vehicle view with booking functionality
- **Features**:
  - Vehicle specifications display
  - Image gallery
  - Interactive date picker for booking
  - Real-time price calculation
  - Booking form

### Authentication Components

#### Login Component
- **Purpose**: User authentication
- **Features**:
  - Email/password login form
  - Error handling
  - Redirect after successful login
  - Link to registration

#### Signup Component
- **Purpose**: User registration
- **Features**:
  - Registration form with validation
  - Password confirmation
  - Error handling
  - Email verification notice

### Protected Components

#### MyBookings Component
- **Purpose**: User's booking management
- **Features**:
  - List of user's bookings
  - Booking status display
  - Cancellation functionality
  - Booking details

#### AdminDashboard Component
- **Purpose**: Admin panel for management
- **Features**:
  - Vehicle management (CRUD operations)
  - Booking overview
  - Tabbed interface
  - Form validation

### Utility Components

#### Navbar Component
- **Purpose**: Navigation and user status
- **Features**:
  - Responsive navigation
  - User authentication status
  - Role-based menu items
  - User dropdown

#### ProtectedRoute Component
- **Purpose**: Route access control
- **Features**:
  - Authentication checking
  - Admin role verification
  - Automatic redirects

## 🔧 Context & State Management

### AuthContext
Manages global authentication state:
- User login/logout
- Session management
- Role checking (admin/user)
- Token management

**Usage:**
```jsx
import { useAuth } from '../contexts/AuthContext'

function MyComponent() {
  const { user, signOut, isAdmin } = useAuth()
  // ... component logic
}
```

## 🌐 API Integration

### ApiService
Handles all backend communication:
- Vehicle operations
- Booking management
- Admin functions
- Error handling

**Usage:**
```jsx
import { apiService } from '../services/apiService'

// Get vehicles with filters
const vehicles = await apiService.getVehicles({ type: 'SUV' })

// Create booking
const booking = await apiService.createBooking(bookingData, authToken)
```

## 🎯 Features

### User Features
- **Vehicle Browsing**: View all available vehicles
- **Advanced Filtering**: Filter by type, transmission, price
- **Vehicle Details**: Comprehensive vehicle information
- **Date-based Booking**: Select pickup and return dates
- **Price Calculation**: Real-time total price updates
- **Booking Management**: View and cancel bookings
- **Responsive Design**: Works on all devices

### Admin Features
- **Vehicle Management**: Add, edit, delete vehicles
- **Booking Overview**: View all user bookings
- **Dashboard Interface**: Organized admin panel
- **Bulk Operations**: Manage multiple items

### Technical Features
- **Real-time Updates**: Live data synchronization
- **Optimistic UI**: Immediate feedback
- **Error Boundaries**: Graceful error handling
- **Loading States**: User feedback during operations
- **Form Validation**: Client-side input validation
- **Route Protection**: Secure access control

## 🔒 Authentication Flow

1. **User Registration/Login**: Handled by Supabase Auth
2. **Token Storage**: JWT tokens stored in browser
3. **Route Protection**: ProtectedRoute component checks authentication
4. **API Requests**: Include JWT token in Authorization header
5. **Role Checking**: Admin features only available to admin users

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
