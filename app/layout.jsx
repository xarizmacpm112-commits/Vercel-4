import './globals.css'

export const metadata = {
  title: 'B2B GARANT CRM',
  description: 'CRM для риелторов'
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
