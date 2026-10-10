import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  updateResource,
  fetchResources,
  selectResourceLoading,
  selectResourceError,
  selectResources,
} from "../../store/slices/resource";
import type { ResourcePayload } from "../../store/slices/resource";
import { AppDispatch } from "../../store";
import PopupAlert from "../../components/popUpAlert";
import ResourceForm from "./ResourceForm";

const EditResource: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const loading = useSelector(selectResourceLoading);
  const error = useSelector(selectResourceError);
  const resources = useSelector(selectResources);
  const [popup, setPopup] = useState<{
    isVisible: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    isVisible: false,
    message: "",
    type: "info",
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!id) return;
    if (resources.length === 0 && !loaded) {
      setLoaded(true);
      dispatch(fetchResources({ page: 1, limit: 100 }));
      return;
    }
  }, [id, resources, dispatch, loaded]);

  const resource = resources.find((r) => r._id === id) || null;

  const handleSubmit = async (payload: ResourcePayload) => {
    if (!id) return;
    try {
      await dispatch(updateResource({ id, payload })).unwrap();
      setPopup({
        isVisible: true,
        message: "Resource updated successfully!",
        type: "success",
      });
    } catch (err) {
      console.error("Failed to update resource:", err);
      setPopup({
        isVisible: true,
        message: "Failed to update resource. Please try again.",
        type: "error",
      });
    }
  };

  if (resources.length === 0 && !resource) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#059669]"></div>
      </div>
    );
  }

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
            Edit Resource
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {resource ? (
            <ResourceForm
              initial={resource}
              submitLabel="Update Resource"
              submittingLabel="Updating..."
              loading={loading}
              error={error}
              onSubmit={handleSubmit}
              onCancel={() => navigate("/resources")}
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              Resource not found.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default EditResource;
