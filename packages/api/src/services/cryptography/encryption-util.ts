import * as crypto from 'crypto'
import { singleton } from 'tsyringe'

@singleton()
export class EncryptionUtil {
  private algorithm: string
  private secretKey: Buffer
  private iv: Buffer

  constructor(
    // secret: string
  ) {
    const secret = `${+new Date}`
    // Convert string to a buffer
    const sensitiveBuffer = Buffer.from(secret, 'utf8')

    this.algorithm = 'aes-256-cbc' // Encryption algorithm
    this.secretKey = crypto
      .createHash('sha256')
      .update(sensitiveBuffer.toString('utf-8'))
      .digest() // Derive a 256-bit key from the secret

    this.iv = crypto.randomBytes(16) // Random initialization vector (16 bytes for AES-256-CBC)
  }

  // Encrypt and URL-encode text
  encryptAndEncode(text: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, this.iv)

    // Encrypt the text
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])

    // Combine the IV with the encrypted data
    const combined = Buffer.concat([this.iv, encrypted])

    // Base64 encode and then URL encode the combined data
    return encodeURIComponent(combined.toString('base64'))
  }

  // Decode and decrypt URL-encoded text
  decodeAndDecrypt(encoded: string): string {
    const decoded = Buffer.from(decodeURIComponent(encoded), 'base64')

    // Extract the IV (first 16 bytes) and the encrypted text
    const iv = decoded.slice(0, 16)
    const encryptedText = decoded.slice(16)

    const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, iv)

    // Decrypt the text
    const decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ])

    return decrypted.toString('utf8')
  }
  
}

// // Example usage
// const secret = 'your-secret-key';
// const encryptionUtil = new EncryptionUtil(secret);

// const plainText = 'Hello, World!';
// console.log('Original Text:', plainText);

// // Encrypt and URL encode
// const encryptedEncodedText = encryptionUtil.encryptAndEncode(plainText);
// console.log('Encrypted and URL-Encoded Text:', encryptedEncodedText);

// // Decode and decrypt
// const decryptedText = encryptionUtil.decodeAndDecrypt(encryptedEncodedText);
// console.log('Decrypted Text:', decryptedText);
