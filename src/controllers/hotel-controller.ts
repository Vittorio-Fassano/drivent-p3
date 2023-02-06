import hotelService from "@/services/hotel-service";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";

export async function getAllHotels(req: AuthenticatedRequest, res: Response): Promise<Response> {
  const { userId } = req;
  try {
    const hotels = await hotelService.getHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "PaymentRequiredError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const {
    userId,
    params: { hotelId },
  } = req;

  try {
    const hotels = await hotelService.getHotelById(+hotelId, userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === "PaymentRequiredError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
