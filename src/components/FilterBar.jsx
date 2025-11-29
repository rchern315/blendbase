import { FaFilter, FaSortAmountDown } from 'react-icons/fa'

function FilterBar({ sortBy, onSortChange, prepTimeFilter, onPrepTimeChange, ratingFilter, onRatingChange }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-wrap gap-4">
        {/* Sort By */}
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <FaSortAmountDown className="text-gray-400" />
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:border-primary focus:outline-none text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest-rated">Highest Rated</option>
            <option value="most-reviewed">Most Reviewed</option>
            <option value="quickest">Quickest Prep Time</option>
          </select>
        </div>

        {/* Prep Time Filter */}
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <FaFilter className="text-gray-400" />
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Prep time:</label>
          <select
            value={prepTimeFilter}
            onChange={(e) => onPrepTimeChange(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:border-primary focus:outline-none text-sm"
          >
            <option value="all">All Times</option>
            <option value="5">Under 5 min</option>
            <option value="10">Under 10 min</option>
            <option value="15">Under 15 min</option>
            <option value="20">Under 20 min</option>
          </select>
        </div>

        {/* Rating Filter */}
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <span className="text-yellow-400">★</span>
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Min rating:</label>
          <select
            value={ratingFilter}
            onChange={(e) => onRatingChange(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:border-primary focus:outline-none text-sm"
          >
            <option value="0">All Ratings</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Stars</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default FilterBar