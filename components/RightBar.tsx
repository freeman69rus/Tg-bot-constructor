import {Card, Collapse, List, ListItem, ListItemButton, Paper} from "@mui/material"
import {ExpandLess, ExpandMore} from "@mui/icons-material"
import React from "react"
import {BotSchema, Keyboard} from "../types"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"

const paperStyles = {
    width: '390px',
    height: '100vh',
    position: 'fixed',
    top: 0,
    right: 0,
    borderRadius: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflowY: 'auto'
}
const dots = {
    overflow: 'hidden',
    textOverflow: 'ellipsis'
}

const capsule = {
    padding: '10px',
    borderRadius: '25px',
    display: 'block',
    border: 'none',
    fontSize: '.8em'
}

const branchNameStyles = {
    flex: '1 1 auto',
    paddingLeft: '0px',
    fontSize: '1.6em',
    color: '#ABABAB',
    fontWeight: 700,
    ...dots
}

const buttonsWrapperStyles = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
}

const buttonStyles = {
    ...dots,
    ...capsule,
    color: 'white',
    background: '#19a0d8',
    marginRight: '10px',
    marginBottom: '10px',
    paddingLeft: '20px',
    paddingRight: '20px',
    cursor: 'pointer'
}

const messageHeader = {
    background: '#19A0D8',
    padding: '10px 20px',
    maxHeight: '40px',
    color: 'white',
    width: '100%',
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0
}

const messageNameStyle = {
    width: '100%',
    maxHeight: '40px',
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    ...dots
}

const branchButtonStyles = {
    background: '#ABABAB',
    width: '100%',
    marginBottom: '10px'
}

type BranchPositionType = [number | null, number | null][]

interface IProps {
    branch: BotSchema.IBranch
    changeBranch: (position: BranchPositionType) => void
}

export default function RightBar({ branch, changeBranch }: IProps) {
    const [branchClose, setbranchClose] = React.useState<{ [name: string]: boolean }>({})
    const [keyboardsClose, setKeyboardsClose] = React.useState<{ [name: string]: boolean }>({})

    const toggleBranch = (name: string) => {
        branchClose[name] = !branchClose[name]
        setbranchClose({...branchClose})
    }

    const toggleKeyboards = (name: string) => {
        keyboardsClose[name] = !keyboardsClose[name]
        setKeyboardsClose({...keyboardsClose})
    }

    const getKeyboardsByResponses = (response: BotSchema.IResponse, branchInput: string, i?: number): React.ReactNode[] => {
        i = i || 0
        let keyboardType = Keyboard.NONE
        if (response.buttons) keyboardType = Keyboard.MENU
        if (response.inlineButtons) keyboardType = Keyboard.BUTTONS

        const keyboard = response.buttons || response.inlineButtons
        let keyboardInputs = keyboard?.map(branch => branch.input)
        if ( keyboardType === Keyboard.NONE || ( keyboardInputs && !keyboardInputs[0].length ) ) {
            return response.next ? getKeyboardsByResponses(response.next, branchInput) : []
        }

        const result: React.ReactNode[] = [
            <Card sx={{ width: '96%', margin: '0 auto 20px auto' }}>
                <Button sx={messageHeader} variant="contained" onClick={() => toggleKeyboards(branchInput+i)}>
                    <Grid container>
                        <Grid item xs={11}>
                            <span style={messageNameStyle}>{response.name}</span>
                        </Grid>
                        <Grid item xs={1} sx={{display: 'flex'}}>
                            {!keyboardsClose[branchInput+i] ? <ExpandLess /> : <ExpandMore />}
                        </Grid>
                    </Grid>
                </Button>
                <Collapse in={!keyboardsClose[branchInput+i]} sx={{ padding: !keyboardsClose[branchInput+i] ? '10px' : 0, width: '100%' }}>
                    {/*@ts-ignore*/}
                    <div style={buttonsWrapperStyles}>
                        {
                            keyboardInputs?.map((button, i) => <button
                                style={{ ...buttonStyles, background: keyboardType === Keyboard.MENU ? '#AD71C9' : '#F5A860' }}
                            >{button}</button>)
                        }
                    </div>
                </Collapse>

            </Card>
        ]
        if (response.next) result.push(...getKeyboardsByResponses(response.next, branchInput, i+1))

        return result
    }

    const getAllButtonsFromResponse = (response: BotSchema.IResponse, i?: number): any => {
        i = i || 0
        const result = []
        const keyboard = response.inlineButtons || response.buttons || null
        result.push(keyboard)

        if (response.next) result.push(...getAllButtonsFromResponse(response.next, i+1))
        return result
    }


    const getNestedBranches = (response: BotSchema.IResponse, position: BranchPositionType) => {
        return getAllButtonsFromResponse(response)
            .map((buttons: any, resIndx: number) => {
                if (!buttons) return ''
                return buttons.map((inlineBranch: any, btnIndx: number) => {
                    if (!inlineBranch.input.length) return ''
                    const currentPos: BranchPositionType = [...position, [resIndx, btnIndx]]
                    return renderBranch(inlineBranch, currentPos)
                })
            })
    }

    const renderBranch = (branch: BotSchema.IBranch, position: BranchPositionType) => {
        const keyboards = getKeyboardsByResponses(branch.response, branch.input)
        return <>
            <ListItem sx={{paddingRight: 0, paddingLeft: 0}}>
                <ListItemButton onClick={() => toggleBranch(branch.input)}>
                    <span style={branchNameStyles}>{branch.input}</span>
                    {!branchClose[branch.input] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
            </ListItem>
            <Collapse in={!branchClose[branch.input]} sx={{ padding: '0px 10px' }}>
                <Button variant='contained' sx={branchButtonStyles} onClick={() => changeBranch(position)}>Перейти</Button>
                {keyboards}
            </Collapse>
            {getNestedBranches(branch.response, position)}
        </>
    }

    return (
        <Paper sx={paperStyles}>
            <h2 style={{ fontWeight: 500, width: '92%' }}>Меню / Кнопки</h2>
            <List sx={{ width: '100%' }}> { renderBranch(branch, [[null, null]]) } </List>
        </Paper>
    )
}
