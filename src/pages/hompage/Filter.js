import React from 'react';

const Filter = () => {
const buttonClasses = 'flex items-center border rounded-full px-3 py-1';
const imageClasses = 'mr-2';
const infoImageClasses = 'ml-2';
    return (
        <div>
    <div className="flex flex-wrap gap-2 p-4">

      <button className={buttonClasses}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-green-500">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
        Loại xe
      </button>
      <button className={buttonClasses}>
      <svg class="h-8 w-8 text-green-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="5" cy="18" r="3" />  <circle cx="19" cy="18" r="3" />  <polyline points="12 19 12 15 9 12 14 8 16 11 19 11" />  <circle cx="17" cy="5" r="1" /></svg>
        Hãng xe
      </button>
      <button className={buttonClasses}>
        Chủ xe 5 sao
        </button>
      <button className={buttonClasses}>
      <svg class="h-8 w-8 text-green-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <polyline points="3 7 9 4 15 7 21 4 21 17 15 20 9 17 3 20 3 7" />  <line x1="9" y1="4" x2="9" y2="17" />  <line x1="15" y1="7" x2="15" y2="20" /></svg>        Giao nhận xe tận nơi
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


    