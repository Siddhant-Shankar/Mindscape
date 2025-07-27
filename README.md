# 🧠 MindScape

**MindScape** is a MERN-based mental health journal and mood tracker with integrated AI-powered sentiment analysis. It helps users reflect on their emotions and track mental health patterns over time.

## 🌟 Features

- 📝 Daily Journal entries
- 😊 Emoji-based Mood Tracker
- 📅 Mood Calendar Visualization
- 🤖 AI Sentiment Analysis on entries
- 🔐 Secure Login and Private Journals

## 🧰 Tech Stack

| Layer          | Tool                                         | Purpose                               |
| -------------- | -------------------------------------------- | ------------------------------------- |
| Frontend       | React, React Router                          | UI and navigation                     |
| Backend        | Express.js, Node.js                          | REST API and routing                  |
| Database       | MongoDB (via Mongoose)                       | Storing users, entries, mood logs     |
| Authentication | JWT + Bcrypt                                 | User login and registration           |
| AI Service     | Azure Text Analytics / HuggingFace           | Sentiment analysis of journal entries |
| Styling        | TailwindCSS or Styled Components             | Clean and responsive design           |
| Deployment     | Vercel (client) + Render (server) or Railway | Hosting                               |

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm / yarn
- MongoDB URI (local or Atlas)
- API key for sentiment analysis (optional)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/mindscape.git
cd mindscape
```
