/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { ImageIcon, Loader, User } from "lucide-react";
import { useState } from "react";
import axios from "axios";

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
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null); // To store the generated image URL
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<InferenceResult | null>(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    setLoading(true);

    if (file) {
      setFile(file);
      const url = URL.createObjectURL(file); // Generate a temporary URL
      setImageUrl(url);

      const loadImageBase64 = (file: Blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      };

      const image = await loadImageBase64(file);

      axios({
        method: "POST",
        url: "https://detect.roboflow.com/pest-detection-m0inx/1",
        params: {
          api_key: "VAlnq3JGLDoJAYHhL0vF"
        },
        data: image,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
        .then(function (response) {
          setResult(response.data);
          console.log(response.data);

          setLoading(false);
          console.log(result);
        })
        .catch(function (error) {
          console.log(error.message);
          setLoading(false);
        });
    }
  };

  return (
    <div className=" w-full min-h-screen pb-20 pt-5">
      <div className=" w-full flex items-center justify-center ">
        <div className=" w-[90%] mx-auto flex items-center justify-end space-x-4">
          <User />
          <p className=" text-sm font-medium">{email}</p>
        </div>
      </div>
      <div className=" w-[60%] mx-auto space-y-10 h-full flex flex-col text-center justify-center ">
        <h1 className=" font-semibold text-2xl">Pest Detected</h1>
        <div>
          {file ? (
            <div className=" w-full h-[60vh] rounded-2xl flex items-center justify-center">
              <div className=" relative ">
                <img src={`${imageUrl}`} alt="" className=" w-auto h-auto" />
                {result?.predictions.map((prediction) => {
                  const { x, y, width, height } = prediction;
                  const scaledWidth = (width / result.image.width) * 100; // Scale width to percentage
                  const scaledHeight = (height / result.image.height) * 100; // Scale height to percentage

                  return (
                    <div
                      key={prediction.detection_id}
                      style={{
                        position: "absolute",
                        top: `${(y / result.image.height - 0.3) * 100}% `,
                        left: `${(x / result.image.width - 0.1) * 100}% `,
                        width: `${scaledWidth}%`,
                        height: `${scaledHeight}%`
                      }}
                    >
                      <div
                        className=" bg-black/10"
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "100%",
                          border: "2px solid red",
                          boxSizing: "border-box"
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: -15,
                            left: 0,
                            backgroundColor: "white",
                            padding: "2px 5px",
                            color: "black"
                          }}
                        >
                          {prediction.class} ({prediction.confidence.toFixed(2)}
                          )
                        </div>
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
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
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

        <div className=" w-full px-10 pb-5 pt-20  flex items-center divide-x-2 divide-red-950 rounded-2xl shadow-xl">
          <div className=" w-[70%]">
            {result != null ? (
              <div className=" flex items-center space-x-5">
                {result.predictions.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className=" flex flex-col w-fit  space-y-4 text-lg font-semibold"
                    >
                      <div
                        className="radial-progress flex flex-col items-center justify-center bg-red-500 text-red-100 border-red-400 border-4"
                        // @ts-ignore
                        style={{ "--value": 70 }}
                        role="progressbar"
                      >
                        {Math.round(item.confidence * 100)}%
                      </div>
                      <p className=" text-xs capitalize">{item.class}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                <div className=" flex flex-col w-fit  space-y-4 text-lg font-semibold">
                  <div
                    className="radial-progress bg-primary text-primary-content border-primary border-4"
                    // @ts-ignore
                    style={{ "--value": 0 }}
                    role="progressbar"
                  >
                    0%
                  </div>
                  <p>No Detection</p>
                </div>
              </div>
            )}
          </div>
          <div className=" w-[30%] pl-10 space-y-4 ">
            <label
              htmlFor="dropzone-files"
              className=" w-full flex items-center justify-center space-x-2 border-2 border-emerald-500 font-medium transition-all duration-150 ease-linear rounded-md py-4 hover:bg-emerald-500 hover:shadow-xl hover:text-white"
            >
              {loading ? (
                <div className="w-10 h-10 flex items-center justify-center">
                  <Loader size={24} className="animate-spin" />
                </div>
              ) : (
                <ImageIcon size={24} icon="camera" />
              )}
              <p>Detect Pest</p>
              <input
                id="dropzone-files"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {/*  <button
              disabled={true}
              className=" w-full flex items-center text-white justify-center space-x-2 border-2 border-emerald-500 font-medium transition-all duration-150 ease-linear rounded-md py-4 bg-emerald-500 hover:shadow-inner hover:shadow-white  "
            >
              <Bot />
              <p>Detect</p>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
