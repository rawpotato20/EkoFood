"use client";

import { useEffect, useRef, useState } from "react";
import { trackEventFunction } from "@/packages/utils/src/general";
import "@toast-ui/editor/dist/toastui-editor.css";

//TODO: Consider alternatives for react-editor, nookies and toast
import { Editor } from "@toast-ui/react-editor";
import { Editor as EditorType } from "@toast-ui/react-editor";
import { parseCookies } from "nookies";
import toast from "react-hot-toast";

type CustomImageHandler = (
  file: Blob,
  onSuccess: (url: string) => void,
  onError: (message: string) => void,
  adminPassword: string
) => void;

interface ToastUIEditorProps {
  text: string;
  output: string;
  handleTextChange: (markdown: string) => void;
}

// Define the custom image handler
const customImageHandler: CustomImageHandler = (
  file,
  onSuccess,
  onError,
  adminPassword
) => {
  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: adminPassword,
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
    } catch (error: any) {
      onError(error.message);
      toast.error("Upload failed. Please try again.");
    }
  };

  handleImageUpload();
};

const ToastUIEditor = (props: ToastUIEditorProps) => {
  const editorRef = useRef<EditorType | null>(null);

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
      instance.addHook(
        "addImageBlobHook",
        (blob: Blob, callback: (url: string, altText: string) => void) => {
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
        }
      );
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
