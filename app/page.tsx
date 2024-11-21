import Timer from "@/components/timer";
import Image from "next/image";
import { Poppins } from "next/font/google";
const poppins = Poppins({ weight: "500", subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <Image
        src="/iedc.png"
        alt="Next.js Logo"
        className="absolute left-5"
        width={150}
        height={150}
      />
      <h1
        className={` ${poppins.className} absolute right-5 top-12 text-xl uppercase text-white`}
      >
        I Plan 2024
      </h1>
      <Timer />
    </main>
  );
}
