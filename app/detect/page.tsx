import React from "react";
import DetectionComponent from "./(ui)/DetectionComponent";
import { cookies } from "next/headers";

const DetectionPage = async () => {
  const cookieStore = await cookies();
  const email = cookieStore.get("email")?.value || "";

  return (
    <>
      <DetectionComponent email={email} />
    </>
  );
};

export default DetectionPage;
