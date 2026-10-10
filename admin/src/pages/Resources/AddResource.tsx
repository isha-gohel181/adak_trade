import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createResource,
  selectResourceLoading,
  selectResourceError,
} from "../../store/slices/resource";
import type { ResourcePayload } from "../../store/slices/resource";
import { AppDispatch } from "../../store";
import PopupAlert from "../../components/popUpAlert";
import ResourceForm from "./ResourceForm";

const AddResource: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const loading = useSelector(selectResourceLoading);
  const error = useSelector(selectResourceError);
  const [popup, setPopup] = useState<{
    isVisible: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    isVisible: false,
    message: "",
    type: "info",
  });

  const handleSubmit = async (payload: ResourcePayload) => {
    try {
      await dispatch(createResource(payload)).unwrap();
      setPopup({
        isVisible: true,
        message: "Resource created successfully!",
        type: "success",
      });
    } catch (err) {
      console.error("Failed to create resource:", err);
      setPopup({
        isVisible: true,
        message: "Failed to create resource. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <>
      <PopupAlert
        isVisible={popup.isVisible}
        message={popup.message}
        type={popup.type}
        onClose={() => {
          setPopup({ isVisible: false, message: "", type: "info" });
          if (popup.type === "success") {
            navigate("/resources");
          }
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Add New Resource
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <ResourceForm
            submitLabel="Create Resource"
            submittingLabel="Creating..."
            loading={loading}
            error={error}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/resources")}
          />
        </div>
      </div>
    </>
  );
};

export default AddResource;
