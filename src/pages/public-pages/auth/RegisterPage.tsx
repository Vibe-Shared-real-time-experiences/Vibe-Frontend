import type { RegisterRequest } from '../../../types/auth';
import { useAppDispatch } from '../../../features/hooks';
import { register } from '../../../features/auth/authThunk';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function RegisterPage() {

    const dispatch = useAppDispatch();

    const [dateOfBirth, setDateOfBirth] = useState({
        day: 1,
        month: 1,
        year: 2000,
    })

    const [formData, setFormData] = useState<RegisterRequest>({
        email: '',
        displayName: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const request = { ...formData, dateOfBirth: `${dateOfBirth.year}-${dateOfBirth.month.toString().padStart(2, '0')}-${dateOfBirth.day.toString().padStart(2, '0')}` }
            await dispatch(register(request))
        } catch (error) {
            console.error("Registration failed:", error);
            return;
        }
    };

    return (
        <div className="h-screen w-full bg-black bg-cover flex items-center justify-center">
            <div className="bg-slate-700 p-8 rounded-md shadow-lg w-full max-w-[480px] sm:min-w-[400px]">
                <h2 className="text-2xl font-bold text-white text-center mb-1">Welcome back!</h2>
                <p className="text-gray-400 text-center mb-6">We're so excited to see you again!</p>

                <form onSubmit={(e) => { handleRegister(e) }} className="flex flex-col gap-4">

                    {/* Email */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Email *</label>
                        <input
                            type="email"
                            className="w-full bg-slate-800 text-white p-2.5 rounded border-none outline-none focus:ring-0"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    {/* Display Name */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Display Name</label>
                        <input
                            type="text"
                            className="w-full bg-slate-800 text-white p-2.5 rounded border-none outline-none focus:ring-0"
                            value={formData.displayName}
                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
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
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Confirm Password *</label>
                        <input
                            type="password"
                            className="w-full bg-slate-800 text-white p-2.5 rounded border-none outline-none focus:ring-0"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Date of Birth *</label>
                        <div className="flex gap-2">
                            {/* Day */}
                            <select
                                className="flex-1 bg-slate-800 text-white p-2.5 rounded border-none outline-none focus:ring-0 cursor-pointer text-sm"
                                value={dateOfBirth.day}
                                onChange={(e) => setDateOfBirth({
                                    ...dateOfBirth,
                                    day: parseInt(e.target.value)
                                })}
                                required
                            >
                                <option value="">Day</option>
                                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>

                            {/* Month */}
                            <select
                                className="flex-1 bg-slate-800 text-white p-2.5 rounded border-none outline-none focus:ring-0 cursor-pointer text-sm"
                                value={dateOfBirth.month}
                                onChange={(e) => setDateOfBirth({
                                    ...dateOfBirth,
                                    month: parseInt(e.target.value)
                                })}
                                required
                            >
                                <option value="">Month</option>
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                    <option key={month} value={month}>{month}</option>
                                ))}
                            </select>

                            {/* Year */}
                            <select
                                className="flex-1 bg-slate-800 text-white p-2.5 rounded border-none outline-none focus:ring-0 cursor-pointer text-sm"
                                value={dateOfBirth.year}
                                onChange={(e) => setDateOfBirth({
                                    ...dateOfBirth,
                                    year: parseInt(e.target.value)
                                })}
                                required
                            >
                                <option value="">Year</option>
                                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium p-2.5 rounded transition-colors mt-2">
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