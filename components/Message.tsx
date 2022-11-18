import React from "react"
import {Card, List, ListItem, TextField} from "@mui/material"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import SouthIcon from '@mui/icons-material/South'
import {Keyboard} from '../types'

const messageCard = {
    borderRadius: '15px'
}

const messageHeader = {
    background: '#19A0D8',
    padding: '10px 20px'
}

const messageContent = {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column'
}

const keyboardStyles = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
}

const liStyles = {
    paddingRight: 0,
    paddingLeft: 0,
    paddingBottom: 0
}

const actionsButtons = {
    width: '26px',
    minWidth: '26px',
    marginLeft: '8px'
}

const flexRight = {
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'end'
}

const arrowWrapper = {
    color: '#19A0D8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60px'
}

interface IProps {
    onChange: (messageName: string, messageText: string, keyboard: string[], type: Keyboard) => void
    onNewMessage: () => void
    onDelete?: () => void
    keyboardType: Keyboard
    keyboardInputs: string[]
    name: string
    text: string
    arrow: boolean
}

export default function Message({ onChange, onNewMessage, onDelete, keyboardType, keyboardInputs, name, text, arrow }: IProps) {
    const setName = (e: any) => {
        onChange(e.target.value, text, keyboardInputs, keyboardType)
    }

    const setText = (e: any) => {
        onChange(name, e.target.value, keyboardInputs, keyboardType)
    }

    const setKeyboard = (k: string[], t: Keyboard) => {
        onChange(name, text, k, t)
    }

    const setKeyboardType = (t: Keyboard) => {
        onChange(name, text, keyboardInputs, t)
    }

    const setKeyboardTypeInputs = (ki: string[]) => {
        onChange(name, text, ki, keyboardType)
    }

    const keyboardAction = (index: number, action: boolean) => {
        if (!action) {
            if (keyboardInputs.length <= 1) {
                return setKeyboard([''], Keyboard.NONE)
            }
            keyboardInputs.splice(index, 1)
        } else keyboardInputs.splice(++index, 0, '')
        return setKeyboardTypeInputs([...keyboardInputs])
    }

    const handleKeyboardChange = (e: any, index: number) => {
        keyboardInputs[index] = e.target.value
        return setKeyboardTypeInputs([...keyboardInputs])
    }

    const getKeyboardChoice = () => <>
        <Grid item xs={1}>
            <Button
                variant="contained"
                onClick={() => setKeyboardType(Keyboard.MENU)}
                sx={{ background: '#AD71C9' }}
            >+ меню</Button>
        </Grid>
        <Grid item xs={7}>
            <Button
                variant="contained"
                onClick={() => setKeyboardType(Keyboard.BUTTONS)}
                sx={{ background: '#F5A860' }}
            >+ кнопки сообщения</Button>
        </Grid>
    </>

    return (<>
            { arrow ? <div style={arrowWrapper}><SouthIcon/></div> : '' }
            <Card sx={messageCard}>
                <div style={messageHeader}>
                    <input
                        type="text"
                        style={{ border: 0, background: 'none', color: 'white', width: '100%' }}
                        className='not-outline' value={name} onChange={setName}/>
                </div>
                {/*@ts-ignore*/}
                <div style={messageContent}>
                    <TextField
                        multiline placeholder='Текст сообщения'
                        value={text} onChange={setText}/>
                    <Grid container sx={{ marginTop: '20px' }}>
                        {
                            keyboardType === Keyboard.NONE ? getKeyboardChoice() : <>
                                <Grid item xs={8}>
                                    <List>
                                        {
                                            keyboardInputs.map((el, i) => <>
                                                <ListItem sx={liStyles}>
                                                    {/*@ts-ignore*/}
                                                    <div style={keyboardStyles}>
                                                        <TextField
                                                            placeholder='Текст кнопки' value={el}
                                                            onChange={(e) => handleKeyboardChange(e, i)}/>
                                                        <Button sx={actionsButtons} onClick={() => keyboardAction(i, true)}>
                                                            <AddIcon sx={{color: '#19A0D8'}}/>
                                                        </Button>
                                                        <Button sx={actionsButtons} onClick={() => keyboardAction(i, false)}>
                                                            <CloseIcon sx={{color: 'red'}}/>
                                                        </Button>
                                                    </div>
                                                </ListItem>
                                            </>)
                                        }
                                    </List>
                                </Grid>
                            </>
                        }
                        <Grid item xs={1.9} sx={flexRight}>
                            {
                                onDelete ? <Button variant="contained" color='error' onClick={onDelete}>удалить</Button> : ''
                            }
                        </Grid>
                        <Grid item xs={2.1} sx={flexRight}>
                            <Button
                                variant="contained"
                                sx={{ maxHeight: 40, background: '#19A0D8' }}
                                onClick={onNewMessage}>добавить сообщение</Button>
                        </Grid>
                    </Grid>
                </div>
            </Card>
    </>
    )
}
