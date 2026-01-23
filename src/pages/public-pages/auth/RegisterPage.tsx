import type { RegisterRequest } from '../../../types/auth';
import { useAppDispatch } from '../../../features/hooks';
import { register } from '../../../features/auth/authThunk';

export default function RegisterPage() {

    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState<RegisterRequest>({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await dispatch(register(formData))
        } catch (error) {
            console.error("Registration failed:", error);
            return;
        }
    };

    return (
        <div className="h-screen w-full bg-black bg-cover flex items-center justify-center">
            <div className="bg-[#313338] p-8 rounded-md shadow-lg w-full max-w-[480px] sm:min-w-[400px]">
                <h2 className="text-2xl font-bold text-white text-center mb-1">Welcome back!</h2>
                <p className="text-gray-400 text-center mb-6">We're so excited to see you again!</p>

                <form onSubmit={(e) => { handleRegister(e) }} className="flex flex-col gap-4">

                    {/* Username */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Username *</label>
                        <input
                            type="text"
                            className="w-full bg-[#1E1F22] text-white p-2.5 rounded border-none outline-none focus:ring-0"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Password *</label>
                        <input
                            type="password"
                            className="w-full bg-[#1E1F22] text-white p-2.5 rounded border-none outline-none focus:ring-0"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Confirm Password *</label>
                        <input
                            type="password"
                            className="w-full bg-[#1E1F22] text-white p-2.5 rounded border-none outline-none focus:ring-0"
                            required
                        />
                    </div>

                    <button className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium p-2.5 rounded transition-colors mt-2">
                        Register
                    </button>
                </form>

                <div className="mt-4 text-sm text-gray-400">
                    Already have an account? <Link to="/login" className="text-[#00A8FC] hover:underline">Log In</Link>
                </div>
            </div>
        </div>
    );
}