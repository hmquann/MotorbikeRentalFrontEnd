import React from "react";
import ModalImage from "react-modal-image";

const inputClasses =
  "w-full px-3 py-2 mt-1 rounded-md bg-input text-primary-foreground";
const labelClasses = "block text-sm font-medium";

const MotorbikeDetails = ({ motorbike, onClose }) => {
  if (!motorbike) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-zinc-200 text-primary-foreground p-4 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Motorbike Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className={labelClasses}>
              Model Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter motorbike name"
              className={inputClasses}
              value={motorbike.model.modelName}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="plate" className={labelClasses}>
              Motorbike Plate
            </label>
            <input
              type="text"
              id="plate"
              name="plate"
              placeholder="Enter motorbike plate"
              className={inputClasses}
              value={motorbike.motorbikePlate}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="overtimeFee" className={labelClasses}>
              Overtime Fee
            </label>
            <input
              type="text"
              id="overtimeFee"
              name="overtimeFee"
              placeholder="Enter overtime fee"
              className={inputClasses}
              value={motorbike.overtimeFee}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="overtimeLimit" className={labelClasses}>
              Overtime Limit
            </label>
            <input
              type="text"
              id="overtimeLimit"
              name="overtimeLimit"
              placeholder="Enter overtime limit"
              className={inputClasses}
              value={motorbike.overtimeLimit}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="tripCount" className={labelClasses}>
              Trip Count
            </label>
            <input
              type="text"
              id="tripCount"
              name="tripCount"
              placeholder="Enter trip count"
              className={inputClasses}
              value={motorbike.tripCount}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="delivery" className={labelClasses}>
              Delivery
            </label>
            <input
              type="text"
              id="delivery"
              name="delivery"
              placeholder="Enter delivery status"
              className={inputClasses}
              value={motorbike.delivery ? "Yes" : "No"}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="deliveryFee" className={labelClasses}>
              Delivery Fee
            </label>
            <input
              type="text"
              id="deliveryFee"
              name="deliveryFee"
              placeholder="Enter delivery fee"
              className={inputClasses}
              value={motorbike.deliveryFee}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="constraintMotorbike" className={labelClasses}>
              Constraint Motorbike
            </label>
            <input
              type="text"
              id="constraintMotorbike"
              name="constraintMotorbike"
              placeholder="Enter motorbike constraints"
              className={inputClasses}
              value={motorbike.constraintMotorbike}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="motorbikeAddress" className={labelClasses}>
              Motorbike Address
            </label>
            <textarea
              id="motorbikeAddress"
              name="motorbikeAddress"
              placeholder="Enter motorbike address"
              className={`${inputClasses} resize-none`}
              value={motorbike.motorbikeAddress}
              readOnly
              rows={3}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <label htmlFor="motorbikeImages" className={labelClasses}>
              Motorbike Images
            </label>
            <div className="flex flex-wrap items-center mt-1">
              {motorbike.motorbikeImages.map((image, index) => (
                <ModalImage
                  key={index}
                  small={image.url}
                  large={image.url}
                  alt={`Motorbike image ${index + 1}`}
                  className="w-28 h-28 object-cover rounded-md mr-2 mb-2"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MotorbikeDetails;
