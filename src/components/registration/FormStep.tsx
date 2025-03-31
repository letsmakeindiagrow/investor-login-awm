import React from "react";

interface FormStepProps {
  title: string;
  children: React.ReactNode;
}

export const FormStep: React.FC<FormStepProps> = ({ title, children }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
};
