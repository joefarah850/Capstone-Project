import React, { useEffect, useState } from "react";
import { PredictionFormData, PredictionSchema } from "../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PredictionFormField from "./PredictionFormField";
import httpClient from "../httpClient";

const PredictionForm: React.FC = () => {
  const [propertyType, setPropType] = useState([]);
  const [propRegion, setRegion] = useState([]);
  const [prediction, setPrediction] = useState<number>(0);
  const [rates, setRates] = useState([]);
  const [currency, setCurrency] = useState("AED");
  const [showPrediction, setShowPrediction] = useState<number>(0);

  const numbers = Array.from({ length: 7 }, (_, index) => ({
    value: `${index}`, // Since index is 0-based, add 1 to start from 1
    label: `${index}`, // Convert the number to a string for the label
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PredictionFormData>({
    resolver: zodResolver(PredictionSchema),
    mode: "onBlur",
  });

  const handlePredict = async (data: any) => {
    data.bedrooms = parseInt(data.bedrooms);
    data.bathrooms = parseInt(data.bathrooms);
    const resp = await httpClient.post(
      "http://localhost:5000/prediction",
      data
    );
    setPrediction(resp.data.prediction);
    setShowPrediction(resp.data.prediction);
  };

  const getPropType = async () => {
    const resp = await httpClient.get("http://localhost:5000/get-types");
    setPropType(resp.data.data);
  };

  const getRegion = async () => {
    const resp = await httpClient.get("http://localhost:5000/get-regions");
    setRegion(resp.data.data);
  };

  const apiKey = process.env.REACT_APP_CONVERSION_KEY;
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  // const getRates = async () => {
  //   try {
  //     const url = `${baseUrl}/${apiKey}/latest/AED`;
  //     const response = await fetch(url);
  //     const data = await response.json();

  //     if (data.result === "success") {
  //       setRates(data.conversion_rates);
  //     } else {
  //       console.error("Failed to fetch rates:", data.error);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching conversion rates:", error);
  //   }
  // };

  // const calculteRate = async (toCurrency: string) => {
  //   try {
  //     const url = `${baseUrl}/${apiKey}/latest/AED`;
  //     const response = await fetch(url);
  //     const data = await response.json();

  //     const rate = data.conversion_rates[toCurrency];
  //     setCurrency(toCurrency);
  //     return prediction * rate;
  //   } catch (error) {
  //     console.error("Error fetching conversion rates:", error);
  //   }
  // };

  const formatCurrency = (value: number, currencyCode: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    getPropType();
    getRegion();
    // getRates();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit(handlePredict)}>
        <PredictionFormField
          type="text"
          placeholder="Size"
          name="size"
          predict={register}
          error={errors.size}
          valueAsNumber={true}
        />
        <PredictionFormField
          type="dropdown"
          placeholder="Number of Bedrooms"
          name="bedrooms"
          predict={register}
          error={errors.bedrooms}
          valueAsNumber={true}
          options={numbers}
        />
        <PredictionFormField
          type="dropdown"
          placeholder="Number of Bathrooms"
          name="bathrooms"
          predict={register}
          error={errors.bathrooms}
          valueAsNumber={true}
          options={numbers}
        />
        <PredictionFormField
          type="dropdown"
          placeholder="Type of Property"
          name="propType"
          predict={register}
          error={errors.propType}
          options={propertyType.map((type: any) => ({
            value: type.name,
            label: type.name,
          }))}
        />
        <PredictionFormField
          type="dropdown"
          placeholder="Region"
          name="region"
          predict={register}
          error={errors.region}
          options={propRegion.map((region: any) => ({
            value: region.name,
            label: region.name,
          }))}
        />
        <div>
          <button type="submit">Get Prediction</button>
        </div>
        <div>
          {prediction === 0 ? null : (
            <>
              <h2>Prediction: {formatCurrency(showPrediction, currency)}</h2>
              <div>
                <select
                  name="currencies"
                  id="currency"
                  // onChange={async (e) => {
                  //   const rate = await calculteRate(e.target.value);
                  //   setShowPrediction(rate || 0);
                  // }}
                >
                  {Object.keys(rates).map((currency, index) => (
                    <option key={index} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default PredictionForm;
