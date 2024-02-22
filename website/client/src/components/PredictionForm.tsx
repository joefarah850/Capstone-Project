import React, { useEffect, useState } from "react";
import { PredictionFormData, PredictionSchema } from "../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PredictionFormField from "./PredictionFormField";
import httpClient from "../httpClient";

const PredictionForm: React.FC = () => {
  const [propertyType, setPropType] = useState([]);
  const [propRegion, setRegion] = useState([]);
  const [prediction, setPrediction] = useState<Number>(0);

  const numbers = Array.from({ length: 7 }, (_, index) => ({
    value: `${index}`, // Since index is 0-based, add 1 to start from 1
    label: `${index}`, // Convert the number to a string for the label
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
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
  };

  useEffect(() => {
    const getPropType = async () => {
      const resp = await httpClient.get("http://localhost:5000/get-types");
      setPropType(await resp.data.data);
    };

    const getRegion = async () => {
      const resp = await httpClient.get("http://localhost:5000/get-regions");
      setRegion(await resp.data.data);
    };

    getPropType();
    getRegion();
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
            <h2>Prediction: {String(prediction)} AED</h2>
          )}
        </div>
      </form>
    </div>
  );
};

export default PredictionForm;
