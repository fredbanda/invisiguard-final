import { FaGlassCheers } from "react-icons/fa";

interface FormSuccessProps {
    message?: string;
}


export const FormSuccess = ({message}: FormSuccessProps) => {
    if (!message) return null;
  return (
    <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-[1rem] ">
      <FaGlassCheers className="h-5 w-5 text-pink-700" />
      <p>{message}</p>
    </div>
  )
}
