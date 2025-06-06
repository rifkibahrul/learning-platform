"use client";

import React, { useRef, useState } from "react";
import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import config from "@/lib/config";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

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
        const response = await fetch(
            `${config.env.apiEndpoint}/api/imagekit`
        );
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

const ImageUpload = ({ onFileChange }: { onFileChange: (filePath: string) => void; }) => {

    // Save reference for click trigger
    const ikupload = useRef(null);

    // Syntax -> const [state, setState] = useState<Type>(initialValue);
        // Save the successfully uploaded file
    const [file, setFile] = useState<{ filePath: string } | null>(null);    
    
    const onError = (error: any) => {
        console.log(error);

        toast({
            title: "Image uploaded failed",
            description: `Your image could not be uploaded. Please try again`,
            variant: "destructive",
        });
    };
    const onSuccess = (res: any) => {
        setFile(res);       // Save upload result to state
        onFileChange(res.filePath);     // Send file path to parent component

        toast({
            title: "Image uploaded successfully",
            description: `${res.filePath} uploaded successfully!`,
        });
    };

    return (
        <ImageKitProvider
            publicKey={publicKey}
            urlEndpoint={urlEndpoint}
            authenticator={authenticator}
        >
            <IKUpload
                className="hidden"
                ref={ikupload}
                onError={onError}
                onSuccess={onSuccess}
                fileName="test-upload.png"
            />

            <button
                className="upload-btn"
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

                <p className="text-base text-light-100">Upload a File</p>

                {file && <p className="upload-filename">{file.filePath}</p>}
            </button>

            {file && (
                <IKImage
                    alt={file.filePath}
                    path={file.filePath}
                    width={500}
                    height={500}
                />
            )}
        </ImageKitProvider>
    );
};

export default ImageUpload;
