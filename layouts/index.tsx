import Head from 'next/head'
import Grid from '@mui/material/Grid'
import Menu from '../components/Menu'

type LayoutProps = {
    children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <Head>
                <title>Конструктор тг ботов</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Grid container spacing={2}>
                <Grid item xs={1}>
                    <Menu/>
                </Grid>
                <Grid item xs={11} sx={{ paddingTop: '2% !important', paddingBottom: '2% !important' }}>
                    {children}
                </Grid>
            </Grid>
        </>
    )
}
