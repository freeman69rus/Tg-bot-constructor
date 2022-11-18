import type { NextApiRequest, NextApiResponse } from 'next'
import reqMethodLimitMiddleware from "../../../utils/reqMethodLimitMiddleware"
import db from '../../../database'

export default reqMethodLimitMiddleware('POST', async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query
    const { name, branch, status, token } = req.body
    const fields = []
    if (name) fields.push(`name = '${name}'`)
    if (branch) fields.push(`branch = '${JSON.stringify(branch)}'`)
    if (status) fields.push(`branch = '${status}'`)
    if (token) fields.push(`token = '${token}'`)
    try {
        if (fields.length) await db.runAsync('UPDATE bots SET ' + fields + ' WHERE id = ?', id)
        res.status(200).json(true)
    } catch (e) {
        res.status(500).json(e)
    }
})
