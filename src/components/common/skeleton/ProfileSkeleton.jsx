const ProfileSkeleton = () => {
    return (
        <div className="max-w-7xl mx-auto flex justify-center gap-6 px-4 animate-pulse">
            {/* 2. Main Profile Content Skeleton */}
            <div className="w-full md:w-600px py-6">
                {/* My Posts Section Skeleton */}
                <div className="space-y-6">
                    <div className="h-6 bg-gray-200 rounded w-32 mx-2"></div>
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 h-64">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                <div className="space-y-2">
                                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                                    <div className="h-2 bg-gray-100 rounded w-16"></div>
                                </div>
                            </div>
                            <div className="h-40 bg-gray-100 rounded-xl w-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default ProfileSkeleton;
