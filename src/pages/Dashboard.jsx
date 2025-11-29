import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import supabase from '../config/supabaseClient'

function Dashboard() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRecipes: 0,
    avgRating: 0,
    totalViews: 0
  })

  useEffect(() => {
    fetchUserRecipes()
  }, [])

  const fetchUserRecipes = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setLoading(false)
        return
      }

      // Fetch user's recipes
      const { data: recipesData, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setRecipes(recipesData || [])

      // Calculate stats
      if (recipesData && recipesData.length > 0) {
        // Get all ratings for user's recipes
        const recipeIds = recipesData.map(r => r.id)
        const { data: ratingsData } = await supabase
          .from('ratings')
          .select('rating')
          .in('recipe_id', recipeIds)

        let avgRating = 0
        if (ratingsData && ratingsData.length > 0) {
          const sum = ratingsData.reduce((acc, r) => acc + r.rating, 0)
          avgRating = (sum / ratingsData.length).toFixed(1)
        }

        setStats({
          totalRecipes: recipesData.length,
          avgRating: avgRating,
          totalViews: 0 // We'll implement view tracking later
        })
      }
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (recipeId) => {
    if (!confirm('Are you sure you want to delete this recipe?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId)

      if (error) throw error

      // Refresh recipes
      fetchUserRecipes()
    } catch (error) {
      console.error('Error deleting recipe:', error)
      alert('Failed to delete recipe')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center text-gray-600">Loading your dashboard...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2" style={{ fontFamily: 'Jost, Poppins, sans-serif' }}>
          My Dashboard
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">Manage your smoothie recipes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center">
          <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">{stats.totalRecipes}</div>
          <div className="text-gray-600 font-medium text-sm sm:text-base">Recipes Created</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center">
          <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
            {stats.avgRating > 0 ? stats.avgRating : '—'}
          </div>
          <div className="text-gray-600 font-medium text-sm sm:text-base">Average Rating</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center">
          <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">{stats.totalViews}</div>
          <div className="text-gray-600 font-medium text-sm sm:text-base">Total Views</div>
        </div>
      </div>

      {/* Create New Recipe Button */}
      <div className="mb-4 sm:mb-6">
        <Link to="/create">
          <button className="bg-primary hover:bg-primary-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition font-semibold shadow-md hover:shadow-lg text-sm sm:text-base">
            ➕ Create New Recipe
          </button>
        </Link>
      </div>

      {/* My Recipes */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ fontFamily: 'Jost, Poppins, sans-serif' }}>
          My Recipes ({recipes.length})
        </h2>

        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4 text-sm sm:text-base">You haven't created any recipes yet!</p>
            <Link to="/create">
              <button className="bg-primary hover:bg-primary-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition font-semibold text-sm sm:text-base">
                Create Your First Recipe
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white border-2 border-gray-200 rounded-lg hover:border-primary transition overflow-hidden"
              >
                {/* Image - Full width on mobile */}
                <img
                  src={recipe.image || 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800'}
                  alt={recipe.title}
                  className="w-full h-48 md:h-auto md:max-h-48 object-cover"
                />

                {/* Content */}
                <div className="p-3 sm:p-4">
                  {/* Info */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{recipe.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3">{recipe.description}</p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                    <span>⏱️ {recipe.prep_time || 5} min</span>
                    <span>👤 {recipe.servings || 2} servings</span>
                    <span>📅 {new Date(recipe.created_at).toLocaleDateString()}</span>
                  </div>

                  {/* Actions - Full width buttons on mobile */}
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    <Link to={`/edit/${recipe.id}`}>
                      <button className="w-full bg-primary hover:bg-primary-600 text-white px-2 sm:px-3 py-2 rounded-lg transition font-medium text-xs sm:text-sm">
                        ✏️ Edit
                      </button>
                    </Link>
                    <Link to="/">
                      <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 sm:px-3 py-2 rounded-lg transition font-medium text-xs sm:text-sm">
                        👁️ View
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(recipe.id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-2 rounded-lg transition font-medium text-xs sm:text-sm"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard