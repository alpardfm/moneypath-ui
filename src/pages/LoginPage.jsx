import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../app/providers/useAuth.jsx'
import ErrorState from '../components/feedback/ErrorState.jsx'
import FormField from '../components/forms/FormField.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import SectionCard from '../components/layout/SectionCard.jsx'
import { loginUser } from '../features/auth/auth-service.js'

function LoginPage() {
  const { login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const redirectTo = location.state?.from || '/app/dashboard'
  const [form, setForm] = useState({
    emailOrUsername: '',
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

    if (!form.emailOrUsername.trim()) {
      nextErrors.emailOrUsername = 'Email atau username wajib diisi.'
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

      const result = await loginUser(form)

      login(result.token)
      navigate(redirectTo, { replace: true })
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageContainer className="flex min-h-screen items-center py-8 sm:py-10" size="wide">
      <div className="grid w-full gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard className="space-y-4 sm:space-y-5">
          <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
            Phase 2 auth
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Login ke akun Moneypath kamu.
          </h1>
          <p className="max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Gunakan email dan password dari backend yang sudah kamu deploy. Setelah login berhasil,
            kamu akan diarahkan ke halaman protected yang terakhir diminta.
          </p>

          {location.state?.message ? (
            <SectionCard tone="subtle" className="border-emerald-200 bg-emerald-50">
              <p className="text-sm text-emerald-800">{location.state.message}</p>
            </SectionCard>
          ) : null}

          {submitError ? (
            <ErrorState
              title="Login gagal"
              message={submitError}
            />
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <FormField
              id="emailOrUsername"
              label="Email atau username"
              value={form.emailOrUsername}
              onChange={handleChange}
              autoComplete="username"
              placeholder="nama@email.com atau username"
              error={errors.emailOrUsername}
            />
            <FormField
              id="password"
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              placeholder="Masukkan password"
              error={errors.password}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:bg-slate-400"
            >
              {isSubmitting ? 'Sedang login...' : 'Login'}
            </button>
          </form>
        </SectionCard>

        <SectionCard as="aside" tone="subtle">
          <p className="text-sm font-medium text-slate-900">Auth flow yang sudah ditangani</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Submit login ke backend</li>
            <li>Store auth token ke local storage</li>
            <li>Redirect ke halaman protected</li>
            <li>Pesan error auth yang terlihat jelas</li>
          </ul>
          <p className="mt-6 text-sm text-slate-600">
            Belum punya akun? lanjut ke{' '}
            <Link className="font-medium text-slate-900 underline" to="/register">
              halaman register
            </Link>
            .
          </p>
        </SectionCard>
      </div>
    </PageContainer>
  )
}

export default LoginPage
