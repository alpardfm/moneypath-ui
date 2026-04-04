export function createProfileFormFromItem(profile) {
  return {
    email: profile?.email || '',
    username: profile?.username || '',
    fullName: profile?.full_name || '',
  }
}

export function createPasswordForm() {
  return {
    currentPassword: '',
    newPassword: '',
  }
}
