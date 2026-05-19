# Teste Recipe

A personal recipe curation and management website for storing, organizing, searching, rating, and revisiting favorite recipes.

## Live Site

GitHub Pages deployment:

https://davidateek.github.io/teste-recipe/

## What the Application Does

Teste Recipe is a browser-based recipe vault. It lets you:

- Create, view, edit, and delete recipes
- Store ingredients, instructions, prep time, cook time, servings, and personal notes
- Organize recipes by category and tags
- Search recipes by title, description, ingredients, or instructions
- Filter by category, tag, and minimum star rating
- Upload recipe images from your device
- Rate recipes from 1 to 5 stars
- Start with 20 imported Italian recipes

Because this version is deployed to GitHub Pages, data is saved in the browser with `localStorage`. Recipes stay available on the same device/browser, but they are not synced across devices.

## Recipe Data Attribution

The starter Italian recipe collection is imported from [TheMealDB](https://www.themealdb.com/api.php). Imported recipes include source links in the recipe detail view when available.

## Technology Stack

- React
- Vite
- CSS
- Browser `localStorage`
- GitHub Pages

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

```bash
npm run deploy
```

## Project Status

The first deployable MVP is implemented as a static React application. Future iterations can add the originally planned Node.js/Express API, PostgreSQL database, authentication, and cloud image storage.
