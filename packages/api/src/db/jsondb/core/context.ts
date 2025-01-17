import { Low } from 'lowdb/lib/core/Low'
import { singleton } from 'tsyringe'
import { LoginDBSchema } from '../schema/logins.db.schema'
import { AppDbConfig } from './config'


@singleton()
export class AppDbContext {
    isInitialized = false
    public loginsDB!: Low<LoginDBSchema>

    constructor(
        private config: AppDbConfig
    ) { }

    async init() {
        this.loginsDB = await LoginDBSchema.create(this.config.path)
        this.isInitialized = true
    }
}