import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { dayjs } from "../lib/dayjs"
import { ClientError } from "../errors/ClientError"

export async function createActivity(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/activities', {
    schema: {
      params: z.object({
        tripId: z.string().uuid()
      }),
      body: z.object({
        title: z.string().min(4),
        occurs_at: z.coerce.date(),
      })
    },
  }, async (req) => {
    const { title, occurs_at } = req.body
    const { tripId } = req.params

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId
      }
    })

    if(!trip) {
      throw new ClientError("Trip not found.")
    }

    if(dayjs(occurs_at).isBefore(trip.starts_at) ||
      dayjs(occurs_at).isAfter(trip.ends_at)
    ) {
      throw new ClientError("Invalid activity date.")
    }

    const activity = await prisma.activity.create({
      data: {
        title,
        occurs_at,
        trip_id: tripId
      }
    })

    return {
      activityId: activity.id
    }
  })
}