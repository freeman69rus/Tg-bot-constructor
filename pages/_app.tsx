import '../styles/globals.css'
import Layout from '../layouts'
import type { AppProps } from 'next/app'
import axios from "axios"

let fetched = false
if (!fetched) axios.post('api/startByStatus').then(() => fetched = true).catch(console.error)

export default function App({ Component, pageProps }: AppProps) {
  return <Layout>
    <Component {...pageProps} />
  </Layout>
}
