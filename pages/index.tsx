import { IBotRow } from "../types"
import React from "react"
import axios from "axios"
import { Collapse, List, ListItem, ListItemButton, Paper, TextField } from "@mui/material"
import logo from "../public/logo.png"
import Image from "next/image"
import Grid from "@mui/material/Grid"
import { ExpandLess, ExpandMore } from "@mui/icons-material"
import Button from "@mui/material/Button"
import Link from "next/link"

const roundedNShadows = {
  boxShadow: '0px 0px 4px -1px rgba(0, 0, 0, 0.25)',
  borderRadius: '50%'
}

const GridItemStyles = {
    height: '100%',
    display: 'flex',
    alignItems: 'center'
}

const branchButtonStyles = {
    background: '#19A0D8',
    width: '100%',
    marginBottom: '10px'
}

export default function Home() {
    const [fetched, setFetched] = React.useState<boolean>(false)
    const [bots, setBots] = React.useState<IBotRow[]>([])
    const [botOpen, setBotOpen] = React.useState<boolean[]>([])

    const getBots = async () => {
        const res = await axios.get('api/get/all').catch(console.log)
        setBots(res?.data)
        setFetched(true)
    }

    if (!fetched) getBots()

    const getStatusColor = (status: boolean) => {
        return status ? '#42FF00' : '#D6D6D6'
    }

    const toggleBot = (index: number) => {
        botOpen[index] = !botOpen[index]
        setBotOpen([...botOpen])
    }

    const saveToken = (id: number, index: number) => {
        axios.post('api/edit/'+id, { token: bots[index].token })
    }

    const setBotToken = (token: string, index: number) => {
        bots[index].token = token
        setBots([...bots])
    }

    const toggleBotStatus = async (id: number) => {
        const result = await axios.post('api/toggle/'+id)
        if (result.data) getBots()
    }

    if (!bots?.length) return <>
        <h1 style={{ marginBottom: '100px', fontSize: '2em', fontWeight: 500 }}>Боты</h1>
        <h1 style={{ color: '#ABABAB' }}>Пусто</h1>
    </>

    return (
        <>
            <h1 style={{ marginBottom: '100px', fontSize: '2em', fontWeight: 500 }}>Боты</h1>
            <List sx={{ width: '96%' }}>
                {bots.map((bot, i) => <>
                    <ListItem sx={{ paddingLeft: 0, paddingRight: 0 }} key={bot.id}>
                        <ListItemButton sx={{ padding: 0 }} onClick={() => toggleBot(i)}>
                            <Paper sx={{ width: '100%', height: '80px', padding: '0 30px', background: 'none'}}>
                                <Grid container sx={{ height: '100%'}}>

                                    <Grid item xs={.6} sx={GridItemStyles}>
                                        <Image src={logo} alt='logo' width={50} height={50} style={roundedNShadows}/>
                                    </Grid>

                                    <Grid item xs={10.4} sx={GridItemStyles}>
                                        <span style={{ fontWeight: 500 }}>{bot.name}</span>
                                    </Grid>

                                    <Grid item xs={.8} sx={{...GridItemStyles, justifyContent: 'end'}}>
                                        <span style={{ marginRight: '20px', color: '#A1A1A1' }}>status</span>
                                        <div style={{
                                            ...roundedNShadows,
                                            width: '40px',
                                            height: '40px',
                                            background: getStatusColor(bot.status)
                                        }}></div>
                                    </Grid>

                                    <Grid item xs={.2} sx={{...GridItemStyles, justifyContent: 'end'}}>
                                        {botOpen[i] ? <ExpandLess /> : <ExpandMore />}
                                    </Grid>
                                </Grid>
                            </Paper>
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={botOpen[i]} key={'c' + bot.id}>
                        <Paper sx={{ marginBottom: '24px', padding: '20px' }}>
                            <Button
                                variant='contained' onClick={() => toggleBotStatus(bot.id)}
                                sx={{...branchButtonStyles, background: bot.status ? '#b00' : '#0b0'}}
                            >{bot.status ? 'Выключить' : 'Включить'}</Button>
                            <Link href={`new?getById=${bot.id}`}><Button variant='contained' sx={branchButtonStyles}>Редактировать</Button></Link>
                            <Grid container spacing={2}>
                                <Grid item xs={10}>
                                    <TextField
                                        variant='outlined' label='Токен бота'
                                        sx={{ width: '100%' }} value={bot.token}
                                        onChange={e => setBotToken(e.target.value, i)}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <Button
                                        variant='contained' sx={{...branchButtonStyles, height: '100%'}}
                                        onClick={() => saveToken(bot.id, i)}
                                    >Сохранить</Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Collapse>
                </>)}
            </List>

        </>
    )
}
