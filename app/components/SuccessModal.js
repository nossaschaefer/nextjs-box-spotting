export default function SuccessModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-md max-w-sm">
        <h2 className="text-sm mb-4 text-center">{message}</h2>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-lime-300 text-black px-4 py-2 rounded-md"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
