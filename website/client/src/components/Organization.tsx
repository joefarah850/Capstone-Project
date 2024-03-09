import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrganizationFormData, OrganizationUserSchema } from "../types";
import OrganizationFormField from "./OrganizationFormField";
import httpClient from "../httpClient";
import "../css/organization.scss";

interface OrganizationProps {
  className?: string;
  id?: string;
  toggleNewOrg: () => void;
  onSave?: (newOrg: OrganizationFormData) => void;
}

const Organization: React.FC<OrganizationProps> = ({
  className,
  id,
  toggleNewOrg,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(OrganizationUserSchema),
    mode: "onChange",
  });

  const addOrganization = async (data: OrganizationFormData) => {
    try {
      const resp = await httpClient.post(
        "http://localhost:5000/new-organization",
        data
      );
      console.log(resp.data);
      toggleNewOrg();
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className={className} id={id}>
      <div className="org-container">
        <h2>Add Organization</h2>
        <div className="org-field">
          <OrganizationFormField
            type="name"
            placeholder="Organization Name"
            name="name"
            register={register}
            error={errors.name}
          />
        </div>
        <div className="org-field">
          <OrganizationFormField
            type="email"
            placeholder="Organization Email"
            name="email"
            register={register}
            error={errors.email}
          />
        </div>
        <div className="org-field">
          <OrganizationFormField
            type="url"
            placeholder="Organization Website URL"
            name="website"
            register={register}
            error={errors.website}
          />
        </div>
        <div id="buttons-2">
          <button
            type="button"
            onClick={() => {
              toggleNewOrg();
              reset();
            }}
            id="back-2"
          >
            Back
          </button>
          <button
            type="submit"
            onClick={() => {
              handleSubmit(addOrganization);
              reset();
            }}
            id="submit-3"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Organization;
