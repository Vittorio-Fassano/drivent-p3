import { notFoundError } from "@/errors";
import { paymentError } from "@/errors/payment-error";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";

async function getHotels(userId: number) {
  await verifyEnrollmentAndPayment(userId);
  const hotels = await hotelRepository.findAllHotels();
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

async function getHotelById(hotelId: number, userId: number) {
  await verifyEnrollmentAndPayment(userId);
  const hotel = await hotelRepository.findHotel(hotelId);
  if (!hotel) throw notFoundError();
  return hotel;
}

const hotelService = {
  getHotels,
  getHotelById,
};

export default hotelService;
