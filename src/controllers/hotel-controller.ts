import hotelService from "@/services/hotel-service";
import { Request, Response } from "express";

export async function getAllHotels(_req: Request, res: Response) {
  try {
    const allHotels = await hotelService.getHotels();
    res.status(200).send(allHotels);
  } catch (error) {
    return res.status(401).send(error);
  }
}
