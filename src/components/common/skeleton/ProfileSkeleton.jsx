const ProfileSkeleton = () => {
    return (
        <div className="max-w-7xl mx-auto flex justify-center gap-6 px-4 animate-pulse">
            {/* 1. Sidebar Skeleton */}
            <div className="hidden md:block w-64 pt-6">
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Main Profile Content Skeleton */}
            <div className="w-full md:w-600px py-6">
                {/* Profile Card Header */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    {/* Cover Photo Area */}
                    <div className="h-32 bg-gray-200"></div>

                    <div className="px-6 pb-6">
                        <div className="relative flex justify-between items-end -mt-12 mb-4">
                            {/* Avatar Skeleton */}
                            <div className="w-24 h-24 bg-gray-300 border-4 border-white rounded-full shadow-lg"></div>
                            
                            {/* Button Skeleton */}
                            <div className="w-28 h-9 bg-gray-200 rounded-full"></div>
                        </div>

                        {/* Name & Username Skeleton */}
                        <div className="space-y-2">
                            <div className="h-6 bg-gray-200 rounded w-48"></div>
                            <div className="h-4 bg-gray-100 rounded w-32"></div>
                        </div>

                        {/* Bio Skeleton */}
                        <div className="mt-4 space-y-2">
                            <div className="h-3 bg-gray-100 rounded w-full"></div>
                            <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                        </div>

                        {/* Joined Date Skeleton */}
                        <div className="mt-4 flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-100 rounded-full"></div>
                            <div className="h-3 bg-gray-100 rounded w-32"></div>
                        </div>

                        {/* Stats Skeleton (Posts, Followers, Following) */}
                        <div className="flex gap-6 mt-6 border-t pt-4">
                            <div className="flex gap-2 items-center">
                                <div className="w-6 h-4 bg-gray-200 rounded"></div>
                                <div className="w-12 h-3 bg-gray-100 rounded"></div>
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="w-6 h-4 bg-gray-200 rounded"></div>
                                <div className="w-16 h-3 bg-gray-100 rounded"></div>
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="w-6 h-4 bg-gray-200 rounded"></div>
                                <div className="w-16 h-3 bg-gray-100 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>

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

            {/* 3. Rightbar Skeleton */}
            <div className="hidden lg:block w-80 pt-6">
                <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-4">
                    <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                <div className="h-3 bg-gray-100 rounded w-20"></div>
                            </div>
                            <div className="w-16 h-7 bg-gray-200 rounded-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default ProfileSkeleton;