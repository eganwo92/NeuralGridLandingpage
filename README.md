# NeuralGrid Landing Page

A modern, responsive landing page for NeuralGrid - an AI-powered marketplace platform.

## Features

- **Responsive Design**: Works on all devices and screen sizes
- **Interactive Animations**: Smooth scrolling and particle effects
- **Signup Form**: Collects user information with validation
- **Backend API**: Node.js server with MongoDB integration
- **AWS Ready**: Complete deployment configuration for AWS

## Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd neuralgrid-landingpage
   ```

2. **For local testing, use any static server**
   ```bash
   # Python
   python -m http.server 8080
   
   # Node.js
   npx serve . -p 8080
   ```

3. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: Deploy to AWS for full functionality

### AWS Deployment

1. **Prepare your environment**
   - AWS CLI configured
   - MongoDB Atlas account

2. **Deploy to AWS S3**
   ```bash
   chmod +x deploy-s3.sh
   ./deploy-s3.sh
   ```

## Project Structure

```
neuralgrid-landingpage/
├── index.html              # Main HTML file
├── styles.css              # CSS styles
├── script.js               # Frontend JavaScript
├── images/                 # Image assets
├── lambda/                 # Serverless backend API
│   ├── index.js           # Lambda function
│   └── package.json       # Lambda dependencies
├── aws-s3-cloudformation-template.json # S3 infrastructure
├── deploy-s3.sh           # S3 deployment script
├── README.md              # Project overview
└── S3-DEPLOYMENT.md       # Detailed S3 deployment guide
```

## Technology Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome icons
- Google Fonts (Inter)
- Responsive design with CSS Grid/Flexbox

### Backend
- AWS Lambda (Serverless)
- MongoDB Atlas
- API Gateway integration
- Input validation and sanitization

### Infrastructure
- AWS S3 (Static hosting)
- CloudFront CDN
- Lambda + API Gateway
- CloudFormation templates

## API Endpoints

### POST /api/signup
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "userType": "user",
  "category": "Programming",
  "feedback": "Looking forward to using AI agents",
  "referrer": "friend@example.com"
}
```

### GET /api/health
Health check endpoint

### GET /api/stats
Get signup statistics (admin)

## Configuration

### Environment Variables
- `NODE_ENV`: Environment (production/development)
- `PORT`: Backend server port
- `MONGODB_URI`: MongoDB connection string
- `FRONTEND_URL`: Frontend URL for CORS

### MongoDB Schema
```javascript
{
  name: String,
  email: String (unique),
  userType: String (user/developer),
  category: String,
  feedback: String,
  referrer: String,
  createdAt: Date,
  ipAddress: String,
  userAgent: String
}
```

## Security Features

- Rate limiting (10 req/s for API, 5/min for signup)
- Input validation and sanitization
- CORS protection
- Security headers
- MongoDB injection protection
- IP tracking for analytics

## Deployment Options

### 1. AWS S3 + Lambda (Recommended)
- Serverless architecture
- Cost-effective ($5-25/month)
- Automatic scaling
- Global CDN with CloudFront

### 2. Local Development
- Static file serving
- Frontend testing only
- No backend functionality

## Monitoring and Maintenance

### Health Checks
```bash
# Check Lambda function health
curl https://your-api-gateway-url.amazonaws.com/prod/api/health

# Check signup statistics
curl https://your-api-gateway-url.amazonaws.com/prod/api/stats
```

### Logs
```bash
# View Lambda logs
aws logs tail /aws/lambda/neuralgrid-api --follow

# View CloudFront logs (if enabled)
aws s3 ls s3://your-cloudfront-logs-bucket/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section in S3-DEPLOYMENT.md
2. Review Lambda logs in CloudWatch
3. Check AWS CloudWatch metrics
4. Contact the development team

## Roadmap

- [ ] Add user authentication
- [ ] Implement email notifications
- [ ] Add analytics dashboard
- [ ] Support for multiple languages
- [ ] Mobile app integration
- [ ] Advanced AI agent features