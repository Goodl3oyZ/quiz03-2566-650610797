import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  let rooms = DB.rooms;
  let total = 0;
  for (const i of rooms) {
    total = total + 1;
  }
  return NextResponse.json({
    ok: true,
    rooms: rooms,
    totalRooms: total,
  });
};

export const POST = async (request) => {
  const body = await request.json();
  const { roomname } = body;
  const payload = checkToken();
  console.log(body);
  let role = null;
  try {
    role = payload.role;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
  if (role === "ADMIN" && role === "SUPER_ADMIN") {
    return NextResponse.json({
      roomname: roomname,
    });
  } else {
    readDB();
    if (!roomname) {
      return NextResponse.json(
        {
          ok: false,
          message: `Room ${roomname} already exists`,
        },
        { status: 400 }
      );
    }
    const roomId = nanoid();

    //call writeDB after modifying Database
    writeDB();

    return NextResponse.json({
      ok: true,
      roomId,
      message: `Room ${roomname} has been created`,
    });
  }
};
