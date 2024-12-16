import React from "react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-gray-600 mt-8">
      <Separator />
      <div className="py-5 text-center text-white">
        <p className="text-center">&copy; Vinicius Noronha Renó</p>
        <p>Feito com: ReactJS, Vite, Shadcn/ui e TailwindCss</p>
      </div>
    </footer>
  );
};

export default Footer;
