import type { NextApiRequest, NextApiResponse } from 'next'
import reqMethodLimitMiddleware from "../../utils/reqMethodLimitMiddleware"
import db from '../../database'

export default reqMethodLimitMiddleware('POST', async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, branch, token } = req.body
  try {
    const id = await db.runAsync('INSERT INTO bots VALUES (NULL, ?, ?, FALSE, ?)', [name, JSON.stringify(branch), token])
    res.status(200).json(id)
  } catch (e) {
    res.status(500).json(e)
  }
})
