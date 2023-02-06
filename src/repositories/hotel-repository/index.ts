import { prisma } from "@/config";
import { Hotel, Room } from "@prisma/client";

function findAllHotels(): Promise<(Hotel & { Rooms: Room[] })[]> {
  return prisma.hotel.findMany({
    include: {
      Rooms: true,
    },
  });
}

async function findPaidTicket(userId: number) {
  return prisma.ticket.findFirst({
    where: {
      Enrollment: {
        userId,
      },
    },
    include: {
      Enrollment: true,
      TicketType: true,
    },
  });
}

async function findHotel(hotelId: number) {
  return prisma.hotel.findUnique({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

const hotelRepository = {
  findAllHotels,
  findPaidTicket,
  findHotel,
};

export default hotelRepository;
