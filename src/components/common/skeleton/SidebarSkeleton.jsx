const SidebarSkeleton = () => (
  <div className="hidden md:block w-1/4 p-4 space-y-4 animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center space-x-3">
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    ))}
  </div>
);
export default SidebarSkeleton;