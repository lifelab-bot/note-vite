import { steps } from "../data/steps";
import Card from "./Card";

export default function StepList() {
  return (
    <div className="step-list">
      {steps.map((step) => (
        <Card key={step.id} index={step.id} icon={step.icon} title={step.title} tips={step.tips}>
          {step.description}
        </Card>
      ))}
    </div>
  );
}
