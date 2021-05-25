import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
// import { SortState } from "../__generated__/globalTypes";

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";




export const SortForm:React.FC=(
    {})=>(
        <div className="bg-">
           <div className="br">All Stores</div>
            <div>
                <div>
                    <h5>Sort</h5><span><FontAwesomeIcon icon={faChevronDown}/></span>
                </div>
                <div>
                    {/* <input type="radio" name="defaultSort" value={SortState.Popular}/> 
                    <span>Picked for you(default)</span>
                    <input type="radio" name="defaultSort"  value={SortState.Rating}/> 
                    <span>Picked for you(default)</span>
                    <input type="radio" name="defaultSort" value={SortState.Delivery_Time}/>  */}
                    <span>Picked for you(default)</span>
                </div>
                <div>
                    <div>
                        <h5>Price range</h5><span><FontAwesomeIcon icon={faChevronDown}/></span>
                    </div>
                    <div>
                        <input type="checkbox" value="$"/>
                        <input type="checkbox" value="$$"/>
                        <input type="checkbox" value="$$$"/>
                        <input type="checkbox" value="$$$$"/>
                    </div>
                </div>
                <div>
                    <div>
                        <h5>Max Delivery Free</h5><span><FontAwesomeIcon icon={faChevronDown}/></span>
                    </div>
                    <div>
                    </div>
                </div>
            </div>
            <div>

            </div>
            <div>

            </div>
            <div>

            </div>
        </div>

)