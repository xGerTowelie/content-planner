import SignUpForm from '@/components/SignUpForm'

export default function SignUpPage() {
    console.log('Rendering SignUpPage')
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-8">Sign Up</h1>
            <p className="mb-4">Create a new account</p>
            <SignUpForm />
        </div>
    )
}
