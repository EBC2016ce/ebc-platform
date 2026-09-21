// Renders a JSON-LD structured data block. Server component - the markup is in
// the initial HTML so Google sees it without running JavaScript.
// "<" is escaped so content can never close the script tag early.
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
