import { createPortal } from "react-dom"



export const Modal:React.FC<{}>=({children})=>{
    const modalElement = document.getElementById("modal")!;

    return createPortal(children,modalElement)
}