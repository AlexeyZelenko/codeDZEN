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

## Technology Stack

- **Frontend**: Nuxt 3, Vue 3, TypeScript
- **UI Framework**: Bootstrap 5
- **State Management**: Pinia
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **API**: GraphQL with Apollo Client
- **Maps**: Google Maps Platform
- **Internationalization**: Nuxt i18n
- **Animations**: Animate.css
- **Testing**:
  - Unit Tests: Vitest
  - E2E Tests: Playwright

## Getting Started

### Prerequisites

- Node.js 20 or higher
- Docker and Docker Compose (for containerized deployment)
- Firebase project with Authentication and Storage enabled
- Google Maps API key
- GraphQL endpoint

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
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
GRAPHQL_ENDPOINT=your-graphql-endpoint
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

### E2E Tests

Run Playwright end-to-end tests:

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode
npm run test:e2e:ui

# Run with debug mode
npm run test:e2e:debug

# Run all tests (unit + E2E)
npm run test:all
```

## Project Structure

```
├── components/          # Vue components
│   ├── maps/           # Google Maps components
│   ├── orders/         # Order management components
│   └── products/       # Product management components
├── composables/        # Reusable Vue composables
├── config/             # i18n configuration files
├── locales/            # Translation files
├── middleware/         # Nuxt middleware
├── pages/              # Application routes
├── playwright-report/  # Playwright test reports
├── plugins/            # Nuxt plugins
├── server/             # config server
├── services/           # websocket services
├── stores/             # Pinia stores
├── test-results/       # Test results
├── tests/              # Test files
│   ├── e2e/            # Playwright E2E tests
│   └── utils/          # Vitest unit tests
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── workers/            # Web workers
├── .env                # Environment variables
├── .dockerignore       # Docker ignore file
├── .gitignore          # Git ignore file
├── Dockerfile          # Docker build file
├── docker-compose.yml  # Docker Compose configuration
├── nuxt.config.ts      # Nuxt configuration
├── package.json        # NPM package file
├── README.md           # Project README
├── vitest.config       # Vitest configuration
└── tsconfig.json       # TypeScript configuration



```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
