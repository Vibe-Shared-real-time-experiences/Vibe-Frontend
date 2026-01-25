import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Camera } from 'lucide-react';
import { useAppDispatch } from '../../../../../features/hooks';
import { createServer } from '../../../../../features/chat/serverThunk';
import type { CreateServerRequest } from '../../../../../types/chat/server';
import { useNavigate } from 'react-router-dom';
import { setServerData } from '../../../../../features/chat/channelSlice';
import { flatChannelFormCategories } from '../../../../../utils/channelUtil';

interface CreateServerFormProps {
    onClose: () => void;
}

const CreateServerForm = ({ onClose }: CreateServerFormProps) => {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<CreateServerRequest>({
        name: '',
        description: '',
        iconUrl: '',
        publicAccess: false,
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, name: e.target.value });
        setError(null);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, description: e.target.value });
    };

    const handlePublicAccessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, publicAccess: e.target.checked });
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setPreview(result);
                setFormData({ ...formData, iconUrl: result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError('Server name is required');
            return;
        }

        setIsLoading(true);
        try {
            const newServer = await dispatch(createServer(formData)).unwrap();
            dispatch(setServerData(newServer));

            const { activeChannelId } = flatChannelFormCategories(newServer);

            if (activeChannelId) {
                navigate(`/channels/${newServer.id}/${activeChannelId}`);
            } else {
                navigate(`/channels/${newServer.id}`);
            }

            setFormData({ name: '', description: '', iconUrl: '', publicAccess: false });
            setPreview(null);
            onClose();
        } catch (err) {
            setError(err as string || 'Failed to create server');
        } finally {
            setIsLoading(false);
        }
    };

    // Listen to escape key to close modal
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <>
            {/* Backdrop with blur */}
            <div
                className="fixed inset-0 bg-black opacity-50 backdrop-blur z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto bg-slate-700 rounded-lg shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-600">
                        <h2 className="text-xl font-bold text-white">Customise Your Server</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Description */}
                        <p className="text-gray-300 text-sm">
                            Give your new server a personality with a name and an icon. You can always change it later.
                        </p>

                        {/* Icon Upload Section */}
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={handleUploadClick}
                                className="relative group"
                            >
                                <div className="w-32 h-32 rounded-full border-2 border-dashed border-indigo-500 flex items-center justify-center bg-slate-800 hover:bg-slate-700 transition-colors">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Server icon preview"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <Camera className="text-gray-400" size={40} />
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 rounded-full p-3 text-white transition-colors shadow-lg">
                                    <Camera size={20} />
                                </div>
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>
                        <div className="text-center text-xs text-gray-400">UPLOAD</div>

                        {/* Server Name */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                                Server Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={handleNameChange}
                                placeholder="Enter server name"
                                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>

                        {/* Server Description */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={handleDescriptionChange}
                                placeholder="Enter server description (optional)"
                                rows={3}
                                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                            />
                        </div>

                        {/* Public Access */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="publicAccess"
                                checked={formData.publicAccess}
                                onChange={handlePublicAccessChange}
                                className="w-4 h-4 rounded cursor-pointer accent-indigo-600"
                            />
                            <label htmlFor="publicAccess" className="ml-3 text-sm text-white cursor-pointer">
                                Make this server public
                            </label>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Community Guidelines Note */}
                        <p className="text-xs text-gray-400">
                            By creating a server, you agree to Discord's{' '}
                            <a href="#" className="text-indigo-400 hover:underline">
                                Community Guidelines
                            </a>
                            .
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 text-gray-300 hover:text-white bg-transparent hover:bg-slate-600 rounded-lg font-medium transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                            >
                                {isLoading ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateServerForm;