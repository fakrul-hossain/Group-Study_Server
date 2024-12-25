# Study Sphere: Frontend Repository

## Purpose
This repository contains the frontend code for the **Study Sphere** web application, a platform enabling collaborative group study, assignment creation, submission, and grading.

---

## Key Features
- **Responsive Design**: Fully responsive layout for mobile, tablet, and desktop.
- **User Authentication**: Email/password authentication with validation, as well as Google/GitHub login options.
- **Dynamic Content**: Pages that adapt based on the user’s role and actions (e.g., students and graders).
- **Dark/Light Mode**: Theme toggling for better accessibility.
- **Interactive Forms**: Error messages, success notifications, and validation for all input fields.

---

## Environment Variables
To run this project, you will need the following environment variables:

```
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_AUTH_DOMAIN=your_auth_domain
REACT_APP_PROJECT_ID=your_project_id
REACT_APP_STORAGE_BUCKET=your_storage_bucket
REACT_APP_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_APP_ID=your_app_id
REACT_APP_BACKEND_URL=your_backend_server_url
``` 

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/study-sphere-frontend.git
   ```

2. Navigate to the project directory:
   ```bash
   cd study-sphere-frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm start
   ```

5. Build for production:
   ```bash
   npm run build
   ```

---

## Pages and Routes

### Public Routes
- **Home Page**: Includes banner, features, and FAQ sections.
- **Assignments Page**: Displays a list of assignments with filters.
- **Authentication Pages**: Login and Register forms with validation and error handling.

### Private Routes (Protected)
- **Create Assignments**: Form to create new assignments.
- **Pending Assignments**: Lists all pending assignments for grading.
- **My Attempted Assignments**: Displays user-specific submitted assignments.
- **Assignment Details**: Detailed view of an assignment with submission and grading functionality.

---

## Technologies Used
- **React.js**: Frontend library for building user interfaces.
- **React Router**: Routing library for managing navigation.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **DaisyUI**: Component library for faster UI development.
- **Firebase**: Authentication and hosting.
- **Axios**: HTTP client for API requests.

---

## Deployment
The client-side application is deployed on **Netlify/Surge/Firebase Hosting**. Ensure that the environment variables are correctly configured in the deployment settings.

---

## Contribution
If you wish to contribute to this project:

1. Fork the repository.
2. Create a new feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Your commit message"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

---

## License
This project is licensed under the MIT License.
"# b10a11-server-side-fakrul-hossain" 
