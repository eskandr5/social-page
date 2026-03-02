# 📱 SocialSite - Responsive Front-End Social Media UI

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)

**SocialSite** is a modern Social Media Front-End application. This project focuses on creating a high-performance, responsive user interface and seamless API integration to provide a real-world social networking experience.

## 🚀 Live Demo
[View Application Live](https://eskandr5.github.io/social-page/)

---

## ✨ Core Front-End Features

### 🔐 Authentication & Security Logic
- **JWT Integration:** Managed secure user sessions by handling JSON Web Tokens in local storage.
- **Dynamic Onboarding:** Built a complete flow for **Sign-Up** and **Login** with real-time validation.
- **Auto-Login:** Implemented logic to check existing tokens and redirect users automatically.

### 📝 Media & Content Handling
- **Asynchronous Uploads:** Handled complex `FormData` for image uploading and linking them to posts.
- **Instant Preview:** Used `URL.createObjectURL` to provide zero-latency image previews for a better UX.
- **Ref-Based Controls:** Leveraged `useRef` to create custom-styled file triggers, avoiding default browser inputs.

### 🤝 Social Graph & Interaction
- **Reusable Components:** Created a versatile **Follow/Unfollow** button with multiple UI variants.
- **State-Driven Engagement:** Managed Likes and Comments using React state to ensure UI updates without page reloads.
- **Suggestion Logic:** Filtered and displayed "Who to follow" lists based on API data.

### 📱 Responsive Architecture
- **Glassmorphism UI:** Implemented a modern navbar with `backdrop-blur` for a premium look.
- **Mobile Navigation:** Designed a sliding drawer for mobile-first accessibility.
- **Active Routing:** Used `useLocation` to provide visual feedback for the current navigation state.

---

## 📸 User Interface Gallery

### 🖼️ Authentication Flow
| Sign Up | Login Page |
|:---:|:---:|
| <img src="./screenshots/sign-up.png" width="380" /> | <img src="./screenshots/login.png" width="380" /> |

### 🌐 Main Experience
| Main Feed | Mobile View |
|:---:|:---:|
| <img src="./screenshots/feed.png" width="450" /> | <img src="./screenshots/mobile.png" width="180" /> |

### 🛠️ Advanced UI Logic
| Followers List | Delete Confirmation |
|:---:|:---:|
| <img src="./screenshots/followers-list.png" width="380" /> | <img src="./screenshots/delete-modal.png" width="380" /> |

---

## 🛠️ Tech Stack (Front-End)

* **Library:** React 19 (Hooks, Refs, Callbacks).
* **Styling:** Tailwind CSS v4 (Modern Utility-first CSS).
* **Routing:** React Router v7.
* **Icons:** React Icons.
* **API Communication:** Fetch API / REST Integration.

---

## ⚙️ How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/eskandr5/social-page.git](https://github.com/eskandr5/social-page.git)
   cd social-page