import { useState } from 'react'
import { FaFacebook, FaTwitter, FaPinterest, FaEnvelope, FaLink } from 'react-icons/fa'

function ShareButtons({ recipe }) {
  const [copied, setCopied] = useState(false)

  const shareUrl = window.location.href
  const title = recipe.title || 'Check out this smoothie recipe!'
  const description = recipe.description || 'Delicious smoothie recipe from BlendBase'

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(title)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + '\n\n' + shareUrl)}`
  }

  const handleShare = (platform) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400')
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-8 pt-6 border-t-2 border-gray-100">
      <h4 className="font-heading text-gray-800 font-semibold text-lg mb-4">Share this recipe:</h4>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleShare('pinterest')}
          className="bg-pink hover:bg-pink-600 text-white border-none py-2.5 px-5 rounded-md cursor-pointer text-sm font-medium transition-all duration-200 flex items-center gap-2"
        >
          <FaPinterest className="text-lg" />
          Pinterest
        </button>
        <button
          onClick={() => handleShare('facebook')}
          className="bg-pink hover:bg-pink-600 text-white border-none py-2.5 px-5 rounded-md cursor-pointer text-sm font-medium transition-all duration-200 flex items-center gap-2"
        >
          <FaFacebook className="text-lg" />
          Facebook
        </button>
        <button
          onClick={() => handleShare('twitter')}
          className="bg-pink hover:bg-pink-600 text-white border-none py-2.5 px-5 rounded-md cursor-pointer text-sm font-medium transition-all duration-200 flex items-center gap-2"
        >
          <FaTwitter className="text-lg" />
          Twitter
        </button>
        <button
          onClick={handleCopyLink}
          className="bg-secondary hover:bg-secondary-600 text-white border-none py-2.5 px-5 rounded-md cursor-pointer text-sm font-medium transition-all duration-200 flex items-center gap-2"
        >
          <FaLink className="text-base" />
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  )
}

export default ShareButtons