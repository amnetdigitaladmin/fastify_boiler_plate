import { FastifyRequest, FastifyReply } from 'fastify'
import { IncomingMessage, ServerResponse } from 'http'

export function createPassportAdapter() {
  return (request: FastifyRequest, reply: FastifyReply) => {
    const res = reply.raw as ServerResponse
    const req = request.raw as IncomingMessage

    // Add Express-like methods to response
    res.setHeader = function(name: string, value: string | string[]) {
        if(!reply.header(name,value)) {
            reply.header(name, value)
        }
      return this
        
    }

    res.end = function(chunk: any) {
      reply.send(chunk)
      return this
    }

    // Add redirect method
    // res.redirect = function(url: string) {
    //   reply.redirect(url)
    //   return this
    // }

    return { req, res }
  }
}

