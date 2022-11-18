import type { NextApiRequest, NextApiResponse } from 'next'
import reqMethodLimitMiddleware from "../../../utils/reqMethodLimitMiddleware"
import db from '../../../database'
import ProcessController from "../../../utils/ProcessController"

export default reqMethodLimitMiddleware('POST', async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query
    try {
        const row = await db.getAsync('SELECT * from bots WHERE id = ?', id)
        if (!row) res.status(200).json(false)

        row.branch = JSON.parse(row.branch)

        const fnName = row.status ? 'stopProcess' : 'startProcess'
        await ProcessController[fnName](row)

        await db.runAsync('UPDATE bots SET status = ? WHERE id = ?', [row.status ? 0 : 1, id])

        res.status(200).json(true)
    } catch (e) {
        res.status(500).json(e)
    }
})
