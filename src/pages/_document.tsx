import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        {/* Target for mounting modals */}
        <div id="modal" />
        <NextScript />
      </body>
    </Html>
  )
}
