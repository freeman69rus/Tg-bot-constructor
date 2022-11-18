import Grid from "@mui/material/Grid"
import React from "react"
import {BotSchema} from '../types'
import Branch from "../components/Branch"
import RightBar from "../components/RightBar"
import Button from "@mui/material/Button"
import axios from "axios"
import { useRouter } from 'next/router'
import {TextField} from "@mui/material"

const botNameStyles = {
    border: 0,
    fontSize: '2em'
}

const headerStyles = {
    width: '100%',
    maxHeight: '60px',
    display: 'flex',
    justifyContent: 'space-between'
}

const initialSchema: BotSchema.IBranch = {
    input: '/start',
    response: {
        name: 'Новое сообщение 1',
        message: ''
    }
}

type branchPositionType = [number | null, number | null][]

export default function New() {
    const router = useRouter()
    const { getById } = router.query

    const [id, setId] = React.useState<number>()
    const [botName, setBotName] = React.useState('Новый бот')
    const [botToken, setBotToken] = React.useState('')
    const [branch, setBranchState] = React.useState<BotSchema.IBranch>(initialSchema)
    const [currentBranch, setCurrentBranch] = React.useState<BotSchema.IBranch>(branch)

    const [branchPosition, setBranchPosition] = React.useState<branchPositionType>([[null, null]])

    if (getById && !id) axios.get('api/get/'+getById).then(res => {
        const branch = JSON.parse(res.data.branch)
        setBotName(res.data.name)
        setBotToken(res.data.token)
        setBranchState(branch)
        setCurrentBranch(branch)
        setId(parseInt(getById as string))
    })

    const setName = (e: any) => {
        setBotName(e.target.value)
    }

    const getNestedResponseByIndex = (index: number, parentResponse: BotSchema.IResponse): BotSchema.IResponse => {
        if (index === 0) return parentResponse
        else if (parentResponse.next) return getNestedResponseByIndex(index-1, parentResponse.next)
        else return parentResponse
    }

    const editCurrentBranch = (newBranch: BotSchema.IBranch) => {
        const branchByIndexes = getBranchByIndexes()
        branchByIndexes.response = newBranch.response
        setCurrentBranch(newBranch)
        setBranchState({...branch})
    }

    const getBranchByIndexes = (position?: branchPositionType): BotSchema.IBranch => {
        position = position || branchPosition
        let newBranch = branch
        for (let indexes of position) {
            const responseIndex = indexes[0]
            const buttonIndex = indexes[1]
            if (responseIndex !== null && buttonIndex !== null) {
                const response = getNestedResponseByIndex(responseIndex, newBranch.response)
                if (response.inlineButtons) newBranch = response.inlineButtons[buttonIndex]
                else if (response.buttons) newBranch = response.buttons[buttonIndex]
            }
        }

        return newBranch
    }

    const animateBody = () => {
        document.body.classList.add('anim-body')
        setTimeout(() => document.body.classList.remove('anim-body'), 600)
    }

    const changeCurrentBranch = (position: branchPositionType) => {
        setBranchPosition(position)
        setCurrentBranch(getBranchByIndexes(position))
        animateBody()
    }

    const saveBot = async () => {
        const url = id ? 'api/edit/'+id : 'api/new'
        const result = await axios.post(url, {
            token: botToken,
            name: botName,
            branch
        })
        if (!id) setId(result.data)
    }

    return (
        <Grid container spacing={0}>
            <Grid item xs={9}>
                <div style={headerStyles}>
                    <input type="text" style={botNameStyles} className='not-outline' value={botName} onChange={setName}/>
                    <Button variant='contained' sx={{ background: '#19A0D8' }} onClick={saveBot}>сохранить</Button>
                </div>
                <TextField
                    label='Токен бота' sx={{ margin: '50px 0', width: '100%' }}
                    value={botToken} onChange={e => setBotToken(e.target.value)}/>
                <Branch branch={currentBranch} onChange={editCurrentBranch} />
            </Grid>
            <Grid item xs={3}>
                <RightBar branch={branch} changeBranch={changeCurrentBranch}/>
            </Grid>
        </Grid>
    )
}
