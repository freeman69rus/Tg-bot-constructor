export namespace BotSchema {
    export interface IBaseResponse {
        name: string
        message: string
        next?: IResponse
    }

    export interface IResWithInlineButtons extends IBaseResponse {
        inlineButtons: IBranch[]
        buttons?: never
    }

    export interface IResWithButtons extends IBaseResponse {
        buttons?: IBranch[]
        inlineButtons?: never
    }

    export type IResponse = IResWithInlineButtons | IResWithButtons

    export interface IBranch {
        input: string
        response: IResponse
    }

}

export enum Keyboard {
    NONE,
    MENU,
    BUTTONS
}

export interface IPM2Packet {
    token: string
    branch: BotSchema.IBranch
}

export interface IBotRow {
    id: number
    name: string
    branch: BotSchema.IBranch
    status: boolean
    token: string
}
