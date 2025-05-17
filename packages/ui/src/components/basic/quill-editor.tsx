import { useCallback, useEffect, useMemo, useRef, useState } from "react";

//TODO: Toast to sonner
import toast from "react-hot-toast";
//TODO: Search for other alternatives to Quill
// import QuillEditor, { Quill } from "react-quill";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
//@ts-ignore
import ImageResize from "quill-image-resize-module-react";
//@ts-ignore
import { ImageDrop } from "quill-image-drop-module";
//TODO: Nookies
import { parseCookies } from "nookies";
Quill.register("modules/imageResize", ImageResize);
Quill.register("modules/imageDrop", ImageDrop);

interface EditorProps {
  value: string;
  setValue: (val: string) => void;
}

const Editor = ({ value, setValue }: EditorProps) => {
  // Editor ref
  const quill = useRef<ReactQuill | null>(null);

  const [adminPassword, setAdminPassword] = useState("");

  useEffect(() => {
    let adminPassword = parseCookies().adminPassword;
    if (adminPassword) {
      setAdminPassword(adminPassword);
    }
  }, []);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: {
        Authorization: adminPassword,
      },
      body: formData,
    }).then((res) => res.json());
    if (res.success) {
      return res.data; // Assuming the URL is in res.data
    } else {
      toast.error(res.message);
      throw new Error(res.message);
    }
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (file && quill.current) {
        handleImageUpload(file).then((url) => {
          const range = quill.current?.getEditor().getSelection();
          const editor = quill.current?.getEditor();

          if (editor && range) {
            editor.insertEmbed(range.index, "image", url);
          }
        });
      }
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: true,
      },
      // imageResize: {
      //     displaySize: true,
      // },
      imageDrop: true,
      imageResize: {
        handleStyles: {
          backgroundColor: "black",
          border: "none",
          color: "white",
        },
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
    }),
    [imageHandler]
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "clean",
  ];

  return (
    <ReactQuill
      ref={(el) => {
        quill.current = el;
      }}
      theme="snow"
      value={value}
      onChange={setValue}
      formats={formats}
      modules={modules}
      className="border border-[#3330E4] rounded-xl my-2 w-full"
    />
  );
};

export default Editor;
