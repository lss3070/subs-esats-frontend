import { render } from "@testing-library/react";
import React from "react";
import {App} from "../App";
import { LoggedOutRouter } from '../../routers/logged-out-router';

jest.mock("../../routers/logged-out-router.tsx",()=>{
    return{
        LoggedOutRouter:()=><span>logged-out</span>,
    }
})

describe("<App/>",()=>{
    it("renders OK",()=>{
        const {debug}=render(<App/>)
        debug();
    })
})