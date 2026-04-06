function formatOccurredAt(value) {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function getSeverityTone(severity) {
  switch (severity) {
    case 'warning':
      return 'bg-amber-100 text-amber-800'
    case 'error':
      return 'bg-rose-100 text-rose-800'
    default:
      return 'bg-sky-100 text-sky-800'
  }
}

function getSeverityLabel(severity) {
  switch (severity) {
    case 'warning':
      return 'Perlu perhatian'
    case 'error':
      return 'Penting'
    default:
      return 'Info'
  }
}

function mapRecurringDue(item) {
  const isOverdue = item.severity === 'warning'

  return {
    ...item,
    title: isOverdue ? 'Jadwal berulang sudah lewat' : 'Jadwal berulang akan segera berjalan',
    message: item.message || 'Ada jadwal berulang yang perlu kamu cek.',
    typeLabel: 'Recurring',
  }
}

function mapDebtActive(item) {
  return {
    ...item,
    title: 'Debt aktif masih perlu perhatian',
    message: item.message || 'Masih ada debt aktif yang belum selesai.',
    typeLabel: 'Debt aktif',
  }
}

export function normalizeNotifications(items = []) {
  return items.map((item) => {
    const baseItem =
      item?.type === 'recurring_due'
        ? mapRecurringDue(item)
        : item?.type === 'debt_active'
          ? mapDebtActive(item)
          : {
              ...item,
              title: item?.title || 'Notifikasi',
              message: item?.message || 'Ada informasi baru untuk kamu.',
              typeLabel: 'Notifikasi',
            }

    return {
      ...baseItem,
      severityLabel: getSeverityLabel(item?.severity),
      severityTone: getSeverityTone(item?.severity),
      occurredAtLabel: formatOccurredAt(item?.occurred_at),
    }
  })
}
