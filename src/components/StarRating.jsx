import { useState, useEffect, useCallback } from 'react'
import supabase from '../config/supabaseClient'

function StarRating({ recipeId, currentUser }) {
  const [averageRating, setAverageRating] = useState(0)
  const [totalRatings, setTotalRatings] = useState(0)
  const [userRating, setUserRating] = useState(0)
  const [hover, setHover] = useState(0)

  const fetchRatings = useCallback(async () => {
    // Get all ratings for this recipe
    const { data } = await supabase
      .from('ratings')
      .select('rating')
      .eq('recipe_id', recipeId)

    if (data && data.length > 0) {
      const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length
      setAverageRating(avg.toFixed(1))
      setTotalRatings(data.length)
    } else {
      setAverageRating(0)
      setTotalRatings(0)
    }
  }, [recipeId])

  const fetchUserRating = useCallback(async () => {
    if (!currentUser) {
      setUserRating(0)
      return
    }

    // Check if user already rated
    const { data } = await supabase
      .from('ratings')
      .select('rating')
      .eq('recipe_id', recipeId)
      .eq('user_id', currentUser.id)
      .single()

    if (data) {
      setUserRating(data.rating)
    } else {
      setUserRating(0)
    }
  }, [recipeId, currentUser])

  useEffect(() => {
    fetchRatings()
    fetchUserRating()
  }, [fetchRatings, fetchUserRating])

  const handleRating = async (ratingValue) => {
    if (!currentUser) {
      alert('Please sign in to rate recipes')
      return
    }

    // Upsert rating (insert or update)
    const { error } = await supabase
      .from('ratings')
      .upsert({
        recipe_id: recipeId,
        user_id: currentUser.id,
        rating: ratingValue,
      })

    if (!error) {
      setUserRating(ratingValue)
      fetchRatings() // Refresh average
    } else {
      console.error('Rating error:', error)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 py-4 border-t border-b border-gray-200 my-6">
      {/* Stars */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-3xl cursor-pointer transition-transform hover:scale-110 select-none ${
              star <= (hover > 0 ? hover : userRating) ? 'text-primary' : 'text-gray-300'
            }`}
            onClick={() => handleRating(star)}
            onMouseEnter={() => currentUser && setHover(star)}
            onMouseLeave={() => setHover(0)}
            style={{ cursor: currentUser ? 'pointer' : 'default' }}
          >
            {star <= (hover > 0 ? hover : userRating) ? '★' : '☆'}
          </span>
        ))}
      </div>

      {/* Rating Info */}
      <div className="flex items-center gap-2 text-sm">
        {totalRatings > 0 ? (
          <>
            <span className="text-lg font-semibold text-gray-800">{averageRating}</span>
            <span className="text-gray-600">
              ({totalRatings} rating{totalRatings !== 1 ? 's' : ''})
            </span>
          </>
        ) : (
          <span className="text-gray-500 italic">No ratings yet</span>
        )}
      </div>

      {/* User Rating Status */}
      {userRating > 0 && (
        <small className="text-primary font-medium">You rated this {userRating} stars</small>
      )}
      
      {!currentUser && totalRatings === 0 && (
        <small className="text-gray-500">Sign in to be the first to rate!</small>
      )}
    </div>
  )
}

export default StarRating