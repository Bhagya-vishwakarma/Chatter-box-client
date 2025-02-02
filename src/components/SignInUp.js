'use client'
import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
const SignInUp = () => {
    const [isSignIn, setIsSignIn] = useState(true)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const endpoint = isSignIn ? 'signin' : 'signup'
            const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/${endpoint}`, formData)
            
            if (response.data.token) {
                localStorage.setItem('Token', response.data.token)
                window.location.href='/';
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error:', error)
            toast.error(error.response?.data?.message || 'An error occurred')
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
            <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-96">
                <h2 className="text-3xl font-bold mb-8 text-center text-secondary-DEFAULT dark:text-text-light">
                    {isSignIn ? 'Sign In' : 'Sign Up'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isSignIn && (
                        <div>
                            <label className="block text-secondary-DEFAULT dark:text-text-light text-sm font-semibold mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none dark:bg-surface-dark dark:text-text-light transition-colors duration-200"
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-secondary-DEFAULT dark:text-text-light text-sm font-semibold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none dark:bg-surface-dark dark:text-text-light transition-colors duration-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-secondary-DEFAULT dark:text-text-light text-sm font-semibold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none dark:bg-surface-dark dark:text-text-light transition-colors duration-200"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-hover text-text-light py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                        {isSignIn ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsSignIn(!isSignIn)}
                        className="text-accent hover:text-accent-hover font-medium transition-colors duration-200"
                    >
                        {isSignIn
                            ? "Don't have an account? Sign Up"
                            : 'Already have an account? Sign In'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SignInUp
