import * as auth from '../functions/gmail-auth'

export const authMiddleware = async (req, res, next) => {
    try{
        const authenticated = await auth.authorize()
        if(!authenticated){
            throw 'No Authenticated'
        }
        next()
    }catch(e){
        res.status(401)
        res.send({error: e})
    }
}