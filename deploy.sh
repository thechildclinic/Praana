#!/bin/bash

# Prana.ai Deployment Script
# This script handles the complete deployment process to Netlify

set -e  # Exit on any error

echo "🚀 Starting Prana.ai Deployment Process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Node.js version: $(node --version)"
print_status "npm version: $(npm --version)"

# Install dependencies
print_status "Installing dependencies..."
npm install

# Build the project
print_status "Building the project..."
npm run build

if [ ! -d "dist" ]; then
    print_error "Build failed - dist directory not found"
    exit 1
fi

print_success "Build completed successfully!"

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    print_warning "Netlify CLI not found. Installing globally..."
    npm install -g netlify-cli
fi

# Login to Netlify (if not already logged in)
print_status "Checking Netlify authentication..."
if ! netlify status &> /dev/null; then
    print_status "Please log in to Netlify..."
    netlify login
fi

# Deploy to Netlify
print_status "Deploying to Netlify..."

# First, deploy as a draft
print_status "Creating draft deployment..."
netlify deploy --dir=dist

# Ask for confirmation before production deployment
echo ""
read -p "Draft deployment successful! Deploy to production? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Deploying to production..."
    netlify deploy --prod --dir=dist
    print_success "🎉 Production deployment completed!"
    
    # Get the site URL
    SITE_URL=$(netlify status --json | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
    if [ ! -z "$SITE_URL" ]; then
        print_success "Your site is live at: $SITE_URL"
    fi
else
    print_status "Production deployment cancelled."
fi

echo ""
print_status "Deployment process completed!"
print_warning "Don't forget to:"
echo "  1. Add your audio files to assets/audio/ directory"
echo "  2. Set GEMINI_API_KEY environment variable in Netlify dashboard"
echo "  3. Test the deployed site thoroughly"
echo ""
print_success "Happy meditating! 🧘‍♀️"
