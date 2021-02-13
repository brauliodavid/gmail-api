import * as express from 'express'
import * as gmail from '../functions/gmail-api'

const router = express.Router()

/**
 * Route for getting gmail messages
 */
router.get('/getMessages', async (req: express.Request, res: express.Response) => {
	try{
        const params = req.query
        const messages = await gmail.getMessages(params)

        return res.send({messages})
    }catch(e){
        console.error(e)
        return res.send({error: e})
	}
})

/**
 * Route for getting a specific gmail message
 */
router.get('/getMessage', async (req: express.Request, res: express.Response) => {
	try{
        const messageId = req.query.messageId

        const message = await gmail.getMessage({messageId})

        return res.send({message})
    }catch(e){
        return res.send({error: e})
	}
})

/**
 * Route for getting a specific attachemnt from a message
 */
router.get('/getAttachment', async (req: express.Request, res: express.Response) => {
	try{
        const attachmentId = req.query.attachmentId
        const messageId = req.query.messageId

        const attachment = await gmail.getAttachment({attachmentId, messageId})

        return res.send({attachment})
    }catch(e){
        return res.send({error: e})
	}
})

/**
 * Route for getting gmail messages from a thread
 */
router.get('/getThread', async (req: express.Request, res: express.Response) => {
	try{
        const messageId = req.query.messageId

        const messages = await gmail.getThread({messageId})

        return res.send({messages})
    }catch(e){
        return res.send({error: e})
	}
})

/**
 * Route for send a mail message
 */
router.post('/sendMessage', async (req: express.Request, res: express.Response) => {
	try{
        const {to, subject, text, attachments} = req.body

        if(!to){
            throw 'Recipient email(s) is required'
        }

        await gmail.sendMessage({to, subject, text, attachments})

        return res.send({message: 'Message sent!'})
    }catch(e){
        return res.send({error: e})
	}
})

export = router