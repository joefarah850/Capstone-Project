import React, { useEffect, useState } from "react";
import { PredictionFormData, PredictionSchema } from "../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PredictionFormField from "./PredictionFormField";
import httpClient from "../httpClient";
import "../css/prediction.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faStar as faStarSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
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
  const [sizeUnit, setSizeUnit] = useState("m2");
  const [customErrors, setCustomErrors] = useState("");
  const [favorite, setFavorite] = useState(false);

  const numbers = Array.from({ length: 7 }, (_, index) => ({
    value: `${index}`,
    label: index === 0 ? "Studio" : `${index}`,
  }));

  const numbers2 = Array.from({ length: 7 }, (_, index) => ({
    value: `${index}`,
    label: `${index}`,
  }));

  library.add(faLock, faStarSolid, faStarRegular);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PredictionFormData>({
    resolver: zodResolver(PredictionSchema),
    mode: "onChange",
  });

  const handlePredict = async (data: any) => {
    data.bedrooms = parseInt(data.bedrooms);
    data.bathrooms = parseInt(data.bathrooms);

    if (sizeUnit === "ft2") {
      data.size = parseFloat(data.size) * 0.092903;
    } else {
      data.size = parseFloat(data.size);
    }

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

  const handleReset = () => {
    console.log("reset");
    try {
      reset({
        size: "",
        bedrooms: "",
        bathrooms: "",
        propType: "",
        region: "",
      });
    } catch (error) {
      console.error("Error resetting form:", error);
    }
    // reset();
    setPrediction(0);
    setShowPrediction(0);
    setSizeUnit("m2");
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

  const watchedSize = watch("size");

  type Unit = "m2" | "ft2";

  useEffect(() => {
    if (!watchedSize) {
      return;
    }
    const validateSize = () => {
      const sizeLimits = {
        m2: { min: 5, max: 500 },
        ft2: { min: 5 * 10.7639, max: 500 * 10.7639 },
      };

      const unit: Unit = sizeUnit === "ft2" ? "ft2" : "m2";
      const currentLimits = sizeLimits[unit];
      const size = parseFloat(watchedSize.toString());

      if (isNaN(size)) {
        setCustomErrors("Required");
      } else if (size < currentLimits.min) {
        setCustomErrors("Size is too small");
      } else if (size > currentLimits.max) {
        setCustomErrors("Size is too large");
      } else {
        setCustomErrors("");
      }
    };

    validateSize();
  }, [watchedSize, sizeUnit]);

  // eslint-disable-next-line
  const toggleFavorite = () => {
    setFavorite(!favorite);
  };

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
            Please <a href="/login">login</a> to access this feature.
          </span>
        </div>
      )}
      <form onSubmit={handleSubmit(handlePredict)}>
        <div className="form-field">
          <PredictionFormField
            id="size"
            type="float"
            placeholder="Size"
            name="size"
            predict={register}
            error={errors.size}
            valueAsNumber={true}
            disabled={className !== ""}
            min={5}
            max={500}
            style={{
              borderColor: customErrors || errors.size ? "rgb(201, 3, 3)" : "",
              borderWidth: customErrors || errors.size ? "2px" : "2px",
            }}
          />
          {errors.size && (
            <span className="error-message-prediction">
              {errors.size.message}
            </span>
          )}
          {customErrors && (
            <span className="error-message-prediction">{customErrors}</span>
          )}
        </div>
        <div className="form-field">
          <select
            name="sizeUnit"
            onChange={(e) => setSizeUnit(e.target.value)}
            disabled={className !== ""}
            id="size-unit"
            value={sizeUnit}
          >
            <option value="m2">m²</option>
            <option value="ft2">ft²</option>
          </select>
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
            disabled={className !== ""}
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
            options={numbers2}
            disabled={className !== ""}
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
            disabled={className !== ""}
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
            disabled={className !== ""}
          />
          {errors.region && (
            <span className="error-message-prediction">
              {errors.region.message}
            </span>
          )}
        </div>
        <div id="button">
          <button
            id="get-prediction-button"
            type="submit"
            onClick={() => {
              watchedSize === ""
                ? setCustomErrors("Required")
                : setCustomErrors("");
            }}
          >
            Get Prediction
          </button>
          {prediction === 0 ? null : (
            <button id="reset" type="button" onClick={handleReset}>
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
              <>
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
                {favorite ? (
                  <FontAwesomeIcon
                    icon={["fas", "star"]}
                    // onClick={toggleFavorite}
                    title="Remove from favorites"
                    id="disabled-star"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={["far", "star"]}
                    // onClick={toggleFavorite}
                    // title="Add to favorites"
                    title="Coming soon!"
                    id="disabled-star"
                  />
                )}
              </>
            )}
          </>
        </div>
        <span id="note">
          Note: Predictions reflect an over 90% accuracy rate against current
          market trends. For detailed analysis, consult a professional.
        </span>
      </form>
    </div>
  );
};

export default PredictionForm;
