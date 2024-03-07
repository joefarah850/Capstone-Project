import React, { useEffect, useState } from "react";
import { PredictionFormData, PredictionSchema } from "../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PredictionFormField from "./PredictionFormField";
import httpClient from "../httpClient";
import "../css/prediction.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

interface PredictionFormProps {
  className?: string;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ className }) => {
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

  library.add(faLock);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PredictionFormData>({
    resolver: zodResolver(PredictionSchema),
    mode: "onChange",
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
    getRates();
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

  const getRates = async () => {
    try {
      const url = `${baseUrl}/${apiKey}/latest/AED`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.result === "success") {
        setRates(data.conversion_rates);
      } else {
        console.error("Failed to fetch rates:", data.error);
      }
    } catch (error) {
      console.error("Error fetching conversion rates:", error);
    }
  };

  const calculteRate = async (toCurrency: string) => {
    try {
      const url = `${baseUrl}/${apiKey}/latest/AED`;
      const response = await fetch(url);
      const data = await response.json();

      const rate = data.conversion_rates[toCurrency];
      setCurrency(toCurrency);
      return prediction * rate;
    } catch (error) {
      console.error("Error fetching conversion rates:", error);
    }
  };

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
    <div className="pred-container">
      <div className={className}></div>
      {className === "" ? null : (
        <div id="disabled">
          <span id="disabled-span">
            {" "}
            <FontAwesomeIcon icon={["fas", "lock"]} />
            <br></br>
            <br></br>
            Please log in to access this feature.
          </span>
        </div>
      )}
      <form onSubmit={handleSubmit(handlePredict)}>
        <div className="form-field">
          <PredictionFormField
            type="text"
            placeholder="Size"
            name="size"
            predict={register}
            error={errors.size}
            valueAsNumber={true}
          />
          {errors.size && (
            <span className="error-message-prediction">
              {errors.size.message}
            </span>
          )}
        </div>
        <div className="form-field">
          <PredictionFormField
            type="dropdown"
            placeholder="Number of Bedrooms"
            name="bedrooms"
            predict={register}
            error={errors.bedrooms}
            valueAsNumber={true}
            options={numbers}
          />
          {errors.bedrooms && (
            <span className="error-message-prediction">
              {errors.bedrooms.message}
            </span>
          )}
        </div>
        <div className="form-field">
          <PredictionFormField
            type="dropdown"
            placeholder="Number of Bathrooms"
            name="bathrooms"
            predict={register}
            error={errors.bathrooms}
            valueAsNumber={true}
            options={numbers}
          />
          {errors.bathrooms && (
            <span className="error-message-prediction">
              {errors.bathrooms.message}
            </span>
          )}
        </div>
        <div className="form-field">
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
          {errors.propType && (
            <span className="error-message-prediction">
              {errors.propType.message}
            </span>
          )}
        </div>
        <div className="form-field">
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
          {errors.region && (
            <span className="error-message-prediction">
              {errors.region.message}
            </span>
          )}
        </div>
        <div id="button">
          <button id="get-prediction-button" type="submit">
            Get Prediction
          </button>
          {prediction === 0 ? null : (
            <button id="reset" type="button" onClick={() => reset()}>
              Clear Prediction
            </button>
          )}
        </div>
        <div
          id="prediction"
          style={{
            opacity: prediction === 0 ? "0.7" : "",
            color: prediction === 0 ? "gray" : "",
          }}
        >
          {/* {prediction === 0 ? null : ( */}
          <>
            <h2>Prediction:&nbsp;&nbsp; </h2>
            <input
              type="text"
              value={
                prediction === 0 ? "" : formatCurrency(showPrediction, currency)
              }
              disabled
              style={{ borderColor: prediction === 0 ? "gray" : "" }}
            />
            {prediction === 0 ? null : (
              <div id="currencies">
                <select
                  name="currencies"
                  id="currency"
                  onChange={async (e) => {
                    const rate = await calculteRate(e.target.value);
                    setShowPrediction(rate || 0);
                  }}
                >
                  {Object.keys(rates).map((currency, index) => (
                    <option key={index} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </>
        </div>
      </form>
    </div>
  );
};

export default PredictionForm;
