import { useCallback, useEffect, useState } from 'react'
import ErrorState from '../components/feedback/ErrorState.jsx'
import LoadingState from '../components/feedback/LoadingState.jsx'
import FormField from '../components/forms/FormField.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import SectionCard from '../components/layout/SectionCard.jsx'
import {
  changeCurrentPassword,
  getCurrentProfile,
  updateCurrentProfile,
} from '../features/profile/profile-service.js'
import { createPasswordForm, createProfileFormFromItem } from '../features/profile/profile-utils.js'

function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [profileForm, setProfileForm] = useState(createProfileFormFromItem())
  const [passwordForm, setPasswordForm] = useState(createPasswordForm())
  const [profileErrors, setProfileErrors] = useState({})
  const [passwordErrors, setPasswordErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [profileError, setProfileError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage('')

      const result = await getCurrentProfile()
      setProfile(result)
      setProfileForm(createProfileFormFromItem(result))
    } catch (error) {
      setErrorMessage(error.message || 'Gagal memuat profil.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const handleProfileChange = (event) => {
    const { name, value } = event.target

    setProfileForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))

    setProfileErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }))
  }

  const handlePasswordChange = (event) => {
    const { name, value } = event.target

    setPasswordForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))

    setPasswordErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }))
  }

  const validateProfileForm = () => {
    const nextErrors = {}

    if (!profileForm.fullName.trim()) {
      nextErrors.fullName = 'Nama lengkap wajib diisi.'
    }

    if (!profileForm.email.trim()) {
      nextErrors.email = 'Email wajib diisi.'
    }

    if (!profileForm.username.trim()) {
      nextErrors.username = 'Username wajib diisi.'
    }

    return nextErrors
  }

  const validatePasswordForm = () => {
    const nextErrors = {}

    if (!passwordForm.currentPassword.trim()) {
      nextErrors.currentPassword = 'Password saat ini wajib diisi.'
    }

    if (!passwordForm.newPassword.trim()) {
      nextErrors.newPassword = 'Password baru wajib diisi.'
    }

    return nextErrors
  }

  const handleProfileSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validateProfileForm()
    if (Object.keys(nextErrors).length > 0) {
      setProfileErrors(nextErrors)
      return
    }

    try {
      setIsSavingProfile(true)
      setProfileError('')
      setProfileSuccess('')

      const updatedProfile = await updateCurrentProfile(profileForm)
      setProfile(updatedProfile)
      setProfileForm(createProfileFormFromItem(updatedProfile))
      setProfileSuccess('Profil berhasil diperbarui.')
    } catch (error) {
      setProfileError(error.message)
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validatePasswordForm()
    if (Object.keys(nextErrors).length > 0) {
      setPasswordErrors(nextErrors)
      return
    }

    try {
      setIsSavingPassword(true)
      setPasswordError('')
      setPasswordSuccess('')

      await changeCurrentPassword(passwordForm)
      setPasswordForm(createPasswordForm())
      setPasswordSuccess('Password berhasil diperbarui.')
    } catch (error) {
      setPasswordError(error.message)
    } finally {
      setIsSavingPassword(false)
    }
  }

  const handleResetProfile = () => {
    setProfileForm(createProfileFormFromItem(profile))
    setProfileErrors({})
    setProfileError('')
  }

  const handleResetPassword = () => {
    setPasswordForm(createPasswordForm())
    setPasswordErrors({})
    setPasswordError('')
  }

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState
          title="Memuat profil"
          message="Data akun kamu sedang diambil dari server."
        />
      </PageContainer>
    )
  }

  if (errorMessage || !profile) {
    return (
      <PageContainer>
        <ErrorState
          title="Profil belum bisa dimuat"
          message={errorMessage || 'Data profil tidak ditemukan.'}
          actionLabel="Coba lagi"
          onAction={loadProfile}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-500">Profil</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Kelola data akun dengan sederhana.
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
          Halaman ini dipakai untuk memperbarui nama, email, username, dan password tanpa
          menambahkan pengaturan yang tidak perlu di MVP.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard className="space-y-5">
          <div className="space-y-2">
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
              Profil akun
            </span>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Perbarui data utama
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              Data ini dipakai sebagai identitas akun kamu saat menggunakan aplikasi.
            </p>
          </div>

          {profileError ? <ErrorState title="Perubahan profil gagal" message={profileError} /> : null}
          {profileSuccess ? (
            <SectionCard tone="subtle" className="border-emerald-200 bg-emerald-50">
              <p className="text-sm text-emerald-800">{profileSuccess}</p>
            </SectionCard>
          ) : null}

          <form className="space-y-4" onSubmit={handleProfileSubmit}>
            <FormField
              id="fullName"
              label="Nama lengkap"
              value={profileForm.fullName}
              onChange={handleProfileChange}
              error={profileErrors.fullName}
            />
            <FormField
              id="email"
              label="Email"
              type="email"
              value={profileForm.email}
              onChange={handleProfileChange}
              error={profileErrors.email}
            />
            <FormField
              id="username"
              label="Username"
              value={profileForm.username}
              onChange={handleProfileChange}
              error={profileErrors.username}
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:bg-slate-400 sm:w-auto"
              >
                {isSavingProfile ? 'Menyimpan...' : 'Simpan profil'}
              </button>
              <button
                type="button"
                onClick={handleResetProfile}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:w-auto"
              >
                Reset form
              </button>
            </div>
          </form>
        </SectionCard>

        <SectionCard className="space-y-5">
          <div className="space-y-2">
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
              Keamanan akun
            </span>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Ganti password
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              Masukkan password saat ini dan password baru untuk memperbarui akses akun.
            </p>
          </div>

          {passwordError ? <ErrorState title="Ganti password gagal" message={passwordError} /> : null}
          {passwordSuccess ? (
            <SectionCard tone="subtle" className="border-emerald-200 bg-emerald-50">
              <p className="text-sm text-emerald-800">{passwordSuccess}</p>
            </SectionCard>
          ) : null}

          <form className="space-y-4" onSubmit={handlePasswordSubmit}>
            <FormField
              id="currentPassword"
              label="Password saat ini"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.currentPassword}
            />
            <FormField
              id="newPassword"
              label="Password baru"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.newPassword}
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={isSavingPassword}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:bg-slate-400 sm:w-auto"
              >
                {isSavingPassword ? 'Menyimpan...' : 'Simpan password'}
              </button>
              <button
                type="button"
                onClick={handleResetPassword}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:w-auto"
              >
                Reset form
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </PageContainer>
  )
}

export default ProfilePage
