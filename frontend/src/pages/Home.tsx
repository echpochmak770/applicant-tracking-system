import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [wel, setWel] = useState(false);
  return (
    <div>
      <h1 className="text-2xl text-pink-600"> Home</h1>
      <Button onClick={() => setWel((prev) => !prev)}>Click</Button>
      <p>{wel && "Welcom!"}</p>
    </div>
  );
}
