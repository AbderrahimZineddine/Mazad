
import * as bcrypt from 'bcrypt';


export class CryptHelper {
    static async hash(data: string) {
        return await bcrypt.hash(data, 10);
    }
    static async compare(data: string, encrypted: string) {
        return await bcrypt.compare(data, encrypted);
    }
}