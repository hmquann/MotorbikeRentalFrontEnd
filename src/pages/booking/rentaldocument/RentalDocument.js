import {
  faAddressCard,
  faCircleExclamation,
  faPassport,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const sharedClasses = {
  flex: "flex",
  itemsCenter: "items-center",
  mb4: "mb-4",
  p4: "p-4",
  bgOrange50: "bg-orange-50",
  roundedLg: "rounded-lg",
  borderL4: "border-l-4",
  borderOrange500: "border-orange-500",
  textLg: "text-lg",
  fontSemibold: "font-semibold",
  ml2: "ml-2",
  textZinc500: "text-zinc-500",
  spaceY2: "space-y-2",
  mr2: "mr-2",
};

const DocumentItem = ({ iconSrc, altText, text }) => (
  <li className={`${sharedClasses.flex} ${sharedClasses.itemsCenter}`}>
    <img src={iconSrc} alt={altText} className={sharedClasses.mr2} />
    <span>{text}</span>
  </li>
);

const DocumentList = () => (
  <ul className={sharedClasses.spaceY2}>
    <div className={`${sharedClasses.spaceY2}`}>
      <FontAwesomeIcon icon={faAddressCard} size="lg" />
      <span>
        &nbsp;&nbsp;&nbsp;&nbsp;GPLX (đối chiếu) & CCCD (đối chiếu VNeID)
      </span>
    </div>
    <div className={`${sharedClasses.spaceY2}`}>
      <FontAwesomeIcon icon={faPassport} size="lg" />
      <span>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GPLX (đối chiếu) & Passport (giữ lại)
      </span>
    </div>
  </ul>
);

const InfoSection = ({ title, infoText, children }) => (
  <div className={sharedClasses.mb4}>
    <h2
      className={`${sharedClasses.textLg} ${sharedClasses.fontSemibold} ${sharedClasses.flex} ${sharedClasses.itemsCenter}`}
    >
      {title}
      <span className={sharedClasses.ml2}>?</span>
    </h2>
    <div
      className={`${sharedClasses.bgOrange50} ${sharedClasses.p4} ${sharedClasses.roundedLg} ${sharedClasses.borderL4} ${sharedClasses.borderOrange500}`}
    >
      <div
        className={`${sharedClasses.flex} ${sharedClasses.itemsCenter} ${sharedClasses.mb2}`}
      >
        <FontAwesomeIcon icon={faCircleExclamation} />
        <span>&nbsp;&nbsp;{infoText}</span>
      </div>
      {children}
    </div>
  </div>
);

const RentalDocument = () => (
  <div className={sharedClasses.p4}>
    <InfoSection
      className={`${sharedClasses.mb4}`}
      title="Giấy tờ thuê xe"
      infoText="Chọn 1 trong 2 hình thức"
    >
      <DocumentList />
    </InfoSection>
    <InfoSection
      title="Tài sản thế chấp"
      infoText="Không yêu cầu khách thuê thế chấp Tiền mặt hoặc Xe máy"
    />
  </div>
);

export default RentalDocument;
