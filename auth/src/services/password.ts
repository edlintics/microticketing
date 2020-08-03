import { scrypt, randomBytes } from "crypto"; // scrypt is a hashing function, however, it is a callback base
import { promisify } from "util";

const scryptAsync = promisify(scrypt); // since we will use async await, we should turn the call back into a promise so we can write in sync model

// Hasshing service
export class Password {
  //static allows toc all function without having to create an instance of a class
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex"); // generate salt
    const buf = (await scryptAsync(password, salt, 64)) as Buffer; // this is a buffer

    return `${buf.toString("hex")}.${salt}`; // join hash password with salt (Concat with .)
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split(".");

    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer; // this is a buffer

    return buf.toString("hex") === hashedPassword;
  }
}
