import Image from "next/image";
import User from "./user";
import { Button } from "@/components/ui/button"

export function ButtonDemo() {
  return <Button>Button</Button>
}


export default function Home() {
  return (
    <div className="">
        <ButtonDemo />
        <User />
    </div>
  );
}
