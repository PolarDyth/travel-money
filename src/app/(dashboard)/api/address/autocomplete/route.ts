"use server";

import {
  Client,
  PlaceAutocompleteType,
} from "@googlemaps/google-maps-services-js";
import { NextRequest } from "next/server";

const client = new Client();

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const input = searchParams.get("input");

  if (!input) {
    return new Response(
      JSON.stringify({
        error: "No input provided",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  if (typeof input !== "string" || input.length < 3) {
    return new Response(
      JSON.stringify({
        error: "Input too short",
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
    const response = await client.placeAutocomplete({
      params: {
        input,
        key: process.env.GOOGLE_MAPS_API_KEY!,
        types: PlaceAutocompleteType.address,
        components: ["country:gb"],
      },
    });

    const suggestions = response.data.predictions.map((prediction) => ({
      description: prediction.description,
      place_id: prediction.place_id,
    }));

    if (response.data.status === "OK") {
      return new Response(
        JSON.stringify({
          predictions: suggestions,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          error: response.data.error_message || response.data.status,
        }),
        {
          status: 500,
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
        error: "Internal server error",
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
