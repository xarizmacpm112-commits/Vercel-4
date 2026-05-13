import './globals.css'

export const metadata = {
  title: 'NovaCRM',
  description: 'Modern Real Estate CRM Dashboard'
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
