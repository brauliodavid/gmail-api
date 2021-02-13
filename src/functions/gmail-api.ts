import { google } from 'googleapis'
import * as parseMessage from 'gmail-api-parse-message'
import MailComposer = require('nodemailer/lib/mail-composer')
const gmail = google.gmail('v1')

/**
 * Get messages from gmail api
 * @return {array} the array of messages
 */
export const getMessages = async (params) => {
    const response = await gmail.users.messages.list({userId: 'me', ...params})
    const messages = await Promise.all(response.data.messages.map(async message => {
        const messageResponse = await getMessage({messageId: message.id})
        return parseMessage(messageResponse)
    }))

    return messages
}

/**
 * Get specific message data for a given message id
 * @param  {string} messageId The message id to retrieve for
 * @return {object} the object message
 */
export const getMessage = async ({messageId}) => {
    const response = await gmail.users.messages.get({id: messageId, userId: 'me'})
    const message = parseMessage(response.data)
    return message
}

/**
 * Given the attachment id, get specific attachment data
 * @param  {string} attachmentId The attachment id to retrieve for
 * @param  {string} messageId The message id where the attachment is
 * @return {object} the object attachment data
 */
export const getAttachment = async ({attachmentId, messageId}) => {
    const response = await gmail.users.messages.attachments.get({
        id: attachmentId, messageId, userId: 'me'
    })
    const attachment = response.data
    return attachment
}

/**
 * Get all messages thread for a given message id
 * @param  {string} messageId The message id to retrieve its thread
 * @return {array} the array of messages
 */
export const getThread = async ({messageId}) => {
    const response = await gmail.users.threads.get({id: messageId, userId: 'me'})
    const messages = await Promise.all(response.data.messages.map(async (message: any) => {
        const messageResponse = await gmail.users.messages.get({id: message.id, userId: 'me'})
        return parseMessage(messageResponse.data)
    }))
    return messages
}

/**
 * Send a mail message with given arguments
 * @param  {string} to The receiver email
 * @param  {string} subject The subject of the mail
 * @param  {string} text The text content of the message
 * @param  {Array}  attachments An array of attachments
 */
export const sendMessage = async ({to, subject = '', text = '', attachments = []}: {to: string, subject?: string, text?: string, attachments?: any[]}) => {

    // build and encode the mail
    const buildMessage = () => new Promise<string>((resolve, reject) => {
        const message  = new MailComposer({
            to,
            subject,
            text,
            attachments,
            textEncoding: 'base64'
        })

        message.compile().build((err, msg) => {
            if (err){
                reject(err)
            } 
        
            const encodedMessage = Buffer.from(msg)
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '')

            resolve(encodedMessage)
        })
    })

    const encodedMessage = await buildMessage()

    await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: encodedMessage
        }
    })
}