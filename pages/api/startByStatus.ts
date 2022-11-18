import type { NextApiRequest, NextApiResponse } from 'next'
import reqMethodLimitMiddleware from "../../utils/reqMethodLimitMiddleware"
import db from '../../database'
import ProcessController from "../../utils/ProcessController"

export default reqMethodLimitMiddleware('POST', async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const rows = await db.allAsync('SELECT * FROM bots WHERE status = TRUE')
    if (rows.length) {
      for (let row of rows) {
        row.branch = JSON.parse(row.branch)
        await ProcessController.startProcess(row)
      }
    }

    res.status(200).json(true)
  } catch (e) {
    res.status(500).json(e)
  }
})
