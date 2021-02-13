import * as express from 'express'
import * as Cors from 'cors'
import * as authRoutes from './routes/auth-routes'
import * as apiRoutes from './routes/api-routes'
import { authMiddleware } from './middleware/auth-middleware'

const app = express()

app.use(Cors({origin: true}))

// for parsing application/json
app.use(express.json())

// for parsing application/xwww-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// gmail auth routes
app.use('/', authRoutes)

// auth middleware for api routes
app.use(authMiddleware)

// gmail api routes
app.use('/api', apiRoutes)

// start the server
const PORT = 3000
app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`)
})

module.exports = app