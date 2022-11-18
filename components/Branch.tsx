import {BotSchema, Keyboard} from "../types"
import React from "react"
import Message from "./Message"

interface IProps {
    branch: BotSchema.IBranch
    onChange: (branch: BotSchema.IBranch) => void
}


export default function Branch({ branch, onChange }: IProps) {

    const editNestedByIndex = (index: number, newResponse: BotSchema.IResponse, res?: BotSchema.IResponse): BotSchema.IResponse => {
        res = res || branch.response
        if (index === 0) return { ...newResponse, ...res.next ? { next: res.next } : {} } as BotSchema.IResponse
        else return { ...res, next: editNestedByIndex(index-1, newResponse, res.next) }
    }

    const addResponseByIndex = (index: number, newResponse: BotSchema.IResponse, res?: BotSchema.IResponse): BotSchema.IResponse => {
        res = res || branch.response
        if (index === 0) return {
            ...res,
            next: { ...newResponse, ...res.next ? {next: res.next} : {} }
        } as BotSchema.IResponse
        else return { ...res, next: addResponseByIndex(index-1, newResponse, res.next) }
    }

    const deleteResponseByIndex = (index: number, res?: BotSchema.IResponse): BotSchema.IResponse => {
        res = res || branch.response
        if (!index) return branch.response
        if (index === 1) {
            const responseCopy = {...res}
            delete responseCopy.next
            return {...responseCopy, ...res.next?.next ? {next: res.next.next} : {}} as BotSchema.IResponse
        } else return { ...res, next: deleteResponseByIndex(index-1, res.next) }
    }

    const onMessageChange = (messageName: string, messageText: string, keyboard: string[], keyboardType: Keyboard, nestedIndex: number) => {
        let responseKeyboard = {}
        if (keyboardType !== Keyboard.NONE) {
            const propName = keyboardType === Keyboard.MENU ? 'buttons' : 'inlineButtons'
            const oldKeyboard = branch.response[propName]
            const keyboardBranch = keyboard.map((input, i) => ({
                input,
                ...oldKeyboard && oldKeyboard[i]
                    ? { response: oldKeyboard[i].response }
                    : { response: {
                            name: 'Новое сообщение 1',
                            message: ''
                        }
                    },
            }))
            responseKeyboard = { [propName]: keyboardBranch }
        }

        const newBranch = {
            input: branch.input,
            response: editNestedByIndex(nestedIndex, {
                name: messageName,
                message: messageText,
                ...keyboard.length ? responseKeyboard : {}
            })
        }
        onChange(newBranch)
    }

    const getKeyboardFromResponse = (response: BotSchema.IResponse): [Keyboard, string[]] => {
        let keyboardType = Keyboard.NONE
        if (response.buttons) keyboardType = Keyboard.MENU
        if (response.inlineButtons) keyboardType = Keyboard.BUTTONS

        if (keyboardType === Keyboard.NONE) return [keyboardType, ['']]
        const keyboard = response.buttons || response.inlineButtons
        let keyboardInputs = keyboard?.map(branch => branch.input)

        return [keyboardType, keyboardInputs || ['']]
    }

    const newMessage = (index: number) => {

        const newBranch = {
            input: branch.input,
            response: addResponseByIndex(index, {
                name: 'Новое сообщение ' + (index+2),
                message: ''
            })
        }

        onChange(newBranch)
    }

    const deleteMessage = (index: number) => {
        const newBranch = {
            input: branch.input,
            response: deleteResponseByIndex(index)
        }

        onChange(newBranch)
    }

    const getMessages = (res: BotSchema.IResponse, i?: number): Array<React.ReactNode> => {
        i = i || 0
        const keyboards = getKeyboardFromResponse(res)
        const response: Array<React.ReactNode> = [
            <Message
                onNewMessage={() => newMessage(i as number)} text={res.message} key={i}
                onDelete={ i ? () => deleteMessage(i as number) : undefined } arrow={!!i}
                onChange={(...args) => onMessageChange(...args, i as number)}
                name={res.name} keyboardType={keyboards[0]} keyboardInputs={keyboards[1]}
            />
        ]
        if (res.next) response.push(...getMessages(res.next, i+1))
        return response
    }

    return <>
        <h1 style={{ color: '#ABABAB' }}>{branch.input}</h1>
        {getMessages(branch.response)}
    </>
}
