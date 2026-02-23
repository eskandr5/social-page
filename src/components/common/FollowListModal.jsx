import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const FollowListModal = ({ type, data, onClose }) => {
    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-sm max-h-[70vh] overflow-hidden flex flex-col shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className="p-5 border-b flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-black text-xl text-gray-800 uppercase tracking-tight">{type}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-all">
                        <AiOutlineClose size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {data?.length > 0 ? (
                        data.map((person) => (
                            <div key={person.id} className="flex items-center justify-between p-3 hover:bg-blue-50/50 rounded-2xl transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold shadow-sm">
                                        {person.username?.[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{person.username}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">@{person.username?.toLowerCase()}</p>
                                    </div>
                                </div>
                                <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                    View
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-400 italic text-sm">No one here yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowListModal;