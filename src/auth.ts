import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { options } from "./app/(dashboard)/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth"

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, options)
}