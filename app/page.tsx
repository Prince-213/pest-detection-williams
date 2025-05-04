import { startSystem } from "@/action";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" w-full min-h-screen">
      <header className=" w-full py-4">
        <div className=" w-[90%] mx-auto">
          <h1 className=" font-semibold text-emerald-500 text-4xl uppercase">pest aware</h1>
        </div>
      </header>
      <div className=" w-full min-h-[85vh] bg-[#113D3C] relative flex items-center">
        <Image
          src={"/assets/pngwing.com (65).png"}
          alt=""
          width={300}
          height={300}
          className=" absolute -bottom-[10%] left-[30%]"
        />
        <div
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundImage:
              "url('/assets/pexels-erik-karits-2093459-26861337.jpg')"
          }}
          className=" absolute w-1/2 h-full bg-[url('/assets/pexels-erik-karits-2093459-26861337.jpg')] right-0 rounded-tl-full rounded-bl-full"
        ></div>

        <div className=" pl-[15vh] space-y-5">
          <h1 className=" uppercase text-2xl text-green-600">
            experts who care
          </h1>

          <div className=" uppercase text-white font-extrabold text-7xl">
            <h1>farm better.</h1>
            <h1>farm pest free.</h1>
          </div>

          <p className=" text-xl  text-white">
            Enter your email to receive report notification
          </p>

          <form action={startSystem} method="POST" className=" space-y-2">
            <input
              type="email"
              name="email"
              className=" border-2 w-[80%] rounded-lg border-gray-400 p-2 bg-transparent "
            />
            <br />

            <button className=" px-6 py-2 rounded-lg bg-emerald-500 text-white font-semibold">
              Get Started
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
