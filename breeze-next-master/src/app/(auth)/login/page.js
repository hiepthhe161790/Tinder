'use client'

import Button from '../../../components/Button'
import Input from '../../../components/Input'
import InputError from '../../../components/InputError'
import Label from '../../../components/Label'
import Link from 'next/link'
import { useAuth } from '../../../hooks/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthSessionStatus from '../../../app/(auth)/AuthSessionStatus'
import LoadingOverlay from "react-loading-overlay";
const Login = () => {
    const router = useRouter()

    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [shouldRemember, setShouldRemember] = useState(false)
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(false) // Thêm state để xác định trạng thái loading

    useEffect(() => {
        if (router.reset?.length > 0 && errors.length === 0) {
            setStatus(atob(router.reset))
        } else {
            setStatus(null)
        }
    })

    const submitForm = async event => {
        event.preventDefault()
        setLoading(true) // Khi bắt đầu xử lý, set loading thành true

        await login({
            email,
            password,
            remember: shouldRemember,
            setErrors,
            setStatus,
        }).finally(() => {
            // Chờ 2 giây trước khi kết thúc loading overlay
            // setTimeout(() => {
            setLoading(false); // Khi xử lý hoàn thành (thành công hoặc thất bại), set loading thành false
            // }, 5000); // 2000 milliseconds = 2 gi
        })
    }

    return (
        <LoadingOverlay
            active={loading}
            spinner
            text='Loading...'
        >
            <>
                <AuthSessionStatus className="mb-4" status={status} />
                <form onSubmit={submitForm}>
                    {/* Email Address */}
                    <div>
                        <Label htmlFor="email">Email</Label>

                        <Input
                            id="email"
                            type="email"
                            value={email}
                            className="block mt-1 w-full"
                            onChange={event => setEmail(event.target.value)}
                            required
                            autoFocus
                        />

                        {errors && errors.email && <InputError messages={errors.email} className="mt-2" />}
                    </div>

                    {/* Password */}
                    <div className="mt-4">
                        <Label htmlFor="password">Password</Label>

                        <Input
                            id="password"
                            type="password"
                            value={password}
                            className="block mt-1 w-full"
                            onChange={event => setPassword(event.target.value)}
                            required
                            autoComplete="current-password"
                        />

                        {errors && errors.password && <InputError messages={errors.password} className="mt-2" />}
                    </div>

                    {/* Remember Me */}
                    <div className="block mt-4">
                        <label
                            htmlFor="remember_me"
                            className="inline-flex items-center">
                            <input
                                id="remember_me"
                                type="checkbox"
                                name="remember"
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                onChange={event =>
                                    setShouldRemember(event.target.checked)
                                }
                            />

                            <span className="ml-2 text-sm text-gray-600">
                                Remember me
                            </span>
                        </label>
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        <Link
                            href="/forgot-password"
                            className="underline text-sm text-gray-600 hover:text-gray-900">
                            Forgot your password?
                        </Link>

                        <Button className="ml-3">Login</Button>
                    </div>
                </form>
                {status && <div>{status}</div>}
            </>
        </LoadingOverlay>
    )
}

export default Login