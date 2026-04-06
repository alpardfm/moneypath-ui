import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ErrorState from '../components/feedback/ErrorState.jsx'
import FormField from '../components/forms/FormField.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import SectionCard from '../components/layout/SectionCard.jsx'
import { useAuth } from '../app/providers/useAuth.jsx'
import { registerUser } from '../features/auth/auth-service.js'

function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }))
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Nama lengkap wajib diisi.'
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email wajib diisi.'
    }

    if (!form.username.trim()) {
      nextErrors.username = 'Username wajib diisi.'
    }

    if (!form.password) {
      nextErrors.password = 'Password wajib diisi.'
    }

    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validateForm()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError('')

      const result = await registerUser(form)

      if (result.token) {
        login(result.token)
        navigate('/app/dashboard', { replace: true })
        return
      }

      navigate('/login', {
        replace: true,
        state: {
          message: result.message || 'Akun berhasil dibuat. Silakan masuk.',
        },
      })
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageContainer className="flex min-h-screen items-center py-8 sm:py-10" size="narrow">
      <SectionCard className="w-full space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Buat akun baru.</h1>
        </div>

        {submitError ? (
          <ErrorState title="Register gagal" message={submitError} />
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <FormField
            id="fullName"
            label="Nama lengkap"
            value={form.fullName}
            onChange={handleChange}
            autoComplete="name"
            placeholder="Nama lengkap"
            error={errors.fullName}
          />
          <FormField
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            placeholder="nama@email.com"
            error={errors.email}
          />
          <FormField
            id="username"
            label="Username"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            placeholder="username"
            error={errors.username}
          />
          <FormField
            id="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            placeholder="Buat password"
            error={errors.password}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:bg-slate-400"
          >
            {isSubmitting ? 'Sedang membuat akun...' : 'Daftar'}
          </button>
        </form>

        <p className="text-sm text-slate-600">
          Sudah punya akun? kembali ke halaman{' '}
          <Link className="font-medium text-slate-900 underline" to="/login">
            masuk
          </Link>
          .
        </p>
      </SectionCard>
    </PageContainer>
  )
}

export default RegisterPage
