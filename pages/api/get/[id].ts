import type { NextApiRequest, NextApiResponse } from 'next'
import reqMethodLimitMiddleware from "../../../utils/reqMethodLimitMiddleware"
import db from '../../../database'

export default reqMethodLimitMiddleware('GET', async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query
    try {
        const result = await db.getAsync('SELECT * FROM bots WHERE id = ?', id)
        res.status(200).json(result || false)
    } catch (e) {
        res.status(500).json(e)
    }
})
