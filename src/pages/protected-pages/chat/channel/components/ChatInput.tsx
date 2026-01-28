import { Plus } from "lucide-react"; // Hoặc icon library bro đang dùng
import { useState, KeyboardEvent } from "react";

interface ChatInputProps {
    placeholder: string;
    // Hàm này sẽ được gọi khi user bấm Enter
    onSubmit: (content: string) => void;
    // (Optional) Sau này handle upload file thì thêm onUploadFile
}

export const ChatInput = ({ placeholder, onSubmit }: ChatInputProps) => {
    // 1. Tự quản lý state nội bộ (User đang gõ gì)
    const [content, setContent] = useState("");

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        // 2. Logic: Bấm Enter (không kèm Shift) thì gửi
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Chặn việc xuống dòng (nếu dùng textarea)

            if (!content.trim()) return; // Không gửi tin nhắn rỗng

            // 3. Gọi hàm của cha để xử lý logic gửi
            onSubmit(content);

            // 4. Reset input ngay lập tức (cho cảm giác mượt)
            setContent("");
        }
    }

    return (
        <div className="px-4 pb-6 pt-2">
            <div className="bg-[#383A40] rounded-lg px-4 py-2.5 flex items-center gap-4">
                {/* Nút upload file (để logic sau) */}
                <button
                    onClick={() => console.log("Open file dialog")}
                    className="flex items-center justify-center"
                >
                    <Plus size={24} className="text-gray-200 cursor-pointer bg-gray-700 rounded-full p-1 hover:bg-gray-600 transition" />
                </button>

                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="bg-transparent border-none outline-none text-white w-full placeholder-gray-400 font-medium"
                    autoFocus // Tự focus khi vào trang
                />
            </div>
        </div>
    );
};