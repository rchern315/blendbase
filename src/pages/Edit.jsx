import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import supabase from '../config/supabaseClient'

function Edit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [directions, setDirections] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [prepTime, setPrepTime] = useState('')
  const [servings, setServings] = useState('')
  const [ingredients, setIngredients] = useState([{ amount: '', name: '' }])
  const [formError, setFormError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchRecipe()
  }, [id])

  const fetchRecipe = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      if (data) {
        setTitle(data.title)
        setDescription(data.description)
        setDirections(data.directions)
        setImageUrl(data.image || '')
        setPrepTime(data.prep_time || '')
        setServings(data.servings || '')
        
        // Parse ingredients
        const ingredientsArray = Array.isArray(data.ingredients) 
          ? data.ingredients 
          : []
        setIngredients(ingredientsArray.length > 0 ? ingredientsArray : [{ amount: '', name: '' }])
      }
    } catch (error) {
      console.error('Error fetching recipe:', error)
      setFormError('Could not load recipe')
    } finally {
      setLoading(false)
    }
  }

  // Add new ingredient row
  const addIngredient = () => {
    setIngredients([...ingredients, { amount: '', name: '' }])
  }

  // Remove ingredient row
  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index)
    setIngredients(newIngredients)
  }

  // Update ingredient
  const updateIngredient = (index, field, value) => {
    const newIngredients = [...ingredients]
    newIngredients[index][field] = value
    setIngredients(newIngredients)
  }

  // Upload image to Supabase Storage
  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = fileName

    const { error: uploadError } = await supabase.storage
      .from('recipe-images')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    // Get public URL
    const { data } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!title || !description || !directions) {
      setFormError('Please fill in title, description, and directions.')
      return
    }

    // Filter out empty ingredients
    const validIngredients = ingredients.filter(
      (ing) => ing.amount.trim() !== '' && ing.name.trim() !== ''
    )

    if (validIngredients.length === 0) {
      setFormError('Please add at least one ingredient.')
      return
    }

    try {
      setUpdating(true)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setFormError('You must be signed in to edit recipes.')
        setUpdating(false)
        return
      }

      // Handle image upload if new file selected
      let finalImageUrl = imageUrl

      if (imageFile) {
        try {
          finalImageUrl = await uploadImage(imageFile)
        } catch (uploadError) {
          console.error('Upload error:', uploadError)
          setFormError('Failed to upload image. Please try again.')
          setUpdating(false)
          return
        }
      }

      // Use existing image if no new one provided
      if (!finalImageUrl) {
        // Fetch current recipe to get existing image
        const { data: currentRecipe } = await supabase
          .from('recipes')
          .select('image')
          .eq('id', id)
          .single()
        
        finalImageUrl = currentRecipe?.image || 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800'
      }

      // Update recipe
      const { error } = await supabase
        .from('recipes')
        .update({
          title,
          description,
          directions,
          image: finalImageUrl,
          prep_time: prepTime || 5,
          ingredients: validIngredients,
          servings: servings || 2,
        })
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user owns the recipe

      if (error) {
        console.error('Error details:', error)
        setFormError(`Error: ${error.message}`)
        return
      }

      // Success - redirect to dashboard
      navigate('/dashboard')
    } catch (error) {
      console.error('Error:', error)
      setFormError('Error updating recipe. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center text-gray-600">Loading recipe...</div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-primary mb-2" style={{ fontFamily: 'Jost, Poppins, sans-serif' }}>
        Edit Recipe
      </h1>
      <p className="text-gray-600 mb-8">Update your smoothie recipe</p>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md">
        {/* Title */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            Recipe Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Berry Blast Smoothie"
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            placeholder="Brief description of your smoothie..."
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-vertical"
          />
        </div>

        {/* Image Upload Section */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Recipe Image
          </label>
          <div className="flex flex-col md:flex-row gap-4 items-start">
            {/* File Upload */}
            <div className="flex-1">
              <label
                htmlFor="imageFile"
                className="inline-block bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg cursor-pointer transition text-sm font-medium"
              >
                📁 Choose New Image
              </label>
              <input
                type="file"
                id="imageFile"
                accept="image/*"
                onChange={(e) => {
                  setImageFile(e.target.files[0])
                  setImageUrl('') // Clear URL if file is selected
                }}
                className="hidden"
              />
              {imageFile && (
                <p className="text-sm text-primary mt-2 font-medium">
                  Selected: {imageFile.name}
                </p>
              )}
            </div>

            <span className="text-gray-500 font-medium">OR</span>

            {/* URL Input */}
            <div className="flex-1">
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value)
                  setImageFile(null) // Clear file if URL is entered
                }}
                placeholder="Paste image URL..."
                disabled={imageFile !== null}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition disabled:bg-gray-100"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Upload a new image or paste a URL (leave unchanged to keep current image)
          </p>
        </div>

        {/* Prep Time & Servings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="prepTime" className="block text-sm font-semibold text-gray-700 mb-2">
              Prep Time (minutes)
            </label>
            <input
              type="number"
              id="prepTime"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              placeholder="5"
              min="1"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="servings" className="block text-sm font-semibold text-gray-700 mb-2">
              Servings
            </label>
            <input
              type="number"
              id="servings"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              placeholder="2"
              min="1"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            />
          </div>
        </div>

        {/* Ingredients */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ingredients *
          </label>
          <div className="space-y-3">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={ingredient.amount}
                  onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                  placeholder="1 cup"
                  className="w-32 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                />
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  placeholder="strawberries"
                  className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-medium"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addIngredient}
            className="mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium border-2 border-dashed border-gray-300 w-full"
          >
            + Add Ingredient
          </button>
        </div>

        {/* Directions */}
        <div className="mb-6">
          <label htmlFor="directions" className="block text-sm font-semibold text-gray-700 mb-2">
            Directions *
          </label>
          <textarea
            id="directions"
            value={directions}
            onChange={(e) => setDirections(e.target.value)}
            rows="8"
            placeholder="Step-by-step instructions for making your smoothie..."
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-vertical"
          />
        </div>

        {/* Error Message */}
        {formError && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {formError}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={updating}
            className="flex-1 bg-primary hover:bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {updating ? 'Updating...' : 'Update Recipe'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-8 bg-gray-200 hover:bg-gray-300 text-gray-700 py-4 rounded-lg font-semibold text-lg transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default Edit