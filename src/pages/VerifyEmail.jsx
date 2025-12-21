import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')
  const { resendVerificationEmail } = useAuth()
  const [resending, setResending] = useState(false)
  const [resendMessage, setResendMessage] = useState(null)

  const handleResend = async () => {
    if (!email) {
      setResendMessage({ type: 'error', text: 'Email address not found' })
      return
    }

    setResending(true)
    setResendMessage(null)

    const result = await resendVerificationEmail(email)

    if (result.success) {
      setResendMessage({ 
        type: 'success', 
        text: 'Verification email sent! Please check your inbox.' 
      })
    } else {
      setResendMessage({ 
        type: 'error', 
        text: result.error || 'Failed to resend email. Please try again.' 
      })
    }

    setResending(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-4">
        <div className="bg-white p-8 rounded-xl shadow-md">
          {/* Icon */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">📧</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h1>
            <p className="text-gray-600">
              We've sent a verification link to
            </p>
            {email && (
              <p className="font-semibold text-gray-900 mt-1">
                {email}
              </p>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              Click the link in the email to verify your account and start creating delicious smoothie recipes!
            </p>
          </div>

          {/* Resend Message */}
          {resendMessage && (
            <div className={`border rounded-lg p-4 mb-6 ${
              resendMessage.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <p className="text-sm">{resendMessage.text}</p>
            </div>
          )}

          {/* Resend Section */}
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              Didn't receive the email?
            </p>
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-primary hover:underline text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? 'Sending...' : 'Resend verification email'}
            </button>
          </div>

          {/* Back to Login */}
          <div className="text-center mt-6">
            <Link 
              to="/auth" 
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to sign in
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Check your spam folder if you don't see the email in your inbox.
          </p>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail