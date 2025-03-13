FROM node:20-slim

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

# Expose the development port
EXPOSE 5173

# Start development server with host set to 0.0.0.0 to allow external access
CMD ["pnpm", "run", "dev", "--host", "0.0.0.0"]