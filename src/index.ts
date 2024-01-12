import express from 'express'
import config from './utils/config'

export default class ExpressApplication {
    private static app: express.Application = express()

    static startApp () {
        this.app.listen(config.PORT, () => {
            console.log(process.env.PORT)
            console.log(`Server has started on port ${config.PORT}`)
        })
    }

}
