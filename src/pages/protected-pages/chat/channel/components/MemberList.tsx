
const MemberList = () => {
    return (
        <div className="w-60 bg-[#2B2D31] hidden xl:flex flex-col p-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-4">Online — 1</h3>
            <div className="flex items-center gap-3 opacity-90 hover:opacity-100 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-indigo-500 relative">
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-[2px] border-[#2B2D31]"></div>
                </div>
                <span className="text-gray-300 font-medium">Phước</span>
            </div>
        </div>
    )
}

export default MemberList