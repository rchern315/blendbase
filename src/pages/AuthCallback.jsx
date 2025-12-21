import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../config/supabaseClient'

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase automatically handles the email verification token
    // Just check if we have a session and redirect
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        // Email verified successfully!
        navigate('/')
      } else {
        // Something went wrong
        navigate('/auth')
      }
    }

    checkSession()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Verifying your email...</p>
      </div>
    </div>
  )
}

export default AuthCallback