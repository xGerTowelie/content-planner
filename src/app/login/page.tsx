import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
    console.log('Rendering LoginPage')
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-8">Login Page</h1>
            <p className="mb-4">Current path: /login</p>
            <LoginForm />
        </div>
    )
}
