import { useState, useEffect } from 'react'
import supabase from '../config/supabaseClient'
import ShareButtons from './ShareButtons'
import ReviewForm from './ReviewForm'
import ReviewsList from './ReviewList'

function RecipeCard({ recipe }) {
  const [showModal, setShowModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [avgRating, setAvgRating] = useState(0)  
  const [ratingCount, setRatingCount] = useState(0)
  const [reviewsRefresh, setReviewsRefresh] = useState(0)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user)
    })
    fetchRating()
  }, [reviewsRefresh])
  
  const fetchRating = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('recipe_id', recipe.id)

      if (error) throw error

      if (data && data.length > 0) {
        const sum = data.reduce((acc, r) => acc + r.rating, 0)
        const avg = (sum / data.length).toFixed(1)
        setAvgRating(avg)
        setRatingCount(data.length)
      } else {
        setAvgRating(0)
        setRatingCount(0)
      }
    } catch (error) {
      console.error('Error fetching rating:', error)
    }
  }

  const handleReviewSubmitted = () => {
    setReviewsRefresh(prev => prev + 1)
  }

  // get ingredients array
  const getIngredientsArray = (ingredients) => {
    if (!ingredients) return []
    if (Array.isArray(ingredients)) return ingredients
    if (typeof ingredients === 'string') {
      try {
        const parsed = JSON.parse(ingredients)
        return Array.isArray(parsed) ? parsed : []
      } catch (e) {
        return []
      }
    }
    return []
  }

  const ingredientsArray = getIngredientsArray(recipe.ingredients)

  return (
    <>
      {/* Recipe Card */}
      <div className="bg-white rounded-lg shadow-card hover:shadow-card-hover hover:-translate-y-[5px] transition-all duration-[250ms] ease-out overflow-hidden flex flex-col w-full max-w-[460px] mx-auto">
        
        {/* Image Thumb */}
        <div className="relative h-[281px] shadow-thumb">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-transparent z-10"></div>
          
          <img
            src={recipe.image || 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800'}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          
          {/* Star Rating in Top Right Corner */}
          {avgRating > 0 ? (
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg z-20">
              <div className="flex items-center gap-1.5">
                <span className="text-yellow-400 text-xl">★</span>
                <div>
                  <div className="text-sm font-bold text-gray-800 leading-none">{avgRating}</div>
                  <div className="text-xs text-gray-500">({ratingCount})</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-500 px-3 py-2 rounded-lg text-xs font-bold shadow-lg z-20">
              No ratings
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 px-8 pb-4">
          {/* Header with Title */}
          <div className="flex py-[0.55em] border-b border-[#d8d8d8]">
            <h3 className="font-heading font-semibold text-[24px] text-gray-800 m-0">
              {recipe.title}
            </h3>
          </div>

          {/* Recipe Details */}
          <div className="flex justify-between py-[1.4em] px-0 m-0 list-none">
            <div className="flex-1 text-center">
              <div className="text-[30px] text-pink mb-1">⏱️</div>
              <span className="text-pink font-semibold text-[24px]">{recipe.prep_time || 5}</span>
              <span className="block mt-[-4px] font-heading text-[21px] font-light text-gray-600">Minutes</span>
            </div>
            <div className="flex-1 text-center">
              <div className="text-[30px] text-pink mb-1">📖</div>
              <span className="text-pink font-semibold text-[24px]">{ingredientsArray.length}</span>
              <span className="block mt-[-4px] font-heading text-[21px] font-light text-gray-600">Ingredients</span>
            </div>
            <div className="flex-1 text-center">
              <div className="text-[30px] text-pink mb-1">👤</div>
              <span className="text-pink font-semibold text-[24px]">{recipe.servings || 2}</span>
              <span className="block mt-[-4px] font-heading text-[21px] font-light text-gray-600">Servings</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-[#666] leading-[1.6] my-[0.3em] mb-[1.8em] line-clamp-2">
            {recipe.description}
          </p>

          {/* Button */}
          <div className="text-center mx-12 mb-6">
          <button
  onClick={() => setShowModal(true)}
  className="font-heading inline-block bg-pink-800 hover:bg-pink-900 py-[0.65em] px-4 w-full text-center rounded-[5px] text-white font-medium tracking-[0.2px] text-[17px] border-none cursor-pointer transition-all duration-[250ms] ease-out hover:-translate-y-[3px] hover:shadow-button-hover"
>
  View Recipe
</button>

          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] p-5 animate-fadeIn overflow-y-auto"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl max-w-[700px] w-full max-h-[90vh] overflow-y-auto relative p-10 shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-slideIn my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-[15px] right-5 text-[32px] cursor-pointer text-gray-500 hover:text-pink transition-colors leading-none"
            >
              ×
            </button>

            {/* Image */}
            <img
              src={recipe.image || 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800'}
              alt={recipe.title}
              className="w-full h-[300px] object-cover rounded-lg mb-5"
            />

            {/* Title with Rating */}
            <div className="mb-5">
              <h2 className="font-heading text-gray-800 text-2xl mb-2">
                {recipe.title}
              </h2>
              {avgRating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-lg">
                        {star <= Math.round(avgRating) ? (
                          <span className="text-yellow-400">★</span>
                        ) : (
                          <span className="text-gray-300">★</span>
                        )}
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">
                    {avgRating} ({ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'})
                  </span>
                </div>
              )}
            </div>

            {/* Recipe Info Stats */}
            <div className="flex justify-around mb-6 pb-4 border-b border-gray-200">
              <div className="text-center">
                <div className="text-2xl mb-1">⏱️</div>
                <div className="text-pink font-semibold text-xl">{recipe.prep_time || 5}</div>
                <div className="text-gray-500 text-sm">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">📖</div>
                <div className="text-pink font-semibold text-xl">{ingredientsArray.length}</div>
                <div className="text-gray-500 text-sm">Ingredients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">👤</div>
                <div className="text-pink font-semibold text-xl">{recipe.servings || 2}</div>
                <div className="text-gray-500 text-sm">Servings</div>
              </div>
            </div>

            {/* Full Recipe Content */}
            <div className="my-[30px]">
              {/* Description */}
              {recipe.description && (
                <div className="mb-5">
                  <h3 className="font-heading text-pink mb-2.5 mt-5 text-lg font-semibold">Description</h3>
                  <p className="leading-[1.8] text-[#555]">{recipe.description}</p>
                </div>
              )}

              {/* Ingredients */}
              {ingredientsArray.length > 0 && (
                <div className="mb-5">
                  <h3 className="font-heading text-pink mb-2.5 mt-5 text-lg font-semibold">Ingredients</h3>
                  <ul className="list-none p-0 my-[15px]">
                    {ingredientsArray.map((ing, index) => (
                      <li key={index} className="py-2 border-b border-gray-100 last:border-b-0">
                        <strong className="text-pink mr-2">{ing.amount}</strong>
                        <span className="text-[#555]">{ing.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Directions */}
              {recipe.directions && (
                <div className="mb-5">
                  <h3 className="font-heading text-pink mb-2.5 mt-5 text-lg font-semibold">Directions</h3>
                  <p className="leading-[1.8] text-[#555] whitespace-pre-line">{recipe.directions}</p>
                </div>
              )}

              {/* Created By */}
              {recipe.created_by && (
                <div className="text-sm text-gray-500 mt-5 pt-5 border-t border-gray-200">
                  Created by {recipe.created_by}
                </div>
              )}
            </div>

            {/* Share Buttons */}
            <ShareButtons recipe={recipe} />

            {/* Reviews Section */}
            <div className="mt-8 pt-8 border-t-2 border-gray-200">
              <h3 className="font-heading text-2xl font-semibold mb-6">Reviews</h3>
              
              {/* Review Form */}
              <div className="mb-8">
                <ReviewForm 
                  recipeId={recipe.id} 
                  currentUser={currentUser}
                  onReviewSubmitted={handleReviewSubmitted}
                />
              </div>

              {/* Reviews List */}
              <ReviewsList 
                recipeId={recipe.id}
                refreshTrigger={reviewsRefresh}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RecipeCard