# Inventory Management System

A modern web application for managing inventory and orders, built with Nuxt 3 and Firebase.

## Features

### Product Management
- Add new products with detailed information:
    - Serial number
    - Title and type
    - Technical specifications
    - Product photos (with Firebase Storage)
    - Guarantee period
    - Prices in USD and UAH

### Order Management
- Create and manage orders
- Add multiple products to orders
- Track order status and history
- Calculate order totals in multiple currencies

### User Interface
- Responsive design with Bootstrap
- Bilingual support (English and Ukrainian)
- Real-time session tracking
- Image upload with preview
- Animated transitions and interactions

### Authentication
- Secure user authentication with Firebase
- Role-based access control
- Protected routes

## Technology Stack

- **Frontend**: Nuxt 3, Vue 3, TypeScript
- **UI Framework**: Bootstrap 5
- **State Management**: Pinia
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Internationalization**: Nuxt i18n
- **Animations**: Animate.css

## Getting Started

### Prerequisites
- Node.js 20 or higher
- Docker and Docker Compose (for containerized deployment)
- Firebase project with Authentication and Storage enabled

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd inventory-system
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with Firebase configuration:
```env
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-auth-domain
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
FIREBASE_APP_ID=your-app-id
```

4. Start development server:
```bash
npm run dev
```

### Docker Deployment

1. Build and run with Docker Compose:
```bash
docker-compose up --build
```

2. Access the application at `http://localhost:3000`

## Testing

Run tests with:
```bash
npm run test
```

Generate coverage report:
```bash
npm run test:coverage
```

## Project Structure

```
├── components/          # Vue components
│   ├── orders/         # Order management components
│   └── products/       # Product management components
├── composables/        # Reusable Vue composables
├── pages/              # Application routes
├── stores/             # Pinia stores
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── locales/           # Translation files
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.