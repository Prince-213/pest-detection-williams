"use server";
import { cookies } from "next/headers";

import { redirect } from "next/navigation";

export const startSystem = async (formData: FormData) => {
  console.log(formData);
  const cookieStore = await cookies();
  cookieStore.set("email", formData.get("email")?.toString() ?? "");
  redirect("/detect");
};
