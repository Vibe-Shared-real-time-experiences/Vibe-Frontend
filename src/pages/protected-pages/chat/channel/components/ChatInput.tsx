import { Plus, X, File as FileIcon } from "lucide-react";
import { useState, useRef, ChangeEvent } from "react";

interface ChatInputProps {
    placeholder: string;
    // 👇 Update hàm submit để nhận cả file
    onSubmit: (content: string, files: File[]) => void;
    disabled: boolean;
}

export const ChatInput = ({ placeholder, onSubmit, disabled }: ChatInputProps) => {
    const [content, setContent] = useState("");
    const [files, setFiles] = useState<File[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...selectedFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSend = () => {
        if (!content.trim() && files.length === 0) return;

        onSubmit(content, files);

        setContent("");
        setFiles([]);
    };

    return (
        <div className="px-4 pb-6 pt-2">
            {/* File Preview */}
            {files.length > 0 && (
                <div className="flex gap-2 mb-2 overflow-x-auto px-4">
                    {files.map((file, index) => (
                        <div key={index} className="relative bg-gray-700 p-2 m-2 rounded-md flex items-center gap-2 min-w-[150px]">
                            <div className="bg-gray-600 p-2 rounded">
                                <FileIcon size={20} className="text-blue-400" />
                            </div>
                            <span className="text-sm text-gray-200 truncate max-w-[100px]">{file.name}</span>

                            {/* Remove file btn */}
                            <button
                                onClick={() => removeFile(index)}
                                className="absolute -top-1 -right-1 bg-rose-500 rounded-full p-0.5 shadow-md hover:bg-rose-600"
                            >
                                <X size={14} className="text-white" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-[#383A40] rounded-lg px-4 py-2.5 flex items-center gap-4">
                {/* Open file selector */}
                <button onClick={() => fileInputRef.current?.click()}>
                    <Plus size={24} className="text-gray-200 cursor-pointer bg-gray-700 rounded-full p-1 hover:bg-gray-600 transition" />
                </button>

                {/* Hidden file input */}
                <input
                    type="file"
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                />

                {/* Text input */}
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="bg-transparent border-none outline-none text-white w-full placeholder-gray-400 font-medium"
                />
            </div>
        </div>
    );
};