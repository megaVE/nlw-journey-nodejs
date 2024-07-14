import type { FastifyInstance } from "fastify"
import { ClientError } from "./errors/ClientError"
import { ZodError } from "zod"

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, req, res) => {
  if (error instanceof ZodError) {
    return res.status(400).send({
      message: "Invalid input",
      errors: error.flatten().fieldErrors
    })
  }

  if (error instanceof ClientError) {
    return res.status(400).send({
      message: error.message
    })
  }
  
  return res.status(500).send({
    message: "Internal server error."
  })
}