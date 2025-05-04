/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { ImageIcon, Loader, User } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { sendEmail } from "@/lib/utils";
import { toast } from "sonner";

interface InferenceResult {
  inference_id: string;
  time: number;
  image: {
    width: number;
    height: number;
  };
  predictions: Prediction[];
}

interface Prediction {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class: string;
  class_id: number;
  detection_id: string;
}

export default function DetectionComponent({ email }: { email: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InferenceResult | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setFile(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    try {
      const image = await loadImageBase64(file);
      const response = await axios({
        method: "POST",
        url: "https://detect.roboflow.com/pest-detection-m0inx/1",
        params: {
          api_key: "VAlnq3JGLDoJAYHhL0vF"
        },
        data: image,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      setResult(response.data);
      console.log(response.data);

      // Send email for each detected pest
      if (response.data.predictions && response.data.predictions.length > 0) {
        const highestConfidencePrediction = response.data.predictions.reduce(
          (prev: { confidence: number; }, current: { confidence: number; }) =>
            prev.confidence > current.confidence ? prev : current
        );

        toast.promise(
          sendEmail({
            email: email,
            pest: highestConfidencePrediction.class,
            confidence: highestConfidencePrediction.confidence.toFixed(2)
          }),
          {
            loading: "Sending pest alert email...",
            success: () => {
              return "Email sent successfully!";
            },
            error: (error) => {
              return `Failed to send email: ${error.message || "Unknown error"}`;
            }
          }
        );
      } else {
        toast.info("No pests detected - no email sent");
      }
    } catch (error) {
      console.error(
        "Detection error:",
        error instanceof Error ? error.message : "Unknown error"
      );
      toast.error("Failed to process image detection");
    } finally {
      setLoading(false);
    }
  };

  const loadImageBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="w-full min-h-screen pb-20 pt-5">
      {/* Add Sonner Toaster component */}

      <div className="w-full flex items-center justify-center">
        <div className="w-[90%] mx-auto flex items-center justify-end space-x-4">
          <User />
          <p className="text-sm font-medium">{email}</p>
        </div>
      </div>
      <div className="w-[60%] mx-auto space-y-10 h-full flex flex-col text-center justify-center">
        <h1 className="font-semibold text-2xl">Pest Detected</h1>
        <div>
          {file ? (
            <div className="w-full h-[60vh] rounded-2xl flex items-center justify-center">
              <div className="relative">
                <img
                  src={imageUrl || ""}
                  alt="Uploaded pest detection"
                  className="w-auto h-auto max-w-full max-h-[60vh] object-contain"
                />
                {result?.predictions.map((prediction) => {
                  const {
                    x,
                    y,
                    width,
                    height,
                    class: pestClass,
                    confidence
                  } = prediction;
                  const scaledWidth = (width / result.image.width) * 100;
                  const scaledHeight = (height / result.image.height) * 100;
                  const scaledX =
                    (x / result.image.width) * 100 - scaledWidth / 2;
                  const scaledY =
                    (y / result.image.height) * 100 - scaledHeight / 2;

                  return (
                    <div
                      key={prediction.detection_id}
                      style={{
                        position: "absolute",
                        top: `${scaledY}%`,
                        left: `${scaledX}%`,
                        width: `${scaledWidth}%`,
                        height: `${scaledHeight}%`,
                        border: "2px solid red",
                        backgroundColor: "rgba(255, 0, 0, 0.1)",
                        boxSizing: "border-box"
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "-25px",
                          left: "0",
                          backgroundColor: "white",
                          padding: "2px 5px",
                          color: "black",
                          fontSize: "12px",
                          fontWeight: "bold",
                          borderRadius: "4px"
                        }}
                      >
                        {pestClass} ({confidence.toFixed(2)})
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        <div className="w-full px-10 pb-5 pt-20 flex items-center divide-x-2 divide-red-950 rounded-2xl shadow-xl">
          <div className="w-[70%]">
            {result ? (
              <div className="flex items-center space-x-5">
                {result.predictions.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col w-fit space-y-4 text-lg font-semibold"
                  >
                    <div
                      className="radial-progress flex flex-col items-center justify-center bg-red-500 text-red-100 border-red-400 border-4"
                      // @ts-ignore
                      style={{ "--value": item.confidence * 100 }}
                      role="progressbar"
                    >
                      {Math.round(item.confidence * 100)}%
                    </div>
                    <p className="text-xs capitalize">{item.class}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col w-fit space-y-4 text-lg font-semibold">
                <div
                  className="radial-progress bg-gray-200 text-gray-500 border-gray-400 border-4"
                  // @ts-ignore
                  style={{ "--value": 0 }}
                  role="progressbar"
                >
                  0%
                </div>
                <p>No Detection</p>
              </div>
            )}
          </div>
          <div className="w-[30%] pl-10 space-y-4">
            <label
              htmlFor="dropzone-files"
              className="w-full flex items-center justify-center space-x-2 border-2 border-emerald-500 font-medium transition-all duration-150 ease-linear rounded-md py-4 hover:bg-emerald-500 hover:shadow-xl hover:text-white cursor-pointer"
            >
              {loading ? (
                <Loader size={24} className="animate-spin" />
              ) : (
                <>
                  <ImageIcon size={24} />
                  <p>Detect Pest</p>
                </>
              )}
              <input
                id="dropzone-files"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
