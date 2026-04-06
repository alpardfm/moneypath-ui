import { useCallback, useEffect, useState } from 'react'
import EmptyState from '../components/feedback/EmptyState.jsx'
import ErrorState from '../components/feedback/ErrorState.jsx'
import LoadingState from '../components/feedback/LoadingState.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import PageHeader from '../components/layout/PageHeader.jsx'
import SectionCard from '../components/layout/SectionCard.jsx'
import { getNotifications } from '../features/notifications/notification-service.js'
import { normalizeNotifications } from '../features/notifications/notification-utils.js'

function NotificationsPage() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage('')

      const result = await getNotifications()
      setItems(normalizeNotifications(result))
    } catch (error) {
      setErrorMessage(error.message || 'Gagal memuat notifikasi.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  return (
    <PageContainer className="space-y-6">
      <PageHeader eyebrow="Notifikasi" title="Pengingat dan perhatian." />

      {isLoading ? (
        <LoadingState
          title="Memuat notifikasi"
          message="Pengingat recurring dan debt aktif sedang diambil dari server."
        />
      ) : errorMessage ? (
        <ErrorState
          title="Notifikasi belum bisa dimuat"
          message={errorMessage}
          actionLabel="Coba lagi"
          onAction={loadNotifications}
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="Belum ada notifikasi"
          message="Saat ada recurring yang mendekat atau debt aktif yang perlu diperhatikan, notifikasinya akan muncul di sini."
        />
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <SectionCard key={`${item.type}-${item.resource_id || index}`} className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${item.severityTone}`}>
                      {item.severityLabel}
                    </span>
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {item.typeLabel}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.message}</p>
                  </div>
                </div>

                {item.occurredAtLabel ? (
                  <span className="text-xs font-medium text-slate-500">{item.occurredAtLabel}</span>
                ) : null}
              </div>
            </SectionCard>
          ))}
        </div>
      )}
    </PageContainer>
  )
}

export default NotificationsPage
