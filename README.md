<div align="center">

# Matty AI-Design Tool

**A powerful, browser-based graphic design platform built on the MERN stack. Create, edit, and collaborate on stunning visuals right from your browser.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/vanshsuri07/Matty-design-tool)
[![Stars](https://img.shields.io/github/stars/vanshsuri07/Matty-design-tool.svg)](https://github.com/vanshsuri07/Matty-design-tool/stargazers)
[![Forks](https://img.shields.io/github/forks/vanshsuri07/Matty-design-tool.svg)](https://github.com/vanshsuri07/Matty-design-tool/network/members)

</div>

Matty AI-Design Tool empowers users—from social media managers to professional designers—to create high-quality graphics with an intuitive drag-and-drop interface. Built with modern web technologies, it offers a seamless and responsive experience without the need for expensive desktop software.

**🚀 [Live Demo](https://matty-design-tool-brown.vercel.app/)**

---

## ✨ Features

- **🔐 Secure Authentication:** User registration and login with JWT-based sessions and protected routes.
- **🎨 Interactive Canvas Editor:**
  - Powered by **Fabric.js** for a smooth, real-time editing experience.
  - Add and manipulate text, shapes (rectangles, circles, triangles), and lines.
  - Upload and position your own images.
  - Dynamic properties panel for fine-grained control over colors, fonts, opacity, and dimensions.
- **🗂️ Dashboard & Design Management:**
  - Centralized dashboard to view all your creations.
  - Full CRUD functionality: Create, update, duplicate, and delete designs.
  - Auto-generated thumbnail previews for quick identification.
- ** LAYER MANAGEMENT:**
  - Intuitive layers panel to manage object stacking order (Bring Forward, Send Backward).
  - Toggle visibility and lock layers to prevent accidental edits.
- **💾 Persistence & Export:**
  - Designs are saved as JSON in MongoDB for easy retrieval and editing.
  - Export your final work as a high-quality **PNG** file.
- **📱 Fully Responsive UI:**
  - Built with **TailwindCSS** for a flawless experience on desktop, tablet, and mobile devices.

---

## 🛠️ Technology Stack

| Category       | Technology                                                           |
| -------------- | -------------------------------------------------------------------- |
| **Frontend**   | `React.js`, `React Router`, `Fabric.js`, `TailwindCSS`, `Axios`      |
| **Backend**    | `Node.js`, `Express.js`, `Mongoose`, `JSON Web Tokens (JWT)`, `CORS` |
| **Database**   | `MongoDB Atlas`                                                      |
| **Deployment** | `Vercel` (Frontend), `Render` (Backend)                              |

---

## 🏁 Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

- Node.js (v18.x or later)
- npm or yarn
- Git

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/vanshsuri07/Matty-design-tool.git](https://github.com/vanshsuri07/Matty-design-tool.git)
    cd Matty-design-tool
    ```

2.  **Setup Backend:**

    ```bash
    cd server
    npm install
    ```

    Create a `.env` file in the `server` directory and add your environment variables:

    ```env
    # /server/.env
    MONGODB_URI=<Your MongoDB Atlas URI>
    JWT_SECRET=<Your Super Secret JWT Key>
    PORT=5000
    ```

    Start the backend server:

    ```bash
    npm start
    ```

3.  **Setup Frontend:**

    ```bash
    cd ../client
    npm install
    npm install fabric # Ensure fabric.js is installed
    ```

    Create a `.env` file in the `client` directory to specify the backend API URL:

    ```env
    # /client/.env
    REACT_APP_API_URL=http://localhost:5000/api
    ```

    _Note: In `src/services/api.js`, make sure you use this environment variable instead of a hardcoded URL._

    ```javascript
    // src/services/api.js
    const API_URL =
      process.env.REACT_APP_API_URL || "http://localhost:5000/api";
    ```

    Start the frontend application:

    ```bash
    npm start
    ```

4.  **Open your browser** and navigate to `http://localhost:3000`.

---

## 🕹️ Usage

1.  **Register** a new account or **Login** with existing credentials.
2.  From the **Dashboard**, you can view your existing designs or start a new one.
3.  Click **"Create New Design"** to open the canvas editor.
4.  Use the **left toolbar** to add elements like text, shapes, and images.
5.  Select an element on the canvas to open the **right properties panel** for customization.
6.  Click **"Save"** to store your progress in the database.
7.  Click **"Export"** to download your creation as a PNG file.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please follow these steps:

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

Please make sure to update tests as appropriate.

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

<div align="center">
  <p>Made with ❤️ by the Matty Dev Team</p>
</div>
