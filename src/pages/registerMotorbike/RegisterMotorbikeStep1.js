import React from 'react';

const sharedClasses = {
  bgGreen: 'bg-green-500',
  textWhite: 'text-white',
  roundedLG: 'rounded-lg',
  shadow: 'shadow',
  p4: 'p-4',
  p6: 'p-6',
  mt4: 'mt-4',
  mx4: 'mx-4',
  flex: 'flex',
  justifyCenter: 'justify-center',
  justifyBetween: 'justify-between',
  itemsCenter: 'items-center',
  spaceX4: 'space-x-4',
  spaceX2: 'space-x-2',
  spaceY4: 'space-y-4',
  gridCols1: 'grid-cols-1',
  gridCols2: 'grid-cols-2',
  gridCols3: 'grid-cols-3',
  gap4: 'gap-4',
  wFull: 'w-full',
  h10: 'h-10',
  w8: 'w-8',
  h8: 'h-8',
  mb4: 'mb-4',
  mdGridRow: 'md:flex-row',
  mdGridCol: 'md:grid-cols-2',
  textCenter: 'text-center',
  textLeft: 'text-left',
  textSm: 'text-sm',
  textLg: 'text-lg',
  fontSemibold: 'font-semibold',
  border: 'border',
  borderZinc300: 'border-zinc-300',
  roundedFull: 'rounded-full',
};

const Navbar = () => {
  return (
    <nav className={`bg-white dark:bg-zinc-800 ${sharedClasses.shadow} ${sharedClasses.p4} ${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter}`}>
      <div className={`${sharedClasses.flex} ${sharedClasses.itemsCenter} ${sharedClasses.spaceX4}`}>
        <img src="https://placehold.co/50x50" alt="Logo" className={sharedClasses.h10} />
        <button className={`${sharedClasses.bgGreen} ${sharedClasses.textWhite} px-4 py-2 ${sharedClasses.roundedLG}`}>About</button>
        <button className={`${sharedClasses.bgGreen} ${sharedClasses.textWhite} px-4 py-2 ${sharedClasses.roundedLG}`}>Trips</button>
        <button className={`${sharedClasses.bgGreen} ${sharedClasses.textWhite} px-4 py-2 ${sharedClasses.roundedLG}`}>Car Rent</button>
        <button className={`${sharedClasses.bgGreen} ${sharedClasses.textWhite} px-4 py-2 ${sharedClasses.roundedLG}`}>Contact</button>
      </div>
      <button className={`${sharedClasses.bgGreen} ${sharedClasses.textWhite} px-4 py-2 ${sharedClasses.roundedLG}`}>User</button>
    </nav>
  );
};

const StepIndicator = ({ stepNumber, stepText }) => {
  return (
    <div className={`${sharedClasses.flex} ${sharedClasses.itemsCenter} ${sharedClasses.spaceX2}`}>
      <div className={`bg-zinc-300 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 ${sharedClasses.roundedFull} ${sharedClasses.w8} ${sharedClasses.h8} ${sharedClasses.flex} ${sharedClasses.itemsCenter} ${sharedClasses.justifyCenter}`}>{stepNumber}</div>
      <span>{stepText}</span>
    </div>
  );
};

const FormInput = ({ label, placeholder }) => {
  return (
    <div className={sharedClasses.mb4}>
      <h2 className={`${sharedClasses.textLg} ${sharedClasses.fontSemibold}`}>{label}</h2>
      <input type="text" className={`${sharedClasses.wFull} mt-2 p-2 ${sharedClasses.border} ${sharedClasses.borderZinc300} ${sharedClasses.roundedLG}`} placeholder={placeholder} />
    </div>
  );
};

const TextAreaInput = ({ label, placeholder }) => {
  return (
    <div className={sharedClasses.mb4}>
      <h2 className={`${sharedClasses.textLg} ${sharedClasses.fontSemibold}`}>{label}</h2>
      <textarea className={`${sharedClasses.wFull} mt-2 p-2 ${sharedClasses.border} ${sharedClasses.borderZinc300} ${sharedClasses.roundedLG}`} placeholder={placeholder}></textarea>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className={`bg-white dark:bg-zinc-800 ${sharedClasses.shadow} ${sharedClasses.p6} ${sharedClasses.mt4}`}>
      <div className={`${sharedClasses.flex} ${sharedClasses.mdGridRow} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter}`}>
        <img src="https://placehold.co/100x50" alt="Logo" className={`${sharedClasses.h10} ${sharedClasses.mb4} md:mb-0`} />
        <div className={`${sharedClasses.textCenter} ${sharedClasses.mdTextLeft}`}>
          <p className={sharedClasses.textSm}>Policy</p>
          <p className={sharedClasses.textSm}>Policies and regulations</p>
          <p className={sharedClasses.textSm}>Information security</p>
          <p className={sharedClasses.textSm}>Dispute resolution</p>
        </div>
        <div className={`${sharedClasses.textCenter} ${sharedClasses.mdTextLeft}`}>
          <p className={sharedClasses.textSm}>Find out more</p>
          <p className={sharedClasses.textSm}>General guidance</p>
          <p className={sharedClasses.textSm}>Instructions for booking</p>
          <p className={sharedClasses.textSm}>Payment Guide</p>
        </div>
        <div className={`${sharedClasses.textCenter} ${sharedClasses.mdTextLeft}`}>
          <p className={sharedClasses.textSm}>Partner</p>
          <p className={sharedClasses.textSm}>Register vehicle owner</p>
          <p className={sharedClasses.textSm}>Register for a long-term car rental</p>
        </div>
      </div>
      <div className={`${sharedClasses.textCenter} ${sharedClasses.textSm} ${sharedClasses.mt4}`}>
        <p>&copy; 2023 Company Name. All rights reserved.</p>
        <p>Address: Office A, 123 Street, City</p>
        <p>Phone: 123-456-7890</p>
      </div>
    </footer>
  );
};

const RegisterMotorbikeStep1 = () => {
  return (
    <div className={`min-h-screen bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100`}>
      <Navbar />
      <div className={`bg-white dark:bg-zinc-800 ${sharedClasses.shadow} ${sharedClasses.p4} ${sharedClasses.mt4} ${sharedClasses.flex} ${sharedClasses.justifyCenter} ${sharedClasses.spaceX4}`}>
        <StepIndicator stepNumber="1" stepText="Information" />
        <span>&gt;</span>
        <StepIndicator stepNumber="2" stepText="Lease" />
        <span>&gt;</span>
        <StepIndicator stepNumber="3" stepText="Image" />
      </div>
      <div className={`bg-white dark:bg-zinc-800 ${sharedClasses.shadow} ${sharedClasses.p6} ${sharedClasses.mt4} ${sharedClasses.mx4} ${sharedClasses.roundedLG}`}>
        <FormInput label="License plates" placeholder="License plate" />
        <FormInput label="Basic Information" placeholder="Moto company" />
        <FormInput label="Year of manufacture" placeholder="Year of manufacture" />
        <FormInput label="Moto model" placeholder="Moto model" />
        <FormInput label="Fuel type" placeholder="Fuel type" />
        <FormInput label="Fuel consumption level" placeholder="Fuel consumption level" />
        <TextAreaInput label="Describe" placeholder="Describe" />
        <div className={`${sharedClasses.mb4} ${sharedClasses.gridCols3} ${sharedClasses.gap4} ${sharedClasses.mt2}`}>
          <FormInput label="Feature 1" placeholder="Feature 1" />
          <FormInput label="Feature 2" placeholder="Feature 2" />
          <FormInput label="Feature 3" placeholder="Feature 3" />
          <FormInput label="Feature 4" placeholder="Feature 4" />
          <FormInput label="Feature 5" placeholder="Feature 5" />
          <FormInput label="Feature 6" placeholder="Feature 6" />
        </div>
        <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.mt4}`}>
          <button className={`${sharedClasses.bgGreen} ${sharedClasses.textWhite} px-4 py-2 ${sharedClasses.roundedLG}`}>Back</button>
          <button className={`${sharedClasses.bgGreen} ${sharedClasses.textWhite} px-4 py-2 ${sharedClasses.roundedLG}`}>Continue</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterMotorbikeStep1;
