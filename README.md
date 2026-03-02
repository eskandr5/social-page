# 📱 SocialSite — Production-Grade Responsive Social Media UI

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)

**SocialSite** is a modern, API-driven social media front-end built with a production-oriented mindset. The focus of this project is on **Architecture, State Management, and Real-world Interaction handling.** It simulates a complete social networking flow—including authentication, content creation, and complex social interactions—all optimized for performance and responsiveness.

## 🚀 Live Demo
[Explore SocialSite Live](https://eskandr5.github.io/social-page/)

---

## 🧠 Architecture & Logic

This application is built with a clear separation of concerns to ensure scalability:
- **API Layer:** Centralized endpoint handling and request abstraction via `src/api.js`.
- **Auth Logic:** JWT-based session persistence and guarded routing.
- **State-Driven UI:** Local state synchronization for instant feedback without page reloads.
- **Reusable Components:** Scalable UI patterns (Follow buttons, Post cards, Modals).

---

## ✨ Key Front-End Features

### 🔐 Authentication & Session Flow
- **JWT Persistence:** Managed secure sessions using Local Storage.
- **Session Restoration:** Automatic user recognition on page reload.
- **Guarded UI:** Conditional rendering for protected features and login/sign-up flows.

### 📝 Content & Media Pipeline
- **Asynchronous Creation:** Handled complex `FormData` for post creation and media linking.
- **Instant Media Preview:** Implemented `URL.createObjectURL` for zero-latency image previews.
- **Custom UI Triggers:** Leveraged `useRef` to build a clean, custom-styled file upload system, bypassing native browser limitations.

### 🤝 Social Interaction Graph
- **Optimistic State Updates:** Immediate UI feedback for Likes and Follows before the server responds.
- **Relational Filtering:** "Who to Follow" suggestions dynamically filtered from API data.
- **Event Management:** Strategic use of `e.stopPropagation()` to handle nested clickable elements safely.

### 📱 Responsive Engineering
- **Mobile-First Layout:** Engineered using Tailwind CSS utility architecture.
- **Sliding Drawer:** Accessible mobile navigation drawer with backdrop-blur effects.
- **Contextual Routing:** Active route detection using `useLocation` for enhanced navigation clarity.

---

## 📸 User Interface Gallery

### 🖼️ Authentication & Onboarding
| Sign Up | Login Page |
|:---:|:---:|
| <img src="./screenshots/sign-up.png" width="380" /> | <img src="./screenshots/login.png" width="380" /> |

### 🌐 Social Experience
| Main Feed | Mobile Navigation |
|:---:|:---:|
| <img src="./screenshots/feed.png" width="450" /> | <img src="./screenshots/mobile.png" width="180" /> |

### 🛠️ Advanced Interactions
| Followers Management | Delete Confirmation |
|:---:|:---:|
| <img src="./screenshots/followers-list.png" width="380" /> | <img src="./screenshots/delete-modal.png" width="380" /> |

---

## 🛠️ Tech Stack

* **Framework:** React 19 (Hooks, Refs, Controlled Components).
* **Styling:** Tailwind CSS v4 (Glassmorphism & Utility-first).
* **Routing:** React Router v7.
* **API Communication:** Fetch API (REST-based).
* **Development:** Vite.

---

## ⚙️ Local Development

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/eskandr5/social-page.git](https://github.com/eskandr5/social-page.git)
   cd social-page

Install dependencies:
npm install

Configure API:
Update src/api.js with your endpoint:
export const API_URL = "https://my-social-api-ytg6.onrender.com";

Run Server:
npm run dev

🛡️ Technical Challenges Addressed
State Synchronization: Managing complex interaction updates across nested components (Posts -> Comments -> Likes).

Propagation Control: Handling nested clickable UI patterns to ensure a clean event flow using e.stopPropagation().

Responsive Systematization: Building a layout that adapts intelligently without breaking during dynamic content loading.

Built by Mohammad Eskandr 🚀