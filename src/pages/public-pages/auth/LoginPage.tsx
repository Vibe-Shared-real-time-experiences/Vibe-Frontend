import type { LoginRequest } from '../../../types/auth';
import { useAppDispatch } from '../../../features/hooks';
import { login } from '../../../features/auth/authThunk';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LoginPage() {

    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState<LoginRequest>({
        username: '',
        password: '',
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await dispatch(login(formData))
        } catch (error) {
            console.error("Login failed:", error);
            return;
        }
    };

    return (
        <div className="h-screen w-full bg-black bg-cover flex items-center justify-center">
            <div className="bg-slate-700 p-8 rounded-md shadow-lg w-full max-w-[480px] sm:min-w-[400px]">
                <h2 className="text-2xl font-bold text-white text-center mb-1">Welcome back!</h2>
                <p className="text-gray-400 text-center mb-6">We're so excited to see you again!</p>

                <form onSubmit={(e) => { handleLogin(e) }} className="flex flex-col gap-4">

                    {/* Username */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Username *</label>
                        <input
                            type="text"
                            className="w-full bg-slate-800 text-white p-2.5 rounded border-none outline-none focus:ring-0"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Password *</label>
                        <input
                            type="password"
                            className="w-full bg-slate-800 text-white p-2.5 rounded border-none outline-none focus:ring-0"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <a href="#" className="text-[#00A8FC] text-xs hover:underline mt-1 block">Forgot your password?</a>
                    </div>

                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium p-2.5 rounded transition-colors mt-2">
                        Log In
                    </button>
                </form>

                <div className="mt-4 text-sm text-gray-400">
                    Need an account? <Link to="/register" className="text-[#00A8FC] hover:underline">Register</Link>
                </div>
            </div>
        </div>
    );
}