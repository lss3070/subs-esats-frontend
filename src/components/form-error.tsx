import React from "react";

interface IFormErrorProps{
    errorMessage:string | undefined;
}

export const FormError:React.FC<IFormErrorProps> =({errorMessage}) => (
<span className="font-medium text-red-500">
    {errorMessage}
</span>
);