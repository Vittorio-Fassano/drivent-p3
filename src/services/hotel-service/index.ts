import { notFoundError } from "@/errors";
import { paymentError } from "@/errors/payment-error";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Hotel, Room, TicketStatus } from "@prisma/client";

async function getHotels(userId: number) {
  await verifyEnrollmentAndPayment(userId);
  const hotels = await hotelRepository.findHotels();
  if (!hotels.length) throw notFoundError();
  return hotels;
}

async function verifyEnrollmentAndPayment(userId: number): Promise<void> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const existingPaidTicket = await hotelRepository.findPaidTicket(userId);
  if (!existingPaidTicket) throw notFoundError();

  const notPaid = existingPaidTicket.status !== "PAID";
  const isRemote = existingPaidTicket.TicketType.isRemote;
  const notIncludesHotel = !existingPaidTicket.TicketType.includesHotel;
  if (notPaid || isRemote || notIncludesHotel) throw paymentError();
}

async function getHotel(hotelId: number, userId: number) {
  await verifyEnrollmentAndPayment(userId);

  const hotel = await hotelRepository.findOneHotel(hotelId);
  if (!hotel) throw notFoundError();

  return hotel;
}

const hotelService = {
  getHotels,
  getHotel,
};

export default hotelService;
