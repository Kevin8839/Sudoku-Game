# React Sudoku App

A mobile-friendly, single-page Sudoku game built with React, TypeScript, and Tailwind CSS.

## How to Deploy to GitHub Pages

This project is configured as a fully static Single Page Application (SPA), which means it can be hosted directly on GitHub Pages for free!

### Deployment Steps:

1. **Upload to GitHub**:
   - Create a new repository on GitHub.
   - Push this code to the `main` branch of your repository.

2. **Enable GitHub Actions Deployment**:
   - Go to your repository settings on GitHub.
   - Click on **Pages** in the left sidebar.
   - Under **Build and deployment**, set the **Source** to **GitHub Actions**.
   - (A `.github/workflows/deploy.yml` file is already included in this repository to handle the automated deployment).

3. **Enjoy your site**:
   - Any push to the `main` or `master` branch will automatically trigger a build and deploy process.
   - Visit the URL provided in your repository's GitHub Pages settings to play the game!

## Local Development

```bash
# Install dependencies
npm install

# Start local server
npm run dev
```
