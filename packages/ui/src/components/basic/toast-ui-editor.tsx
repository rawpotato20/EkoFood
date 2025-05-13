"use client";

import { trackEventFunction } from "@/utils/general";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { parseCookies } from "nookies";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

// Define the custom image handler
const customImageHandler = (file, onSuccess, onError, adminPassword) => {

    const handleImageUpload = async () => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                headers: {
                    "Authorization": adminPassword,
                },
                body: formData,
            }).then((res) => res.json());

            if (res.success) {
                trackEventFunction("Image Uploaded");
                onSuccess(res.data); // Call onSuccess with the image URL
                toast.success(res.message);
            } else {
                onError(res.message); // Call onError with the error message
                toast.error(res.message);
            }
        } catch (error) {
            onError(error.message);
            toast.error("Upload failed. Please try again.");
        }
    };

    handleImageUpload();
};

const ToastUIEditor = (props) => {
    const editorRef = useRef(null);

    const [adminPassword, setAdminPassword] = useState("");

    useEffect(() => {
        let adminPassword = parseCookies().adminPassword;
        if (adminPassword) {
            setAdminPassword(adminPassword);
        }
    }, []);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.getInstance().setMarkdown(props.text);
        }
    }, [props.text]);

    useEffect(() => {
        if (editorRef.current) {
            const instance = editorRef.current.getInstance();
            instance.on("change", () => {
                const markdown = instance.getMarkdown();
                props.handleTextChange(markdown);
            });
        }
    }, []);

    useEffect(() => {
        if (editorRef.current) {
            const instance = editorRef.current.getInstance();

            // Set up the custom image handler
            instance.removeHook("addImageBlobHook");
            instance.addHook("addImageBlobHook", (blob, callback) => {
                customImageHandler(
                    blob,
                    (imageUrl) => {
                        callback(imageUrl, "alt text");
                    },
                    (errorMessage) => {
                        console.log(errorMessage);
                    },
                    adminPassword
                );
            });
        }
    }, []);

    return (
        <>
            <Editor
                initialValue={props.output}
                previewStyle="vertical"
                height="600px"
                initialEditType="wysiwyg"
                useCommandShortcut={true}
                usageStatistics={false}
                hideModeSwitch={false}
                theme="dark"
                ref={editorRef}
            />
        </>
    );
};

export default ToastUIEditor;
