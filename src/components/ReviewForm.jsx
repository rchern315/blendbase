import { useState, useEffect } from 'react'
import supabase from '../config/supabaseClient'

function ReviewForm({ recipeId, currentUser, onReviewSubmitted }) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [existingReview, setExistingReview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (currentUser) {
      fetchExistingReview()
    }
  }, [currentUser, recipeId])

  const fetchExistingReview = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('recipe_id', recipeId)
        .eq('user_id', currentUser.id)
        .single()

      if (data) {
        setExistingReview(data)
        setRating(data.rating)
        setReviewText(data.review_text || '')
      }
    } catch (error) {
      // No existing review is fine
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!currentUser) {
      setMessage('Please sign in to leave a review')
      return
    }

    if (rating === 0) {
      setMessage('Please select a rating')
      return
    }

    setSubmitting(true)
    setMessage('')

    try {
      const reviewData = {
        recipe_id: recipeId,
        user_id: currentUser.id,
        rating: rating,
        review_text: reviewText.trim() || null,
        user_name: currentUser.email.split('@')[0]
      }

      if (existingReview) {
        // Update existing review
        const { error } = await supabase
          .from('reviews')
          .update(reviewData)
          .eq('id', existingReview.id)

        if (error) throw error
        setMessage('Review updated successfully!')
      } else {
        // Insert new review
        const { error } = await supabase
          .from('reviews')
          .insert([reviewData])

        if (error) throw error
        setMessage('Review submitted successfully!')
      }

      if (onReviewSubmitted) {
        onReviewSubmitted()
      }

      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error submitting review:', error)
      setMessage('Error submitting review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (existingReview) {
      setRating(existingReview.rating)
      setReviewText(existingReview.review_text || '')
    } else {
      setRating(0)
      setReviewText('')
    }
    setMessage('')
  }

  if (!currentUser) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-600">Please sign in to leave a review</p>
      </div>
    )
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
      <h3 className="font-heading text-xl font-semibold mb-4">
        {existingReview ? 'Update Your Review' : 'Leave a Review'}
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">My Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-4xl transition-all focus:outline-none"
              >
                {star <= (hoverRating || rating) ? (
                  <span className="text-yellow-400">★</span>
                ) : (
                  <span className="text-gray-300">☆</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Review Text */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">My Review</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="What did you think about this recipe? Did you make any changes or notes?"
            className="w-full border-2 border-gray-300 rounded-lg p-3 min-h-[120px] focus:border-primary focus:outline-none resize-none"
          />
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            CANCEL
          </button>
          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="px-6 py-2 bg-pink hover:bg-pink-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'SUBMITTING...' : 'SUBMIT'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReviewForm