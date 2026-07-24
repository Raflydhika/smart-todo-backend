# Smart To-Do List Backend

REST API backend untuk aplikasi Smart To-Do List.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication

## Installation

```bash
npm install
```

## Running Development

```bash
npm run dev
```

atau

```bash
npm start
```

## Database Migration

```bash
npm run migrate up
```

## Environment Variables

Salin `.env.example`

```bash
cp .env.example .env
```

Kemudian isi sesuai konfigurasi.

## API

Contoh endpoint

```
POST /login
POST /register

GET /task
POST /task
PUT /task/:id
DELETE /task/:id

PATCH /task/:id/complete

GET /task/history
```

## Machine Learning Integration

Backend akan memanggil Machine Learning API menggunakan endpoint:

```
POST /predict
```
