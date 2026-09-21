// Keeps this private / non-marketing area out of Google's index.
// (Layouts wrap every page in this folder, including client components that
// can't export metadata themselves.)
export const metadata = {
  robots: { index: false, follow: false },
}

export default function Layout({ children }) {
  return children
}
