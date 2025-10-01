# Matty AI-Design Tool

Matty AI-Design Tool is a browser-based graphic design platform built on the MERN stack. It empowers users—from beginners to professionals—to create, edit, and export high-quality graphics through an intuitive interface, without the need for expensive desktop software.

## Features

- **Secure Authentication**  
  – User registration and login with JWT-based sessions  
  – Protected routes for dashboard and editor  

- **Dashboard & Design Management**  
  – Create, view, update, duplicate, and delete design projects  
  – Thumbnail previews and metadata display  
  – Responsive grid layout for any screen size  

- **Interactive Canvas Editor**  
  – Real-time Fabric.js canvas for adding text, shapes, and images  
  – Toolbar for element creation and properties panel for customization  
  – Layering controls, color pickers, font selection, opacity adjustment  

- **Export & Persistence**  
  – Client-side export to high-quality PNG  
  – Designs saved as JSON in MongoDB Atlas for seamless reload  
  – Auto-generated thumbnails for fast previews  

- **Responsive UI**  
  – TailwindCSS utility-first styling  
  – Mobile, tablet, and desktop compatibility  

## Technology Stack

- **Frontend:** React.js, React Router, TailwindCSS, Fabric.js, Axios  
- **Backend:** Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), CORS  
- **Database:** MongoDB Atlas  
- **Deployment:** Vercel (frontend), Render/Railway (backend)  

## Installation

1. Clone the repository  
   ```bash
   git clone https://github.com/vanshsuri07/Matty-design-tool.git
   ```

2. Install backend dependencies  
   ```bash
   cd matty-design-tool/server
   npm install
   ```

3. Configure environment variables in `.env`  
   ```
   MONGODB_URI=<Your MongoDB Atlas URI>
   JWT_SECRET=<Your JWT Secret>
   ```

4. Start backend server  
   ```bash
   npm start
   ```

5. Install frontend dependencies  
   ```bash
   cd ../client
   npm install
   npm install fabric
   ```

6. Configure API URL in `src/services/api.js`  
   ```javascript
   const API_URL = 'http://localhost:5000/api';
   ```

7. Start frontend application  
   ```bash
   npm start
   ```

8. Open your browser at `http://localhost:3000`

## Usage

1. **Register** a new account or **login** with existing credentials.  
2. Access the **Dashboard** to view and manage designs.  
3. Click **Create New Design** to open the **Canvas Editor**.  
4. Use the **toolbar** to add text, rectangles, and circles.  
5. Customize properties in the **Properties Panel**.  
6. Click **Save** to store your design.  
7. Click **Export** to download your design as a PNG file.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository  
2. Create a new branch (`git checkout -b feature-name`)  
3. Make your changes and commit (`git commit -m 'Add new feature'`)  
4. Push to your branch (`git push origin feature-name`)  
5. Open a pull request describing your changes  

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
