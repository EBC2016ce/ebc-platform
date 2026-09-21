'use client'
import { useEffect, useRef, useState } from 'react'

// Drop-in replacement for an autoplaying <video> that doesn't download until
// it is about to scroll into view. The homepage previously started loading all
// twelve project videos (roughly 40MB) as soon as the page opened, which
// slows the page down badly on mobile. Now only the videos a visitor
// actually scrolls to are fetched.
export default function LazyVideo({ src, poster, className, ...rest }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      src={visible ? src : undefined}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      className={className}
      {...rest}
    />
  )
}
