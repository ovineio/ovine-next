{
  "private": true,
  "author":"{{{ author }}}",
  "scripts": {
    "dev": "ovine dev",
    "build": "ovine build",
    "postinstall": "ovine setup",
    "setup": "ovine setup",
    "start": "npm run dev"
  },
  "dependencies": {
    "ovine": "{{{ version }}}"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^4.1.2"
  }
}
