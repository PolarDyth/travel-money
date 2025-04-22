"use server"

import { Client } from "@googlemaps/google-maps-services-js";
import { NextRequest } from "next/server";

const client = new Client();

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const placeId = searchParams.get("placeId");

  if (!placeId) {
    return new Response(
      JSON.stringify({
        error: "No placeId provided",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  if (typeof placeId !== "string") {
    return new Response(
      JSON.stringify({
        error: "Invalid placeId",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        key: process.env.GOOGLE_MAPS_API_KEY!,
        fields: ["address_components", "formatted_address", "geometry"]
      }
    })

    const result = response.data.result;

    if (response.data.status === "OK") {
      return new Response(
        JSON.stringify({
          details: {
            address_components: result.address_components,
            formatted_address: result.formatted_address,
            geometry: result.geometry,
          },
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=86400",
          },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          error: "Place not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: "Something went wrong",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}