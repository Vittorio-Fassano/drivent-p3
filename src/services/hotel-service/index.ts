import hotelRepository from "@/repositories/hotel-repository";

async function getHotels() {
  return await hotelRepository.findHotels();
}

const hotelService = {
  getHotels,
};

export default hotelService;
