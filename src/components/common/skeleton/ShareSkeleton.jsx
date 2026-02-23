const ShareSkeleton = () => (
    <div className="p-4 bg-white rounded-xl shadow-sm mb-4 animate-pulse">
        <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
        </div>
        <div className="border-t pt-3 flex justify-around">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
    </div>
);
export default ShareSkeleton;