# ☁️ Cloud Portal App

## 📌 About the Project

**Cloud Portal App** is a full-stack, multi-cloud web application that allows users to:
- 🔐 Log in securely using **Firebase Authentication**
- 💬 Chat in real-time using **Firebase Realtime Database**
- 📁 Upload and view files via a **Google Cloud Storage Bucket**

This project demonstrates software as a service (SAAS) / **multi-cloud architecture** by integrating **Firebase** (for auth and chat) with **GCP** (for file storage), hosted seamlessly using **Render**. It was an **optional challenge to mix cloud vendors**, which I took up intentionally to explore cross-platform integrations.

---

## 🔗 View Project

🌐 **Live Link**: [Click here](https://cloudportal-q1ot.onrender.com)

---

## 🎥 View Video Demo

📽️ **Demo Video**: [Click here to watch how it works](https://drive.google.com/file/d/1URrx32JACQyLeyq9YkIsOtdQ-RgemPzM/view?usp=sharing)  


---

## 🔄 Workflow

### 1. **User Authentication**
- The app opens with a login/register screen.
- Handled by **Firebase Authentication** (Email/Password method)(with google sign-in support).

### 2. **Cloud Chat**
- After login, the user can choose **Cloud Chat**.
- Real-time chat with channel support.
- Powered by **Firebase Realtime Database**.

### 3. **Cloud Drive**
- Alternatively, the user can go to **Cloud Drive**.
- Files are uploaded via the frontend using `Multer` and stored in a **Google Cloud Storage bucket**.
- All uploaded files are listed and accessible from the UI.

### 4. **Hosting & Deployment**
- The complete backend and frontend are hosted on **Render Web Services**.

---

## 💡 Technologies Used

### 🧑‍💻 Frontend
- HTML5, CSS3
- JavaScript (Vanilla)

### 🔙 Backend
- Node.js with Express.js
- Multer for file upload handling

### ☁️ Cloud Services

| Cloud Provider | Service Used                | Purpose                            |
|----------------|-----------------------------|------------------------------------|
| Firebase        | Authentication              | Login/Register Users               |
| Firebase        | Realtime Database           | Chat messaging backend             |
| GCP             | Cloud Storage Bucket        | File upload & storage              |
| Render          | Web Hosting                 | Hosting the full application       |

## 🎯 Key Highlights

- ✅ **Software as a Service (SaaS)** model – browser-based, no installation
- ✅ **Multi-cloud architecture** using Firebase + GCP
- ✅ Secure **user authentication**
- ✅ Real-time chat experience
- ✅ Reliable cloud storage and file management
- ✅ Fully hosted and live with no local dependencies


