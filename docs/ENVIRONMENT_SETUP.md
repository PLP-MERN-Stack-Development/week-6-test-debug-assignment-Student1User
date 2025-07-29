# Environment Setup Guide

This guide explains how to set up environment variables for the MERN Testing project.

## Quick Setup

1. **Copy the example files:**
   \`\`\`bash
   # Root directory
   cp .env.example .env
   
   # Client directory
   cp client/.env.example client/.env
   
   # Server directory
   cp server/.env.example server/.env
   \`\`\`

2. **Update the values** in each `.env` file according to your environment.

## Environment Files Overview

### Root `.env`
Contains shared configuration and project-wide settings.

### Client `.env` (`client/.env`)
Contains React application environment variables. Only variables prefixed with `REACT_APP_` are accessible in the browser.

### Server `.env` (`server/.env`)
Contains Node.js/Express server configuration variables.

## Required Variables

### Minimum Required for Development

**Server (`server/.env`):**
\`\`\`env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mern-testing
JWT_SECRET=your-jwt-secret-key
\`\`\`

**Client (`client/.env`):**
\`\`\`env
REACT_APP_API_URL=http://localhost:5000/api
\`\`\`

### Minimum Required for Production

**Server:**
\`\`\`env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-testing
JWT_SECRET=secure-production-jwt-secret
\`\`\`

**Client:**
\`\`\`env
REACT_APP_API_URL=https://your-api-domain.com/api
\`\`\`

## Database Setup

### Local MongoDB
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/mern-testing
MONGODB_TEST_URI=mongodb://localhost:27017/mern-testing-test
\`\`\`

### MongoDB Atlas
\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-testing?retryWrites=true&w=majority
\`\`\`

## Security Considerations

1. **Never commit `.env` files** to version control
2. **Use strong, unique secrets** for JWT and session keys
3. **Rotate secrets regularly** in production
4. **Use different secrets** for different environments
5. **Limit CORS origins** to trusted domains

## Testing Environment

The testing environment uses special configurations:

\`\`\`env
NODE_ENV=test
MONGODB_TEST_URI=mongodb://localhost:27017/mern-testing-test
DISABLE_LOGGING_IN_TESTS=true
\`\`\`

## Production Deployment

For production deployment, ensure:

1. **Strong JWT secrets** (at least 32 characters)
2. **Secure database connections** (MongoDB Atlas with authentication)
3. **Proper CORS origins** (your frontend domain)
4. **Error tracking** (Sentry DSN)
5. **Performance monitoring** enabled

## Environment Variable Validation

The application validates required environment variables on startup. Missing required variables will cause the application to exit with an error message.

## Troubleshooting

### Common Issues

1. **"Cannot connect to database"**
   - Check `MONGODB_URI` is correct
   - Ensure MongoDB is running (if local)
   - Verify network connectivity (if remote)

2. **"JWT secret not provided"**
   - Ensure `JWT_SECRET` is set in server environment
   - Check the variable name is correct

3. **"API calls failing"**
   - Verify `REACT_APP_API_URL` points to correct server
   - Check server is running on specified port
   - Ensure CORS is configured correctly

4. **"Tests failing"**
   - Check test database URI is different from development
   - Ensure test environment variables are set
   - Verify MongoDB Memory Server is working

### Debug Mode

Enable debug mode for more verbose logging:

\`\`\`env
DEBUG=true
LOG_LEVEL=debug
REACT_APP_DEBUG=true
\`\`\`

## Environment-Specific Configurations

### Development
- Detailed error messages
- Request logging enabled
- Debug tools enabled
- Local database connections

### Testing
- In-memory database
- Logging disabled
- Mock external services
- Faster timeouts

### Production
- Error tracking enabled
- Performance monitoring
- Secure connections
- Rate limiting enabled

## External Services Integration

### Optional Services

1. **Email Service (Gmail)**
   \`\`\`env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   \`\`\`

2. **Error Tracking (Sentry)**
   \`\`\`env
   SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
   REACT_APP_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
   \`\`\`

3. **File Storage (AWS S3)**
   \`\`\`env
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_S3_BUCKET=your-bucket-name
   \`\`\`

4. **Caching (Redis)**
   \`\`\`env
   REDIS_URL=redis://localhost:6379
   \`\`\`

## Best Practices

1. **Use different databases** for development, testing, and production
2. **Keep secrets secure** and rotate them regularly
3. **Document required variables** for team members
4. **Use environment-specific configurations**
5. **Validate environment variables** on application startup
6. **Use strong, unique secrets** for each environment
7. **Monitor environment variable usage** and access

## Getting Help

If you encounter issues with environment setup:

1. Check the troubleshooting section above
2. Verify all required variables are set
3. Ensure variable names match exactly (case-sensitive)
4. Check for typos in URLs and connection strings
5. Consult the application logs for specific error messages

For additional help, refer to the main README.md or create an issue in the project repository.
