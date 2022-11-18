import pm2, { list } from "pm2"
import path from "path"
import { IBotRow } from '../types'

type PM2StartResult = { pm2_env: pm2.Proc }[]

class ProcessController {
    private static instance: ProcessController
    scriptPath: string

    private constructor() {
        this.scriptPath = path.join(process.cwd(), '/bot', '/dist', '/bot/index.js')
        pm2.connect((err) => {
            if (err) console.error(err)
        })
    }

    makeProcessName(bot: IBotRow) {
        return `${bot.id}_${bot.name}`.replace(' ', '')
    }

    async startProcess(bot: IBotRow) {
        try {
            const name = this.makeProcessName(bot)
            const proc = await this.start({ script: this.scriptPath, name, force: true })
            await this.sendToProcess(proc[0].pm2_env.pm_id as number, bot)
        } catch (e) {
            return e
        }
    }

    async stopProcess(bot: IBotRow): Promise<void> {
        return new Promise((resolve, reject) => {
            pm2.delete(this.makeProcessName(bot), (err, proc) => {
                if (err) reject(err)
                resolve()
            })
        })
    }

    findByProcName(procName: string): Promise<pm2.ProcessDescription> {
        return new Promise((resolve, reject) => {
            pm2.list((err, list) => {
                if (err) reject(err)
                for (let proc of list) {
                    if (proc.name === procName) resolve(proc)
                }
            })
        })
    }

    static getInstance() {
        if (!ProcessController.instance) {
            ProcessController.instance = new ProcessController()
        }
        return ProcessController.instance
    }

    private start(options: pm2.StartOptions): Promise<PM2StartResult> {
        return new Promise((resolve, reject) => {
            pm2.start(options, (err, proc) => {
                if (err) reject(err)
                resolve(proc as PM2StartResult)
            })
        })
    }

    private sendToProcess(pm_id: number, data: any): Promise<void> {
        return new Promise((resolve, reject) => {
            pm2.sendDataToProcessId(pm_id, {
                type: 'process:msg',
                data: data,
                topic: true
            }, (err) => {
                if (err) reject(err)
                resolve()
            })
        })
    }
}

export default ProcessController.getInstance()
