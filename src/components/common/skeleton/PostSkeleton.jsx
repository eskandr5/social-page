const PostSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm p-4 mb-4 animate-pulse">
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-24"></div>
        <div className="h-2 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
    <div className="h-64 bg-gray-200 rounded-xl w-full"></div>
  </div>
);
export default PostSkeleton;