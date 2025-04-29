"use client";

import React, { useRef, useState } from "react";
import { IKImage, ImageKitProvider, IKUpload, IKVideo } from "imagekitio-next";
import config from "@/lib/config";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Props {
    type: "image" | "video";
    accept: string;
    placeholder: string;
    folder: string;
    variant: "dark" | "light";
    onFileChange: (filePath: string) => void;
    value?: string;
}

// Get key from config file
const {
    env: {
        imagekit: { publicKey, urlEndpoint },
    },
} = config;

// Authenticate upload image
const authenticator = async () => {
    try {
        // Call endpoint to get token, expire, and signature form server
        const response = await fetch(`${config.env.apiEndpoint}/api/imagekit`);
        if (!response.ok) {
            const errorText = await response.text();

            throw new Error(
                `Request failed with status ${response.status} : ${errorText}`
            );
        }

        const data = await response.json();

        const { signature, expire, token } = data;

        return { token, expire, signature };
    } catch (error: any) {
        throw new Error(`Authentication request failed: ${error.message}`);
    }
};

const FileUpload = ({
    type,
    accept,
    placeholder,
    folder,
    variant,
    onFileChange,
    value,
}: Props) => {
    // Save reference for click trigger
    const ikupload = useRef(null);

    // Syntax -> const [state, setState] = useState<Type>(initialValue);
    // Save the successfully uploaded file
    const [file, setFile] = useState<{ filePath: string | null }>({
        filePath: value ?? null,
    });

    const [progress, setProgress] = useState(0);

    const styles = {
        button:
            variant === "dark"
                ? "bg-dark-300"
                : "bg-light-600 border border-gray-100",
        placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
        text: variant === "dark" ? "text-light-100" : "text-slate-400",
    };

    const onError = (error: any) => {
        console.log(error);

        toast({
            title: `${type} upload failed`,
            description: `Your ${type} could not be uploaded. Please try again`,
            variant: "destructive",
        });
    };

    const onSuccess = (res: any) => {
        setFile(res); // Save upload result to state
        onFileChange(res.filePath); // Send file path to parent component

        toast({
            title: `${type} uploaded successfully`,
            description: `${res.filePath} uploaded successfully!`,
        });
    };

    // Validation image and video
    const onValidate = (file: File) => {
        if (type === "image") {
            if (file.size > 20 * 1024 * 1024) {
                toast({
                    title: "File size too large",
                    description:
                        "Please upload a file that is less than 20mb in size",
                    variant: "destructive",
                });

                return false;
            }
        } else if (type === "video") {
            if (file.size > 100 * 1024 * 1024) {
                toast({
                    title: "File size too large",
                    description:
                        "Please upload a file that is less than 100mb in size",
                    variant: "destructive",
                });

                return false;
            }
        }

        return true;
    };

    return (
        <ImageKitProvider
            publicKey={publicKey}
            urlEndpoint={urlEndpoint}
            authenticator={authenticator}
        >
            <IKUpload
                ref={ikupload}
                onError={onError}
                onSuccess={onSuccess}
                useUniqueFileName={true}
                validateFile={onValidate}
                onUploadStart={() => setProgress(0)}
                onUploadProgress={({ loaded, total }) => {
                    const percent = Math.round((loaded / total) * 100);

                    setProgress(percent);
                }}
                folder={folder}
                accept={accept}
                className="hidden"
            />

            <button
                className={cn("upload-btn", styles.button)}
                onClick={(e) => {
                    e.preventDefault();
                    if (ikupload.current) {
                        // @ts-ignore
                        ikupload.current?.click();
                    }
                }}
            >
                <Image
                    src="/icons/upload.svg"
                    alt="upload-img"
                    width={20}
                    height={20}
                    className="object-contain"
                />

                <p className={cn("text-base", styles.placeholder)}>
                    {placeholder}
                </p>

                {/* Check if file uploaded */}
                {file && (
                    <p className={cn("upload-filename", styles.text)}>
                        {file.filePath}
                    </p>
                )}

                {/* {file && <p className="upload-filename">{file.filePath}</p>} */}
            </button>

            {/* Show progress when upload */}
            {progress > 0 && progress !== 100 && (
                <div className="w-full rounded-full bg-green-200">
                    <div className="progress" style={{ width: `${progress}%` }}>
                        {progress}% upload
                    </div>
                </div>
            )}

            {file &&
                (type === "image" ? (
                    <IKImage
                        alt={file.filePath || ""}
                        path={file.filePath || ""}
                        width={500}
                        height={300}
                    />
                ) : type === "video" ? (
                    <IKVideo
                        path={file.filePath || ""}
                        controls={true}
                        className="h-96 w-full rounded-xl"
                    />
                ) : null)}
        </ImageKitProvider>
    );
};

export default FileUpload;
