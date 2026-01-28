# BlendBase 🥤

A modern smoothie recipe platform where users can discover, create, and share delicious smoothie recipes. Built with React and Supabase for a seamless, real-time experience.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://blendbase.vercel.app)
[![React](https://img.shields.io/badge/React-18+-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5+-purple)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green)](https://supabase.com)

## ✨ Features

- 🔐 **Secure Authentication** - Email/password and Google OAuth sign-in with email verification
- 📝 **Recipe Management** - Create, edit, and delete your own smoothie recipes
- 🔍 **Search & Filter** - Find recipes by ingredients, categories, or nutritional content
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- 🎨 **Rich Recipe Details** - Ingredients, instructions, nutrition facts, and images
- 👤 **User Dashboard** - Manage your personal recipe collection
- 🔒 **Protected Routes** - Secure pages requiring authentication
- ⚡ **Real-time Updates** - Instant synchronization powered by Supabase

## 🚀 Live Demo

Check out the live application: **[blendbase.vercel.app](https://blendbase.vercel.app)**

## 🛠 Tech Stack

### Frontend

- **React 18+** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Context API** - Global state management

### Backend

- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication & authorization
  - Row Level Security (RLS)
  - Real-time subscriptions
  - File storage

### Deployment

- **Vercel** - Frontend hosting
- **Supabase Cloud** - Managed backend

## 📦 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git
- A Supabase account (free tier available)

## 🏃 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/rchern315/blendbase.git
cd blendbase
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory (see `.env.example` for template):

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note:** See `SETUP.md` for detailed configuration instructions.

### 4. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app!

## 📁 Project Structure

```
blendbase/
├── src/
│   ├── components/      # Reusable React components
│   ├── contexts/        # React Context providers
│   ├── pages/           # Page components
│   ├── config/          # Configuration files
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/              # Static assets
├── .env.example         # Environment variables template
└── README.md            # You are here
```

## 🎯 Key Features Explained

### Authentication Flow

- User signs up with email/password or Google
- Email verification required for new accounts
- Secure JWT-based session management
- Protected routes redirect to login if not authenticated

### Recipe Management

- Create recipes with ingredients, instructions, and nutrition info
- Upload recipe images
- Edit and delete your own recipes
- Browse public recipes from other users

### Search & Discovery

- Real-time search as you type
- Filter by category (Breakfast, Protein, Green, Fruit, Dessert)
- Filter by calorie range
- Filter by difficulty level

## 🚀 Deployment

This app is deployed on Vercel with automatic deployments from the main branch.

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rchern315/blendbase)

See `SETUP.md` for detailed deployment instructions.

## 📜 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Issues

Found a bug? Please open an issue with:

- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**rchern315**

- GitHub: [@rchern315](https://github.com/rchern315)
- Website: [blendbase.vercel.app](https://blendbase.vercel.app)

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI library
- [Supabase](https://supabase.com) - Backend platform
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vercel](https://vercel.com) - Deployment platform

---

**Made with ❤️ and fresh ingredients**

_Happy Blending!_ 🥤
