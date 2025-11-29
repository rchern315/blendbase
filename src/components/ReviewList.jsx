import { useState, useEffect } from 'react'
import supabase from '../config/supabaseClient'

function ReviewsList({ recipeId, refreshTrigger }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [recipeId, refreshTrigger])

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('recipe_id', recipeId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Loading reviews...</div>
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No reviews yet. Be the first to review this recipe!</p>
      </div>
    )
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  return (
    <div>
      {/* Average Rating Summary */}
      <div className="mb-6 pb-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-3">
          <div className="text-4xl font-bold text-gray-800">{averageRating}</div>
          <div>
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-xl">
                  {star <= Math.round(averageRating) ? (
                    <span className="text-yellow-400">★</span>
                  ) : (
                    <span className="text-gray-300">★</span>
                  )}
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-600">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </div>
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold text-gray-800">{review.user_name || 'Anonymous'}</div>
                <div className="flex gap-1 my-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-base">
                      {star <= review.rating ? (
                        <span className="text-yellow-400">★</span>
                      ) : (
                        <span className="text-gray-300">★</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-500">{formatDate(review.created_at)}</div>
            </div>
            {review.review_text && (
              <p className="text-gray-700 leading-relaxed">{review.review_text}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReviewsList