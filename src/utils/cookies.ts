"use server";
import { cookies } from "next/headers";

export const setCookie = async (token: string) => {
  try {
    console.log("Setting cookie with token:", token);
    const cookieStore = await cookies();
    cookieStore.set("token", token, { 
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    console.log("Cookie set successfully");
  } catch (error) {
    console.error("Error in setCookie server action:", error);
    throw error;
  }
};

export const removeCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("token");
};
