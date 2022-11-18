import type { NextApiRequest, NextApiResponse } from 'next'

export type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type CallbackType = (req: NextApiRequest, res: NextApiResponse) => any | void
export type MethodNotAllowed = { message: 'Method Not Allowed' }

export default function (method: Methods, callback: CallbackType) {
    return async function (req: NextApiRequest, res: NextApiResponse) {
        if (req.method !== method) {
            res.setHeader('Allow', [method])
            res.status(405).send({ message: 'Method Not Allowed' })
            return
        }
        return await callback(req, res)
    }
}
