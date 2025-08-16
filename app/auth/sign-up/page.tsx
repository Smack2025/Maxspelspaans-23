import SignUpForm from "@/components/sign-up-form"

export default async function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <SignUpForm />
    </div>
  )
}
