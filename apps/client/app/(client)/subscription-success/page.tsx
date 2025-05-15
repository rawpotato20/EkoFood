import { useRouter } from "next/router";

//TODO: Replace this with sonner
import toast from "react-hot-toast";

export default function SuccessPage() {
  const router = useRouter();
  const { code } = router.query;

  const codeValue: string =
    typeof code === "string"
      ? code
      : Array.isArray(code)
        ? (code[0] ?? "")
        : "";

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h1 className="text-2xl font-bold text-secondaryflex items-center justify-center mb-4">
        🎉 Prenumerata sėkminga!
      </h1>
      <p className="text-lg text-gray-700 text-center">Jūsų nuolaidos kodas:</p>
      <div className="mt-4 flex items-center justify-center">
        <span className="bg-gray-100 text-gray-800 text-lg font-mono px-4 py-2 rounded-l-lg border border-gray-300">
          {codeValue}
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(codeValue);
            toast.success("Kodas nukopijuotas į iškarpinę.");
          }}
          className="bg-secondary text-white px-4 py-3 rounded-r-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        >
          Kopijuoti
        </button>
      </div>
      <div className="flex items-center justify-center mt-4">
        <button
          onClick={() => router.push("/")}
          className="ml-4 bg-blue-500/85 text-white px-4 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          Grįžti į pradžią
        </button>
      </div>

      <p className="mt-6 text-center text-gray-600">
        Šį kodą galite naudoti atsiskaitymo metu.
      </p>
    </div>
  );
}
