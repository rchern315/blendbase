import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import supabase from './config/supabaseClient'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Pages
import Home from './pages/Home'
import Create from './pages/Create'
import Dashboard from './pages/Dashboard'
import Edit from './pages/Edit'  
import AuthPage from './pages/Auth'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Navbar session={session} onSignOut={handleSignOut} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route 
          path="/auth" 
          element={!session ? <AuthPage /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/create" 
          element={session ? <Create /> : <Navigate to="/auth" />} 
        />
        
        <Route 
          path="/dashboard" 
          element={session ? <Dashboard /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/edit/:id" 
          element={session ? <Edit /> : <Navigate to="/auth" />} 
        />
      
      </Routes>
      

      <Footer />
    </BrowserRouter>
  )
}

export default App