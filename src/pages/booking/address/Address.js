import React, { useState, useEffect } from "react";

const Address = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://vapi.vnappmob.com/api/province")
      .then((response) => response.json())
      .then((data) => {
        console.log("API response:", data); // In dữ liệu trả về ra console
        if (data && data.results) {
          setProvinces(data.results); // Điều chỉnh theo cấu trúc dữ liệu thực tế
        } else {
          throw new Error("Invalid data format");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error + "1");
        setLoading(false);
      });
  }, []);

  const handleProvinceChange = (event) => {
    const provinceId = event.target.value;
    setSelectedProvince(provinceId);

    // Fetch districts based on selected province
    fetch(`https://vapi.vnappmob.com/api/province/district/${provinceId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("District API response:", data);
        if (data && data.results) {
          setDistricts(data.results);
          setWards([]);
        } else {
          throw new Error("Invalid data format");
        }
      })
      .catch((error) => {
        setError(error + "123");
      });
  };

  const handleDistrictChange = (event) => {
    const districtId = event.target.value;
    setSelectedDistrict(districtId);

    // Fetch wards based on selected district
    fetch(`https://vapi.vnappmob.com/api/province/ward/${districtId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Ward API response:", data);
        if (data.results.length === 0) {
          console.log("No wards available");
          setWards([]); // Clear wards if no wards are available
        }
        if (data && data.results) {
          setWards(data.results);
        } else {
          throw new Error("Invalid data format");
        }
      })
      .catch((error) => {
        setError(error + "1234");
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <form>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="provinces"
          value={selectedProvince}
          onChange={handleProvinceChange}
        >
          <option value="">Select provinces</option>
          {provinces.map((province) => (
            <option key={province.province_id} value={province.province_id}>
              {province.province_name}
            </option>
          ))}
        </select>

        <select
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="districts"
          value={selectedDistrict}
          onChange={handleDistrictChange}
          disabled={!selectedProvince}
        >
          <option value="">Select districts</option>
          {districts.map((district) => (
            <option key={district.district_id} value={district.district_id}>
              {district.district_name}
            </option>
          ))}
        </select>

        <select
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="wards"
          disabled={!selectedDistrict}
        >
          <option value="">Select wards</option>
          {wards.map((ward) => (
            <option key={ward.ward_id} value={ward.ward_id}>
              {ward.ward_name}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
};

export default Address;
