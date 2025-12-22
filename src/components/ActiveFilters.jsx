function ActiveFilters({ searchTerm, sortBy, prepTimeFilter, ratingFilter, onClearSearch, onClearAll }) {
  const filters = []

  if (searchTerm) {
    filters.push({ label: `Search: "${searchTerm}"`, onClear: onClearSearch, type: 'search' })
  }
  
  if (sortBy !== 'newest') {
    const sortLabels = {
      'oldest': 'Oldest First',
      'highest-rated': 'Highest Rated',
      'most-reviewed': 'Most Reviewed',
      'quickest': 'Quickest'
    }
    filters.push({ label: `Sort: ${sortLabels[sortBy]}`, type: 'sort' })
  }

  if (prepTimeFilter !== 'all') {
    filters.push({ label: `Under ${prepTimeFilter} min`, type: 'prepTime' })
  }

  if (ratingFilter !== '0') {
    filters.push({ label: `${ratingFilter}+ Stars`, type: 'rating' })
  }

  if (filters.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 items-center mb-4">
      <span className="text-sm font-medium text-gray-600">Active filters:</span>
      {filters.map((filter, index) => (
        <div 
          key={index}
          className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
        >
          <span>{filter.label}</span>
          {filter.onClear && (
            <button
              onClick={filter.onClear}
              className="hover:text-primary-600 font-bold"
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm text-gray-600 hover:text-gray-700 underline ml-2"
      >
        Clear all
      </button>
    </div>
  )
}

export default ActiveFilters