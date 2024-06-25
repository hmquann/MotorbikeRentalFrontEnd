import React,{useState} from 'react';
import axios from "axios";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
const Filter = () => {
const buttonClasses = 'flex items-center border rounded-full px-3 py-1';
const imageClasses = 'mr-2';
const infoImageClasses = 'ml-2';
const [brands, setBrands] = useState([]);
const [models, setModels] = useState([]);
const[filterBrands,setFilterBrands]=useState([]);
useEffect(() => {
    axios.get('http://localhost:8080/api/model/getAllModel')
        .then(response => setModels(response.data))
        .catch(error => console.error('Error fetching models:', error));

    axios.get('http://localhost:8080/api/brand/getAllBrand')
        .then(response => setBrands(response.data))
        .catch(error => console.error('Error fetching other entities 1:', error));
}, []);
 const handleFilterList=(e)=>{

}

    return (
        <div>
    <div className="flex flex-wrap gap-2 p-4">

      <button className={buttonClasses}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-green-500">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
        Loại xe
      </button>
      <button class={buttonClasses} onclick="toggleDropdown()">
            <svg class="h-8 w-8 text-green-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" />
                <circle cx="5" cy="18" r="3" />
                <circle cx="19" cy="18" r="3" />
                <polyline points="12 19 12 15 9 12 14 8 16 11 19 11" />
                <circle cx="17" cy="5" r="1" />
            </svg>
            Hãng xe
        </button>
      <button className={buttonClasses} onClick={handleFilterList} name="rate">
      <svg class="h-8 w-8 text-green-500"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
</svg>
        Chủ xe 5 sao
        </button>
      <button className={buttonClasses}onClick={handleFilterList} name="delivery">
      <svg class="h-8 w-8 text-green-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <polyline points="3 7 9 4 15 7 21 4 21 17 15 20 9 17 3 20 3 7" />  <line x1="9" y1="4" x2="9" y2="17" />  <line x1="15" y1="7" x2="15" y2="20" />
      </svg>       
       Giao nhận xe tận nơi
      </button>
      <button className={buttonClasses}>
      <svg class="h-8 w-8 text-green-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="9" y1="14" x2="15" y2="8" />  <circle cx="9.5" cy="8.5" r=".5" fill="currentColor" />  <circle cx="14.5" cy="13.5" r=".5" fill="currentColor" />  <path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2" /></svg>
        Xe giảm giá

      </button>
      <button className={buttonClasses}>
      <svg class="h-8 w-8 text-green-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="5" cy="18" r="3" />  <circle cx="19" cy="18" r="3" />  <polyline points="12 19 12 15 9 12 14 8 16 11 19 11" />  <circle cx="17" cy="5" r="1" /></svg>
        Xe điện
      </button>   
      <button className={buttonClasses}>
      <svg class="h-8 w-8 text-green-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="6" cy="10" r="2" />  <line x1="6" y1="4" x2="6" y2="8" />  <line x1="6" y1="12" x2="6" y2="20" />  <circle cx="12" cy="16" r="2" />  <line x1="12" y1="4" x2="12" y2="14" />  <line x1="12" y1="18" x2="12" y2="20" />  <circle cx="18" cy="7" r="2" />  <line x1="18" y1="4" x2="18" y2="5" />  <line x1="18" y1="9" x2="18" y2="20" /></svg>
        Bộ lọc
      </button>
    </div>     
        </div>
    );
};
export default Filter;


    