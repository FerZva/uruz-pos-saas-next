import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";

export function GET(
  request: NextRequest,
  { params }: { params: { kindeAuth: string } }
) {
  const endpoint = params.kindeAuth;

  if (endpoint === "logout") {
    const response = handleAuth(request, params);
    response.headers.set("Access-Control-Allow-Headers", "rsc");
    return response;
  } else {
    return handleAuth(request, params);
  }
}
