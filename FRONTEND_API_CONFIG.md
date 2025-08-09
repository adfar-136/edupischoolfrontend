# Frontend API Configuration Guide

## Overview
The frontend now uses a centralized API configuration system to manage backend URLs and endpoints. This makes it easy to switch between local development and production environments.

## Configuration File
**Location**: `src/config/api.ts`

This file contains:
- `API_BASE_URL`: The base URL for your backend
- `API_ENDPOINTS`: All API endpoints organized by feature
- `SOCKET_URL`: WebSocket connection URL
- Helper functions for environment detection

## Switching Between Environments

### For Local Development
```typescript
// In src/config/api.ts
export const API_BASE_URL = 'http://localhost:8000';
```

### For Production
```typescript
// In src/config/api.ts
export const API_BASE_URL = 'https://edupischoolbackend.onrender.com';
```

## Usage in Components

### Basic Import
```typescript
import { API_ENDPOINTS } from '../config/api';
```

### Example Usage
```typescript
// Instead of hardcoded URLs:
const response = await fetch('https://edupischoolbackend.onrender.com/api/courses');

// Use the centralized endpoints:
const response = await fetch(API_ENDPOINTS.courses.list);
```

### Dynamic Endpoints
```typescript
// For endpoints with parameters:
const courseId = '123';
const response = await fetch(API_ENDPOINTS.courses.detail(courseId));
```

## Available Endpoint Categories

### Authentication
- `API_ENDPOINTS.auth.adminLogin`
- `API_ENDPOINTS.auth.adminVerify`
- `API_ENDPOINTS.auth.studentLogin`
- `API_ENDPOINTS.auth.studentRegister`

### Courses
- `API_ENDPOINTS.courses.list`
- `API_ENDPOINTS.courses.detail(id)`
- `API_ENDPOINTS.courses.create`
- `API_ENDPOINTS.courses.update(id)`
- `API_ENDPOINTS.courses.delete(id)`

### Enrollments
- `API_ENDPOINTS.enrollments.list`
- `API_ENDPOINTS.enrollments.byStudent(studentId)`
- `API_ENDPOINTS.enrollments.create`
- `API_ENDPOINTS.enrollments.updateStatus(enrollmentId, action)`

### Demo Requests
- `API_ENDPOINTS.demoRequests.list`
- `API_ENDPOINTS.demoRequests.create`
- `API_ENDPOINTS.demoRequests.update(id)`
- `API_ENDPOINTS.demoRequests.delete(id)`

### And many more...

## Migration Instructions

To migrate a file to use the centralized configuration:

### 1. Add Import
```typescript
import { API_ENDPOINTS } from '../config/api';
```

### 2. Replace Hardcoded URLs
```typescript
// Before:
const response = await fetch('https://edupischoolbackend.onrender.com/api/courses');

// After:
const response = await fetch(API_ENDPOINTS.courses.list);
```

### 3. Update WebSocket Connections
```typescript
// Before:
import { io } from 'socket.io-client';
const socket = io('https://edupischoolbackend.onrender.com');

// After:
import { SOCKET_URL } from '../config/api';
const socket = io(SOCKET_URL);
```

## Files Already Updated (Examples)
- ✅ `src/pages/Home.tsx`
- ✅ `src/pages/Login.tsx`
- ✅ `src/context/AuthContext.tsx`
- ✅ `src/context/SocketContext.tsx`

## Files Still Using Direct URLs
You can gradually migrate the remaining files:
- `src/pages/Courses.tsx`
- `src/pages/CourseDetail.tsx`
- `src/pages/CourseContent.tsx`
- `src/pages/StudentDashboard.tsx`
- `src/pages/AdminDashboard.tsx`
- `src/pages/Forums.tsx`
- `src/pages/ForumDetail.tsx`
- `src/pages/TopicDetail.tsx`
- `src/pages/Announcements.tsx`
- `src/components/QuizAttempt.tsx`
- And more...

## Benefits

1. **Single Point of Change**: Only modify `src/config/api.ts` to switch environments
2. **Type Safety**: TypeScript ensures endpoint consistency
3. **Maintainability**: All API endpoints are documented in one place
4. **Development Flexibility**: Easy to switch between local and production
5. **Code Organization**: Cleaner component code without hardcoded URLs

## Environment Detection

```typescript
import { isDevelopment, isProduction } from '../config/api';

if (isDevelopment()) {
  console.log('Running in development mode');
}

if (isProduction()) {
  console.log('Running in production mode');
}
```

## Next Steps

1. **Gradually migrate** remaining files to use `API_ENDPOINTS`
2. **Test thoroughly** after each migration
3. **Document any new endpoints** you add to the system
4. **Consider environment variables** for even more flexibility

---

**Note**: Currently using production URL. To switch to local development, simply change `API_BASE_URL` in `src/config/api.ts`.