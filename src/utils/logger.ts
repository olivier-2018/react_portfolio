import { createLogger, format, transports } from "winston"

const logger = createLogger({
   level: "debug",
   format: format.combine(
      format.timestamp({ format: "YY-MM-DD HH:mm" }),
      format.errors({ stack: true }),
      format.splat()
      //   format.json()
   ),
   transports: [
      new transports.Console({
         format: format.combine(format.colorize(), format.simple()),
      }),
      new transports.File({ filename: "logs/error.log", level: "error" }),
      new transports.File({ filename: "logs/combined.log" }),
   ],
   exitOnError: false,
})

export default logger
