# Vibe: Frontend Client (Demo)

> **Note:** This repository is a lightweight frontend client built specifically to demonstrate the capabilities of the
> Vibe ecosystem. For the full system architecture, backend optimizations, and performance metrics, please visit
> our [Vibe Organization README](https://github.com/Vibe-Shared-real-time-experiences).*

Welcome to the Vibe Frontend. This application serves as the user interface to showcase the real-time messaging,
cursor-based pagination, and rich-media upload features powered by the high-performance Vibe Backend.

## Demo Features

* **Real-time Messaging:** Instantly send and receive messages using HTTP POST for fast writes and WebSocket (STOMP) for
  real-time event listening.
* **Infinite Scrolling:** Smoothly navigate through chat history utilizing the backend's Cursor-based Pagination
* **Rich-Media Attachments:** Upload images and files seamlessly with direct MinIO integration.

## Tech Stack

* **Framework:** React.js
* **Real-time Client:** `@stomp/stompjs` & `sockjs-client`
* **HTTP Client:** `axios`
* **Styling:** TailwindCSS
* **State Management:** Redux

## Getting Started

Follow these steps to run the demo client locally.

### Prerequisites

* **Node.js** (v18+) and **npm** (or yarn/pnpm) installed.
* The **Vibe Backend** and its infrastructure (PostgreSQL, Redis, MinIO) must be up and running.

### 1. Installation

Clone the repository and install the dependencies:

```bash
cd vibe-frontend
npm install
```

### 2. Environment Setup

Create a `.env` file in the project root from the provided `example.env`

```bash
cp example.env .env
```

Edit `.env` with your configuration

### 3. Run the Development Server

```bash
npm run dev
```

This will start the frontend on `http://localhost:3000`. You can log in with the credentials of a user created in the
backend and start testing the real-time chat features.