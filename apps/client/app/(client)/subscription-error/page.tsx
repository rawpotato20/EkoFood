import { useRouter } from "next/router";

const SubscriptionError = () => {
  const router = useRouter();
  const { code } = router.query;

  const errorMessages = {
    invalid_token: "Klaida: Neteisingas žetonas. Pabandykite dar kartą.",
    user_not_found: "Klaida: Vartotojas nerastas. Prašome užsiregistruoti.",
    coupon_not_found: "Klaida: Nuolaidos kodas nerastas. Patikrinkite kodą.",
    server_error: "Klaida: Įvyko serverio klaida. Bandykite vėliau.",
  };

  const codeParam = Array.isArray(code) ? code[0] : code;

  const message =
    typeof codeParam === "string" && codeParam in errorMessages
      ? errorMessages[codeParam as keyof typeof errorMessages]
      : "Nežinoma klaida. Prašome bandyti vėliau.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="bg-secondary text-white rounded-t-lg p-6 text-center">
          <h1 className="text-2xl font-bold">⚠️ Klaida</h1>
        </div>

        <div className="p-6 text-gray-700">
          <p className="text-lg font-medium text-center">{message}</p>

          <div className="bg-gray-100 p-4 rounded-lg mt-6">
            <p className="text-center font-semibold text-gray-600">
              💡 Patarimas: Pasitikrinkite informaciją ir bandykite dar kartą.
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center p-6">
          <button
            onClick={() => router.push("/")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Grįžti į pradžią
          </button>
        </div>

        <div className="bg-gray-100 text-center p-4 rounded-b-lg">
          <p className="text-sm text-gray-500">
            © 2025 EkoFood. Visos teisės saugomos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionError;
