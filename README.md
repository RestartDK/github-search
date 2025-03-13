# GitHub Search

ADD IMAGE HERE

A modern web application that allows users to search for GitHub profiles, view detailed user information, repositories, and various GitHub statistics. The application provides a clean and intuitive interface for exploring GitHub users and their contributions.

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn components
- **Language**: TypeScript
- **Testing**: Vitest, Testing Library
- **Component Development**: Storybook
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 20 or later
- pnpm package manager
- Git

### Environment Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   git clone https://github.com/RestartDK
   cd github-search
   ```

2. Create your environment file:
   ```bash
   cp .env.example .env.local
   ```

3. Edit the `.env.local` file with your GitHub API credentials:
   ```
   VITE_GITHUB_URL=https://api.github.com/
   VITE_GITHUB_TOKEN=your_github_token
   ```

### Running the Application

For running the app you can either run it locally or just use the docker compose to start the development server.

#### Method 1: Local Development

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

#### Method 2: Using Docker

1. Build and start the Docker container:
   ```bash
   docker compose up
   ```

2. The application will be available at:
   ```
   http://localhost:5173
   ```

### Storybook Component Explorer

This project includes Storybook for component development and visualization.

1. Start the Storybook server:
   ```bash
   pnpm storybook
   ```

2. View components in the Storybook UI at:
   ```
   http://localhost:6006
   ```

Storybook provides an isolated environment to develop, test, and showcase the UI components of the application without having to run the entire app.

## Running Tests

This project uses Vitest for testing the components and hooks.

### Running the Test Suite

```bash
# Run all tests
pnpm test

# Run Storybook tests
pnpm test-storybook

# Run with coverage report
pnpm test --coverage

```

### Running Tests in CI

The project is configured with GitHub Actions to automatically run tests on push and pull requests. See the `.github/workflows/test.yml` file for the configuration.

## Future Improvements

- [ ] Add dark and light theme support
- [ ] Improve responsive design for different screen sizes
- [ ] Add more detailed repository statistics
- [ ] Implement pagination for search results
- [ ] Add filtering options for repositories
- [ ] Enhance error handling and user feedback
- [ ] Optimize performance for large datasets
- [ ] Implement caching for frequently accessed profiles
- [ ] Add user authentication for accessing private repositories
- [ ] Improve accessibility features