function PageContainer({ children, className = '', size = 'app' }) {
  const sizeClasses = {
    narrow: 'max-w-3xl',
    app: 'max-w-6xl',
    wide: 'max-w-7xl',
  }

  return (
    <div
      className={[
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        sizeClasses[size] || sizeClasses.app,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

export default PageContainer
