import { title } from "@/components/primitives";

export default function PricingPage() {
  return (
    <div>
      <h1 className={title()}>Pricing - </h1>
      <h1 className={title({ color: "violet" })}> $0 per month</h1>
    </div>
  );
}
