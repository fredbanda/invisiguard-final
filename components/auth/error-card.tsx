import { CardWrapper } from "./card-wrapper";
import { FaExclamationTriangle } from "react-icons/fa";

export const ErrorCard = () => {
  return (
        <CardWrapper
        headerLabel="Ooops! Something went wrong"
        backButtonLabel="Go back to login page"
        backButtonHref="/auth/login"
        >
           <div className="w-full flex justify-center items-center">
            <FaExclamationTriangle className="text-red-500 text-5xl animate-zoom" />
            </div> 
        </CardWrapper>
  );
};
