import { useEffect, useState } from 'react'
import supabase from '../config/supabaseClient'
import RecipeCard from '../components/RecipeCard'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'

function Home() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [prepTimeFilter, setPrepTimeFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('0')

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    setLoading(true)
    try {
      // Fetch recipes
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false })

      if (recipesError) throw recipesError

      // Fetch ratings for all recipes
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('reviews')
        .select('recipe_id, rating')

      if (ratingsError) throw ratingsError

      // Calculate average ratings and review counts
      const recipesWithRatings = recipesData.map(recipe => {
        const recipeReviews = ratingsData.filter(r => r.recipe_id === recipe.id)
        const avgRating = recipeReviews.length > 0
          ? recipeReviews.reduce((sum, r) => sum + r.rating, 0) / recipeReviews.length
          : 0
        
        return {
          ...recipe,
          avgRating: parseFloat(avgRating.toFixed(1)),
          reviewCount: recipeReviews.length
        }
      })

      setRecipes(recipesWithRatings)
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort logic
  const getFilteredAndSortedRecipes = () => {
    let filtered = [...recipes]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Prep time filter
    if (prepTimeFilter !== 'all') {
      filtered = filtered.filter(recipe => 
        (recipe.prep_time || 0) <= parseInt(prepTimeFilter)
      )
    }

    // Rating filter
    if (ratingFilter !== '0') {
      filtered = filtered.filter(recipe => 
        recipe.avgRating >= parseFloat(ratingFilter)
      )
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        break
      case 'highest-rated':
        filtered.sort((a, b) => b.avgRating - a.avgRating)
        break
      case 'most-reviewed':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case 'quickest':
        filtered.sort((a, b) => (a.prep_time || 0) - (b.prep_time || 0))
        break
      default:
        break
    }

    return filtered
  }

  const filteredRecipes = getFilteredAndSortedRecipes()

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('')
    setSortBy('newest')
    setPrepTimeFilter('all')
    setRatingFilter('0')
  }

  // Check if any filters are active
  const hasActiveFilters = searchTerm || sortBy !== 'newest' || prepTimeFilter !== 'all' || ratingFilter !== '0'

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="text-center mb-12 pt-8">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-800 mb-4 font-heading">
              🥤 BlendBase
            </h1>
            <p className="text-gray-600 text-xl mb-3 font-heading">
              Discover, create, and share amazing smoothie recipes
            </p>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Join our community of smoothie lovers! Browse recipes, rate your favorites, 
              and share your own unique blends with the world.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6 max-w-2xl mx-auto">
            <SearchBar 
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by name or description..."
            />
          </div>

          {/* Filter Bar */}
          <div className="mb-6">
            <FilterBar
              sortBy={sortBy}
              onSortChange={setSortBy}
              prepTimeFilter={prepTimeFilter}
              onPrepTimeChange={setPrepTimeFilter}
              ratingFilter={ratingFilter}
              onRatingChange={setRatingFilter}
            />
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-800">{filteredRecipes.length}</span> of <span className="font-semibold text-gray-800">{recipes.length}</span> recipes
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-primary hover:text-primary-600 font-medium text-sm transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
            </div>
          )}

          {/* Empty State - No Recipes at All */}
          {!loading && recipes.length === 0 && (
            <div className="text-center py-20">
              <div className="text-7xl mb-6">🥤</div>
              <h3 className="text-2xl font-heading font-semibold text-gray-800 mb-3">
                No recipes yet
              </h3>
              <p className="text-gray-600 mb-6">
                Be the first to share a smoothie recipe!
              </p>
            </div>
          )}

          {/* Empty State - No Results from Filters */}
          {!loading && recipes.length > 0 && filteredRecipes.length === 0 && (
            <div className="text-center py-20">
              <div className="text-7xl mb-6">🔍</div>
              <h3 className="text-2xl font-heading font-semibold text-gray-800 mb-3">
                No recipes found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filters
              </p>
              <button
                onClick={clearFilters}
                className="bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Recipe Grid */}
          {!loading && filteredRecipes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home