import type { NextApiRequest, NextApiResponse } from 'next'
import reqMethodLimitMiddleware from "../../../utils/reqMethodLimitMiddleware"
import db from '../../../database'

export default reqMethodLimitMiddleware('GET', async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const result = await db.allAsync('SELECT * FROM bots')
        res.status(200).json(result || [])
    } catch (e) {
        res.status(500).json(e)
    }
})
